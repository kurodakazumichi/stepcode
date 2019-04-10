/******************************************************************************
 * import
 *****************************************************************************/
import Ace from 'ace-builds';
//import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
import Core from 'stepcode-core';
import StepCode from 'stepcode';
import * as Config from './Config';
import * as Util from './Util';

/******************************************************************************
 * 型定義
 *****************************************************************************/
type GuideItemOnClickFunction = (clickIndex:number) => void;
type GuideItemOnSwapFunction = (fromIndex:number, toIndex:number) => void;
type GuideItemOnDragOverFunction = (overIndex:number, underIndex:number) => void;
type GuideItemOnDragStartFunction = (startIndex:number) => void;

/******************************************************************************
 * enum
 *****************************************************************************/
/**
 * UIの要素の種類
 */
export enum ElementType {
  Title,
  Lang,
  Desc,
  AddStepLast,
  AddStepBefore,
  AddStepAfter,
  DelStep,
  Reset,
  Download,
  LoadFile,
}

/******************************************************************************
 * StepCodeで必要な全てのHTMLElementを管理するクラス
 *****************************************************************************/
export default class UI {

  /**
   * StepCodeEditorに必要な全てのHTMLElementを生成・構築する
   * @param target ルート要素を取得するセレクター、またはHTML要素
   */
  constructor(target:string |  HTMLElement) 
  {
    // ルート要素を取得、保持
    this.root = this.getRoot(target);

    // rootが取得できなければこの後の処理は基本的に失敗するのでエラーを表示して終了
    if (!this.root) {
      console.error(`指定された要素がみつかりませんでした。`);
    }

    // 各種要素を作成・構築
    this.doms = {};
    this.buildElements();

    // サードパーティ製のUIライブラリを生成
    this._stepcode = this.createStepCode();
    this._ace      = this.createAce();
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** UI Root */
  private root:HTMLElement;

  /** StepCodeEditorの全HTMLElementリスト */
  private doms:{[key:string]:HTMLElement};

  /** StepCode本体 */
  private _stepcode:StepCode;

  /** Ace Editor */
  private _ace:Ace.Ace.Editor;


  //---------------------------------------------------------------------------
  // public プロパティ

  /** StepCodeを返します */
  public get stepcode():StepCode {
    return this._stepcode;
  }

  /** AceEditorを返します */
  public get ace():Ace.Ace.Editor {
    return this._ace;
  }

  /** Ace Editorに入力されている内容を取得する */
  public get code() {
    return this.ace.getValue();
  }

  /** Ace Editorに指定した内容を設定する */
  public set code(v:string) {
    this.ace.setValue(v);
    this.ace.clearSelection();
  }

  /** 解説テキストに入力されている内容を取得する */
  public get desc() {
    return this.md.value;
  }

  /** 解説テキストに指定した内容を設定する */
  public set desc(v:string) {
    this.md.value = v;;
  }

  /** EditorのFooterに表示される現在表示しているステップの番号を設定する */
  public set footerInfo(no:number) {
    const info = this.get(Config.UIType.EditorFooterInfo);
    info.innerHTML = `Step ${no}`;
  }

  //---------------------------------------------------------------------------
  // イベント関連

  /**
   * 要素にイベントを追加する
   * @param uiType UIの種類
   * @param name イベントの名前
   * @param func callback関数
   */
  public on(target:ElementType, name:string, func:EventListenerOrEventListenerObject) {
    this.getElementByTarget(target).addEventListener(name, func);
  }

  //---------------------------------------------------------------------------
  // UIの更新

  /**
   * Coreの内容でUIを更新する
   * @param core StepCode Core
   */
  public update(core: Core) {
    this.updateEditor(core);
    this.updateStepCode(core);
    this.updateGuide(core);
  }

  /**
   * Coreの内容でEditorを更新する
   * @param core StepCode Core
   */
  public updateEditor(core:Core) {
    const step = core.current;
    this.code = (step? step.code : Config.DEF_CODE_TEXT);
    this.desc = (step? step.desc : Config.DEF_DESC_TEXT);
    this.footerInfo = core.currentNo;
  }

  /**
   * Coreの内容でステップコードを更新する
   * @param core StepCode Core
   */
  public updateStepCode(core:Core) {
    this.stepcode.load(core.toJSON());
    this.stepcode.show(core.currentNo);
  }

  /**
   * Coreの内容でガイドを更新する
   * @param core StepCode Core
   */
  public updateGuide(core:Core) 
  {
    // ガイドアイテムの数を調整する
    this.adjustGuideItem(core.count);

    // スタイルを破棄する
    this.clearGuideItemClass();

    // 現在のステップを選択状態にする
    this.selectedGuideItem(core.currentIdx);
  }

  //---------------------------------------------------------------------------
  // ガイドアイテム関連



  createGuideItem(idx?:number) {
    const item = Config.createElement(Config.UIType.GuideItem);
    idx && this.setPropGuideItem(item, idx);
    
    //ドラッグの参考
    item.draggable = true;

    item.addEventListener('click', (e:Event) => {
      if (!e.target) return;
      
      const idx = Util.getData(e.target, 'index', '0');
      this.cbOnClickGuideItem(Number(idx));
    });
    
    
    item.addEventListener('dragstart', (e:DragEvent) => {
      if (!e.dataTransfer) return;
      const idx = Util.getData(e.target, 'index', '0');
      e.dataTransfer.setData('text', idx);
      //this.tmpDragStart(Util.getData(e.target, 'index', '0'));
      
      this.cbOnDragStartGuideItem(Number(idx));
      console.log(idx);
    })
    item.addEventListener('dragover', (e:Event) => {
      e.preventDefault();
      if(e.target) {
        (e.target as HTMLElement).style.background = "#12948a";
      }

      this.cbOnDragOverGuideItem(Number(Util.getData(e.target, 'index', '0')), 0);
      
    });
    item.addEventListener('dragleave', (e:Event) => {
      e.preventDefault();
      if(e.target) {
        (e.target as HTMLElement).style.background = "";
      }
    })
    item.addEventListener('drop', (e:DragEvent) => {
      if (!e.dataTransfer) return;
      e.preventDefault();
      const fromIdx = Number(e.dataTransfer.getData('text'));
      const toIdx   = Number(Util.getData(e.target, 'index', '0'));
      
      (e.target as HTMLElement).style.background = "";
      this.cbOnSwapGuideItem(fromIdx, toIdx);

    })

    return item;
  }

  private setPropGuideItem(item:Element, idx:number) {

    item.innerHTML = (idx + 1).toString();
    Util.setData(item, 'index', idx.toString());

  }
  public insertGuideItem(idx:number) {
    const target = this.guide.children[idx];
    if (!target) return;

    const item = this.createGuideItem();
    target.after(item);

    this.reNumberingGuideItem();
    this.insertedGuideItem(idx);
  }
  public adjustGuideItem(num:number) {
    
    const makeCount = num - this.guide.childElementCount;

    if(makeCount === 0) return;

    if (0 < makeCount) {
      this.createGuideItems(makeCount);
    } else {
      this.removeGuideItems(Math.abs(makeCount));
    }

    this.reNumberingGuideItem();
  }


  private createGuideItems(count:number) {
    
    for(let i = 0; i < count; ++i) {
      const item = this.createGuideItem();
      this.guide.appendChild(item);
    }
  }

  private removeGuideItems(count:number) {
    const guide = this.guide;
    for(let i = 0; i < count; ++i) {
      if (!guide.firstChild) break;
      guide.removeChild(guide.firstChild);
      
    }
  }

  public reNumberingGuideItem() {
    this.mapGuideItem((item, index) => {
      this.setPropGuideItem(item, index);
    })
  }

  private mapGuideItem(callback:(item:Element, index:number) => void) {
    const guide = this.doms[Config.UIType.Guide];
    const count = guide.childElementCount;

    for (let i = 0; i < count; ++i) {
      callback(guide.children[i], i);
    }
  }

  setCbOnClickGuideItem(callback:GuideItemOnClickFunction) {
    this.cbOnClickGuideItem = callback;
  }
  setCbOnSwapGuideItem(callback:GuideItemOnSwapFunction) {
    this.cbOnSwapGuideItem = callback;
  }
  setCbOnDragStartGuideItem(callback:GuideItemOnDragStartFunction) {
    this.cbOnDragStartGuideItem = callback;
  }
  setCbOnDragOverGuideItem(callback:GuideItemOnDragOverFunction) {
    this.cbOnDragOverGuideItem = callback;
  }

  private cbOnClickGuideItem: GuideItemOnClickFunction = () => {}
  private cbOnSwapGuideItem:GuideItemOnSwapFunction = () => {};
  private cbOnDragStartGuideItem: GuideItemOnDragStartFunction = () => {};
  private cbOnDragOverGuideItem: GuideItemOnDragOverFunction = () => {};

  public clearGuideItemClass() {
    const guide = this.doms[Config.UIType.Guide];
    guide.childNodes.forEach((node) => {
      (node as HTMLElement).classList.remove(Config.classNames.guideItemSelected);
      (node as HTMLElement).classList.remove(Config.classNames.guideItemInserted);
    })
  }

  public selectedGuideItem(idx:number) {
    const guide = this.doms[Config.UIType.Guide];
    const target = guide.children[idx];
    
    if(target) {
      target.classList.add(Config.classNames.guideItemSelected);
    }
  }

  public insertedGuideItem(idx:number) {
    const guide = this.doms[Config.UIType.Guide];
    const target = guide.children[idx];
    
    if(!target) return;

    if(target) {
      const index = Number(Util.getData(target, 'index', '0'));
      const item = this.createGuideItem(index);
      target.classList.forEach((v) => {
        item.classList.add(v);
      })
      item.classList.add(Config.classNames.guideItemInserted);
      
      
      target.after(item);
      target.remove();
    }
  }

  /**
   * ガイドアイテム要素を追加する
   * @param idx 要素を追加する位置を指定する
   * @param isBefore 要素を前に追加するフラグ
   * @returns 追加された要素を返す
   */
  public addGuideItem(idx:number, isBefore = false) 
  {
    // 初期処理
    const { guide } = this;

    // まずガイド要素を生成し、新規作成を表現するcss classをセットする。
    const item = this.createGuideItem();
    item.classList.add(Config.classNames.guideItemInserted);

    // そもそも子要素がまだ存在しない場合は単純に追加する
    if (guide.childElementCount === 0) {
      guide.appendChild(item);
      return　item;
    }

    // 要素を追加するために基準となる子要素を取得する
    const child = guide.children[idx];

    // 子要素が取得できたらその前、もしくは後ろに要素を追加する
    if (child) {
      (isBefore)? child.before(item) : child.after(item);
      return item;
    }

    return null;
  }

  /**
   * ガイドアイテム要素を追加し、見た目の調整も合わせて行う
   * @param addBaseIndex ガイドアイテムを追加する基準位置
   * @param isBefore 要素を前に追加するフラグ
   */
  public addGuideItemAndUpdate(addIndex:number, isBefore:boolean) 
  {
    // まず既存のcss classを除去しておく
    this.clearGuideItemClass();

    // 新たにガイドアイテムを追加する
    const item = this.addGuideItem(addIndex, isBefore);

    // 追加された要素を選択された状態にする
    this.modifyGuideItemToSelected(item);

    // 番号を振り直す
    this.reNumberingGuideItem();
  }

  /**
   * 与えられたガイドアイテムを選択された状態にする。
   * @param item 変更を加えたい要素
   */
  modifyGuideItemToSelected(item:HTMLElement | null) {
    item && item.classList.add(Config.classNames.guideItemSelected);
  }
    




  //---------------------------------------------------------------------------
  // HTMLElement生成関連(1度しか実行しないもの)

  /** 
   * StepCode Editorで使用する主要なHTMLElementを生成する。
   * この関数は１度だけ実行する。
   */
  private createHTMLElements() 
  {

    // 生成から除外する要素のリストを定義
    const ignores = [
      Config.UIType.GuideItem
    ]

    // 除外対象以外のHTMLElementを生成
    Object.values(Config.UIType).map((uiKey) => {
      if(ignores.indexOf(uiKey) === -1){
        this.doms[uiKey] = Config.createElement(uiKey as Config.UIType);
      }
    });

    // 言語セレクトボックスの中身を生成
    this.createSelectOptionsOfLanguage();
  }

  /**
   * 言語セレクトボックスの選択項目(option)を生成する。
   * この関数は１度だけ実行する。
   */
  private createSelectOptionsOfLanguage() 
  {
    // 言語セレクトボックスを取得
    const s = this.langs;
    
    // デフォルトの項目を生成
    s.appendChild(Util.createOption("言語選択(自動)"));
  
    // StepCodeのサポート言語の数だけ項目を生成
    StepCode.supportLanguages.map((lang) => {
      s.appendChild(Util.createOption(lang, lang));
    })
  }

  /**
   * HTMLElementを生成し、階層構造を構築する。
   * この関数は１度だけ実行する。
   */
  private buildElements() 
  {
    // 動的に変化しないHTML要素を生成する。
    this.createHTMLElements();

    // 各種要素の階層構造を構築する。
    this.buildMainElements();
    this.buildEditorElements();
    this.buildPreviewElements();
    this.buildMenuElements();

    // ルート要素の階層構築
    this.root.appendChild(this.doms[Config.UIType.Main]);
    this.root.appendChild(this.doms[Config.UIType.Guide]);
    this.root.appendChild(this.doms[Config.UIType.Menu]);
  }

  /**
   * メイン要素の階層構造を構築する 
   * この関数は１度だけ実行する。
   */
  private buildMainElements() 
  {
    const dom = this.doms;
    const ui = Config.UIType;
   
    dom[ui.Main].appendChild(dom[ui.MainEditor]);
    dom[ui.Main].appendChild(dom[ui.MainPreview]);
  }

  /** 
   * エディター要素の階層構造を構築する 
   * この関数は１度だけ実行する。
   */
  private buildEditorElements() 
  {
    const dom = this.doms;
    const ui = Config.UIType;

    // エディタ直下
    dom[ui.MainEditor].appendChild(dom[ui.EditorHeader]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorCode]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorMd]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorFooter]);

    // エディタ:タイトル直下
    dom[ui.EditorHeader].appendChild(dom[ui.EditorHeaderTitle]);
    dom[ui.EditorHeader].appendChild(dom[ui.EditorHeaderLang]);

    // エディタ:コード直下
    dom[ui.EditorCode].appendChild(dom[ui.EditorCodeAce]);
    
    // エディタ:マークダウン直下
    dom[ui.EditorMd].appendChild(dom[ui.EditorMdInput]);
    
    // エディタ:フッター直下
    dom[ui.EditorFooter].appendChild(dom[ui.EditorFooterInfo]);
    dom[ui.EditorFooter].appendChild(dom[ui.EditorFooterLogo]);
  }

  /** 
   * プレビュー要素の階層構造を構築
   * この関数は１度だけ実行する。
   */
  private buildPreviewElements() 
  {
    const dom = this.doms;
    const ui = Config.UIType;

    dom[ui.MainPreview].appendChild(dom[ui.MainPreviewStepCode]);
  }

  /** 
   * メニュー要素の階層構造を構築
   * この関数は１度だけ実行する。
   */
  private buildMenuElements() 
  {
    const dom = this.doms;
    const ui = Config.UIType;

    dom[ui.Menu].appendChild(dom[ui.MenuAddStepBefore]);
    dom[ui.Menu].appendChild(dom[ui.MenuAddStepAfter]);
    dom[ui.Menu].appendChild(dom[ui.MenuAddStepLast]);
    dom[ui.Menu].appendChild(dom[ui.MenuDelStep]);
    dom[ui.Menu].appendChild(dom[ui.MenuDownload]);
    dom[ui.Menu].appendChild(dom[ui.MenuReset]);
    dom[ui.Menu].appendChild(dom[ui.MenuLoadFile]);
    dom[ui.Menu].appendChild(dom[ui.MenuLoadFileInput]); 
  }

  //---------------------------------------------------------------------------
  // 要素の取得

  /** 
   * Config.UITypeから該当するHTMLElementを取得する
   * 取得する際にGeneriscで型を指定可能
   */
  public get<T extends HTMLElement>(uiType:Config.UIType): T {
    return this.doms[uiType] as T;
  }

  /**
   * 言語セレクトボックス
   */
  private get langs() : HTMLSelectElement {
    return this.get<HTMLSelectElement>(Config.UIType.EditorHeaderLang);
  }

  /** 
   * Markdownの入力に該当するHTMLElementを返します 
   */
  private get md(): HTMLTextAreaElement {
    return this.get<HTMLTextAreaElement>(Config.UIType.EditorMdInput);
  }

  /** 
   * ガイド要素を取得する 
   */
  private get guide() {
    return this.get<HTMLElement>(Config.UIType.Guide);
  }

  /**
   * ルート要素を取得する。
   * @param target ルート要素を取得するselector、もしくはルート要素
   */
  private getRoot(target:string |  HTMLElement) : HTMLElement 
  {
    let root;

    // targetがHTMLElementであればそのまま
    if (target instanceof HTMLElement) {
      root = target;
    } 
    
    // HTMLElementでなければ、selector文字列として処理する
    else {
      root = document.querySelector(target) as HTMLElement;
    }

    return root;
  }

  /**
   * 指定された[[ElementType]]に該当するHTMLElementを取得する
   * @param type ターゲットの種類
   */
  private getElementByTarget(type:ElementType) 
  {
    // ElementTypeとConfig.UITypeのマッピングテーブル
    const dic:{[key:number]:Config.UIType} = {
      [ElementType.Title]         :Config.UIType.EditorHeaderTitle,
      [ElementType.Lang]          :Config.UIType.EditorHeaderLang,
      [ElementType.Desc]          :Config.UIType.EditorMdInput,
      [ElementType.AddStepLast]   :Config.UIType.MenuAddStepLast,
      [ElementType.AddStepBefore] :Config.UIType.MenuAddStepBefore,
      [ElementType.AddStepAfter]  :Config.UIType.MenuAddStepAfter,
      [ElementType.DelStep]       :Config.UIType.MenuDelStep,
      [ElementType.Reset]         :Config.UIType.MenuReset,
      [ElementType.Download]      :Config.UIType.MenuDownload,
      [ElementType.LoadFile]      :Config.UIType.MenuLoadFileInput,
    }

    // 指定されたElementTypeに該当するHTMLElementを返す
    return this.get<HTMLElement>(dic[type]);
  }

  //---------------------------------------------------------------------------
  // サードパーティ製のライブラリを生成する

  /**
   * StepCodeを初期化(生成)する
   */
  private createStepCode() {
    return new StepCode(this.doms[Config.UIType.MainPreviewStepCode], {});
  }

  /**
   * Ace Editorを初期化(生成)する
   */
  private createAce() 
  {
    // Ace Editorを生成
    const ace = Ace.edit(this.doms[Config.UIType.EditorCodeAce]);

    // 構文チェックを無効にする
    ace.getSession().setUseWorker(false);

    // Configに設定されたStyle、Themeを適用
    Object.assign(ace.container.style, Config.ace.style);
    ace.setTheme(Config.ace.theme);
    
    return ace;
  }
}