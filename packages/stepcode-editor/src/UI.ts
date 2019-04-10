/******************************************************************************
 * import
 *****************************************************************************/
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
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

export enum TargetType {
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

    // 各種要素を作成・構築
    this.doms = {};
    this.buildElements();

    this._stepcode = new StepCode(this.doms[Config.UIType.MainPreviewStepCode], {});
    this._ace = this.createAce();
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
  get stepcode():StepCode {
    return this._stepcode;
  }

  /** AceEditorを返します */
  get ace():Ace.Ace.Editor {
    return this._ace;
  }

  /** Markdownの入力に該当するHTMLElementを返します */
  get md(): HTMLTextAreaElement {
    return this.doms[Config.UIType.EditorMdInput] as HTMLTextAreaElement;
  }

  get code() {
    return this.ace.getValue();
  }
  set code(v:string) {
    this.ace.setValue(v);
    this.ace.clearSelection();
  }

  get mdText() {
    return this.md.value;
  }
  set mdText(v:string) {
    this.md.value = v;;
  }
  
  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * 要素にイベントを追加する
   * @param uiType UIの種類
   * @param name イベントの名前
   * @param func callback関数
   */
  on(target:TargetType, name:string, func:EventListenerOrEventListenerObject) {
    this.getElementByTarget(target).addEventListener(name, func);
  }

  /** 各種要素を取得する */
  get<T extends HTMLElement>(uiType:Config.UIType): T {
    return this.doms[uiType] as T;
  }

  //---------------------------------------------------------------------------
  // private メソッド

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
   * HTMLElementを生成し、階層構造を構築する
   */
  private buildElements() {
    this.createHTMLElements();
    this.createSelectOptionsOfLanguage();
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
   * 全てのHTMLElementを生成する 
   */
  private createHTMLElements() 
  {
    // TODO: この方法はなんとかしないと
    const ignores = [
      Config.UIType.GuideItem
    ]

    Object.values(Config.UIType).map((uiKey) => {
      if(ignores.indexOf(uiKey) === -1){
        this.doms[uiKey] = Config.createElement(uiKey as Config.UIType);
      }
    })
  }

  // TODO: 言語選択オプションの生成
  private createSelectOptionsOfLanguage() {
    const s = this.doms[Config.UIType.EditorHeaderLang] as HTMLSelectElement;
    
    const option = document.createElement('option');
    option.innerHTML = "言語選択(自動)";
    s.appendChild(option);
  
    StepCode.supportLanguages.map((lang) => {
      const o = document.createElement('option') as HTMLOptionElement;
      o.innerHTML = lang;
      o.value     = lang;
      s.appendChild(o);
    })
  }

  /**
   *  メイン要素の階層構造を構築する 
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
    dom[ui.EditorFooter].appendChild(dom[ui.EditorFooterLogo]);
  }

  /** 
   * プレビュー要素の階層構造を構築 
   */
  private buildPreviewElements() 
  {
    const dom = this.doms;
    const ui = Config.UIType;

    dom[ui.MainPreview].appendChild(dom[ui.MainPreviewStepCode]);
  }

  /** 
   * メニュー要素の階層構造を構築 
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

  private get guide() {
    return this.doms[Config.UIType.Guide];
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
  // その他

  /**
   * Ace Editorを初期化(生成)する
   */
  private createAce() {
    const ace = Ace.edit(this.doms[Config.UIType.EditorCodeAce]);
    ace.container.style.lineHeight = "1.5";
    ace.container.style.fontSize = "16px";
    ace.getSession().setUseWorker(false);
    ace.setTheme(ThemeGithub);
    return ace;
  }

  /**
   * Coreの内容でUIを更新する
   * @param core Core
   */
  public update(core: Core) 
  {
    this.updateEditor(core);
    this.updateGuide(core);
    this.updateStepCode(core);
  }

  public updateEditor(core:Core) {
    const step = core.current;
    this.code = (step? step.code : Config.DEF_CODE_TEXT);
    this.mdText = (step? step.desc : Config.DEF_DESC_TEXT);
  }

  /**
   * ステップコードを更新する
   * @param core コア
   */
  public updateStepCode(core:Core) {
    this.stepcode.load(core.toJSON());
    this.stepcode.show(core.currentNo);
  }

  public updateGuide(core:Core, isInsert = false) {
    this.adjustGuideItem(core.count);
    this.clearGuideItemClass();
    this.selectedGuideItem(core.cursor);
    if(isInsert) {
      this.insertedGuideItem(core.cursor);
    }
  }

  /**
   * 指定したコアのデータをダウンロードさせる
   * @param core コア
   */
  public download(core:Core) 
  {
    // ダウンロード用のリンクを取得
    const anchor = this.get<HTMLAnchorElement>(Config.UIType.MenuDownload);

    // ダウンロードURLを生成
    const blob = new Blob(
      [JSON.stringify(core.toJSON())], 
      {type:'application/json'}
    );
    const url = URL.createObjectURL(blob);
    
    // タイトルを取得
    const title = (core.first && core.first.title)? core.first.title : "notitle";
    
    // リンクにダウンロードプロパティを設定
    anchor.href = url;
    anchor.download = title + ".stepdata.json";
  }

  /**
   * 指定されたターゲットに該当するHTMLElementを取得する
   * @param type ターゲットの種類
   */
  private getElementByTarget(type:TargetType) {

    const dic:{[key:number]:Config.UIType} = {
      [TargetType.Title]         :Config.UIType.EditorHeaderTitle,
      [TargetType.Lang]          :Config.UIType.EditorHeaderLang,
      [TargetType.Desc]          :Config.UIType.EditorMdInput,
      [TargetType.AddStepLast]   :Config.UIType.MenuAddStepLast,
      [TargetType.AddStepBefore] :Config.UIType.MenuAddStepBefore,
      [TargetType.AddStepAfter]  :Config.UIType.MenuAddStepAfter,
      [TargetType.DelStep]       :Config.UIType.MenuDelStep,
      [TargetType.Reset]         :Config.UIType.MenuReset,
      [TargetType.Download]      :Config.UIType.MenuDownload,
      [TargetType.LoadFile]      :Config.UIType.MenuLoadFileInput,
    }

    const key = dic[type];
    return this.doms[key];
  }
}