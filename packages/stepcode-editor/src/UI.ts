/******************************************************************************
 * import
 *****************************************************************************/
import Ace from 'ace-builds';
import Core from 'stepcode-core';
import StepCode from 'stepcode';
import * as Config from './Config';
import * as Util from './Util';

/******************************************************************************
 * 型定義
 *****************************************************************************/
type GuideItemOnClickFunction     = (clickIndex:number) => void;
type GuideItemOnDropFunction      = (dragIndex:number, dropIndex:number) => void;
type GuideItemOnDragEnterFunction = (overIndex:number, underIndex:number) => void;
type GuideItemOnDragStartFunction = (startIndex:number) => void;

/******************************************************************************
 * enum
 *****************************************************************************/
/**
 * UIの要素の種類
 */
export enum ElementType {
  Title,
  File,
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

  /** Ace Editorに指定した内容を設定する */
  private set code(v:string) {
    this.ace.setValue(v);
    this.ace.clearSelection();
  }

  /** 解説テキストに指定した内容を設定する */
  private set desc(v:string) {
    this.md.value = v;;
  }

  /** タイトルに指定した内容を設定する */
  private set title(v:string) {
    const title = this.get<HTMLInputElement>(Config.UIType.EditorHeaderTitle);
    title.value = v;
  }

  /** ファイル名に指定された内容を設定する */
  private set file(v:string) {
    const file = this.get<HTMLInputElement>(Config.UIType.EditorHeaderFile);
    file.value = v;
  }

  /** 言語選択に指定した内容を設定する */
  private set lang(v:string) {
    if (v) {
      this.langs.value = v;
    } else {
      this.langs.selectedIndex = 0;
    } 
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
    this.title = (step)? step.title: "";
    this.file  = (step)? step.file : "";
    this.lang  = (step)? step.lang : "";
    this.code  = (step)? step.code : Config.DEF_CODE_TEXT;
    this.desc  = (step)? step.desc : Config.DEF_DESC_TEXT;
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
    this.resetGuideItemClassAll();

    // 現在のステップを選択状態にする
    this.modifyGuideItemToSelected(core.currentIdx);
  }

  //---------------------------------------------------------------------------
  // ガイド全体の操作

  /**
   * ガイドアイテムを指定された数になるように調整します。
   * @param num 調整する数
   */
  public adjustGuideItem(num:number) 
  {
    // 現在のアイテム数と要求されたアイテム数の差分をとる
    const makeCount = num - this.guide.childElementCount;

    // 現在のアイテム数と要求された数が同じであれば作成も削除も必要ない
    if(makeCount === 0) return;

    // 作成数が+なら作成、-なら削除を行う。
    if (0 < makeCount) {
      this.createGuideItems(makeCount);
    } else {
      this.removeGuideItems(Math.abs(makeCount));
    }

    // 作成、削除によって番号がおかしくなっているので再度番号を振り直す。
    this.numberingGuideItem();
  }
  
  /**
   * 指定された数だけGuiteItemを生成します。
   * @param count 作成する要素の数
   */
  private createGuideItems(count:number) 
  {
    const guide = this.guide;

    for(let i = 0; i < count; ++i) {
      const item = this.createGuideItem();
      guide.appendChild(item);
    }
  }

  /**
   * 指定された数だけGuideItemを削除します。
   * @param count 削除する要素の数
   */
  private removeGuideItems(count:number) 
  {
    const guide = this.guide;

    for(let i = 0; i < count; ++i) {
      if (!guide.firstChild) break;
      guide.removeChild(guide.firstChild);
    }
  }

  /**
   * ガイドアイテムの番号を割り振ります。
   */
  private numberingGuideItem() {
    this.mapGuideItem((item, index) => {
      this.setPropGuideItem(item, index);
    })
  }

  /**
   * 全てのガイドアイテムに対し、コールバック処理を実行します。
   * @param callback コールバック関数
   */
  private mapGuideItem(callback:(item:HTMLElement, index:number) => void) 
  {
    const guide = this.guide;
    const count = guide.childElementCount;

    for (let i = 0; i < count; ++i) {
      callback(guide.children[i] as HTMLElement, i);
    }
  }

  /**
   * ガイドアイテム要素を追加し、見た目の調整も合わせて行う
   * @param addBaseIndex ガイドアイテムを追加する基準位置
   * @param isBefore 要素を前に追加するフラグ
   */
  public addGuideItemAndUpdate(addIndex:number, isBefore:boolean) 
  {
    // まず既存のcss classを除去しておく
    this.resetGuideItemClassAll();

    // 新たにガイドアイテムを追加する
    const item = this.addGuideItem(addIndex, isBefore);

    // 追加された要素を選択された状態にする
    if (item) this.modifyGuideItemToSelected(item);

    // 番号を振り直す
    this.numberingGuideItem();
  }

  /**
   * 全ガイドアイテムのCSS CLASSを初期値に戻す
   */
  public resetGuideItemClassAll() {
    this.mapGuideItem((item:HTMLElement) => {
      this.resetGuideItemClass(item);
    });
  }

  //---------------------------------------------------------------------------
  // ガイドアイテムの操作

  createGuideItem(idx?:number) 
  {
    const item = Config.createElement(Config.UIType.GuideItem);
    idx && this.setPropGuideItem(item, idx);
    
    //ドラッグの参考
    item.draggable = true;

    // ドラッグイベントの割り当て
    item.addEventListener('click'    , this.onClickGuideItem.bind(this));
    item.addEventListener('dragstart', this.onDragStartGuideItem.bind(this));
    item.addEventListener('dragenter', this.onDragEnterGuideItem.bind(this));
    item.addEventListener('dragover' , this.onDragOverGuideItem.bind(this));
    item.addEventListener('dragleave', this.onDragLeaveGuideItem.bind(this));
    item.addEventListener('drop'     , this.onDropGuideItem.bind(this));

    return item;
  }

  /**
   * ガイドアイテムのプロパティをセットします。
   * @param item ガイドアイテム
   * @param idx ガイドアイテムに割り当てるIndex
   */
  private setPropGuideItem(item:Element, idx:number) {
    item.innerHTML = (idx + 1).toString();
    Util.dom.set.data(item, 'index', idx.toString());
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

  //---------------------------------------------------------------------------
  // ガイドアイテム スタイル操作

  /**
   * ガイドアイテムのCSS CLASSを初期値に戻す
   */
  public resetGuideItemClass(item:HTMLElement) {
    item.className = Config.classNames.guideItem;
  }

  /**
   * 指定したガイドアイテムを選択された状態にします。
   * @param arg ガイドアイテム要素か、要素を指定するIndex
   */
  public modifyGuideItemToSelected(arg:number|HTMLElement) 
  {
    if (arg instanceof HTMLElement) 
      this.modifyGuideItemToSelected_element(arg);
    else
      this.modifyGuideItemToSelected_number(arg);
  }

  /**
   * 指定したガイドアイテムを選択された状態にする。
   * @param idx ガイドアイテムを指定するIndex
   */
  private modifyGuideItemToSelected_number(idx:number) {
    const item = this.guide.children[idx] as HTMLElement;
    this.modifyGuideItemToSelected_element(item);
  }

  /**
   * 与えられたガイドアイテムを選択された状態にする。
   * @param item 変更を加えたい要素
   */
  private modifyGuideItemToSelected_element(item:HTMLElement | null) {
    item && item.classList.add(Config.classNames.guideItemSelected);
  }

  /**
   * 与えられたガイドアイテムにcss class --enteredを付与する
   * @param item 変更を加えたい要素
   */
  private onGuideItemBlink(item:HTMLElement) {
    item.classList.add(Config.classNames.guideItemBlink);
  }

  /**
   * 与えられたガイドアイテムからcss class --enteredを削除する
   * @param item 変更を加えたい要素
   */
  private offGuideItemBlink(item:HTMLElement) {
    item.classList.remove(Config.classNames.guideItemBlink);
  }

  //---------------------------------------------------------------------------
  // ガイドアイテム イベント

  /**
   * ガイドアイテムがクリックされた時の処理
   */
  private onClickGuideItem(e:Event) 
  {
    // targetがない(なんてことはないが)時は終了
    if (!e.target) return;
      
    // コールバックを実行する
    const idx = Util.dom.get.data(e.target, 'index', '0');
    this.cbOnClickGuideItem(Number(idx));
  }

  /**
   * ガイドアイテムがドラック開始された時の処理
   */
  private onDragStartGuideItem(e:DragEvent) 
  {
    // dataTransferがなけれな終了
    if (!e.dataTransfer) return;

    // dataTarnsferにドラッグされた要素のもつindexを保存
    const idx = Util.dom.get.data(e.target, 'index', '0');
    e.dataTransfer.setData('text', idx);
    
    // コールバックを実行する
    this.cbOnDragStartGuideItem(Number(idx));
  }

  /**
   * ドラッグ中の要素が上に重なった瞬間に実行される処理
   */
  private onDragEnterGuideItem(e:DragEvent) 
  {
    // e.targetがなければ終了
    if (!e.target || !e.dataTransfer) return;
    
    // 点滅を開始する
    this.onGuideItemBlink(e.target as HTMLElement);
    
    // コールバックを実行する
    const overIndex  = Number(Util.dom.get.data(e.target, 'index', '0'));
    const underIndex = Number(e.dataTransfer.getData('text'));
    this.cbOnDragEnterGuideItem(overIndex, underIndex);
  }

  /**
   * 上に重なっていたドラッグ中の要素が離れた時に実行される処理
   */
  private onDragLeaveGuideItem(e:DragEvent) 
  {
    e.preventDefault();

    if (!e.target) return;
    
    // 点滅を解除
    this.offGuideItemBlink(e.target as HTMLElement);
  }

  /**
   * Note:DragOverでe.preventDefault()をしないとdropイベントが動作しないので用意。
   */
  private onDragOverGuideItem(e:DragEvent) {
    e.preventDefault();
  }

  /**
   * ドロップされた時の処理
   */
  private onDropGuideItem(e:DragEvent) 
  {
    e.preventDefault();
    if (!e.dataTransfer) return;
    
    // コールバックを実行
    const dragIdx = Number(e.dataTransfer.getData('text'));
    const dropIdx = Number(Util.dom.get.data(e.target, 'index', '0'));
    this.cbOnDropGuideItem(dragIdx, dropIdx);
  }

  //---------------------------------------------------------------------------
  // ガイドアイテム コールバック

  /**
   * ガイドアイテムがクリックされた時に実行されるコールバック関数
   */
  private cbOnClickGuideItem: GuideItemOnClickFunction = () => {}

  /**
   * ガイドアイテムがドラッグ開始された時に実行されるコールバック関数
   */
  private cbOnDragStartGuideItem: GuideItemOnDragStartFunction = () => {};

  /**
   * ガイドアイテムがドラッグオーバーされた時に実行されるコールバック
   */
  private cbOnDragEnterGuideItem: GuideItemOnDragEnterFunction = () => {};

  /**
   * ガイドアイテムがドロップされた時に実行されるコールバック関数
   */
  private cbOnDropGuideItem:GuideItemOnDropFunction = () => {};

  /**
   * ガイドアイテムのクリック時コールバックを設定する
   * @param callback コールバック
   */
  setCbOnClickGuideItem(callback:GuideItemOnClickFunction) {
    this.cbOnClickGuideItem = callback;
  }

  /**
   * ガイドアイテムのドラッグ開始時コールバックを設定する
   * @param callback コールバック
   */
  setCbOnDragStartGuideItem(callback:GuideItemOnDragStartFunction) {
    this.cbOnDragStartGuideItem = callback;
  }

  /**
   * ガイドアイテムのドラッグオーバー時のコールバックを設定する
   * @param callback コールバック
   */
  setCbOnDragEnterGuideItem(callback:GuideItemOnDragEnterFunction) {
    this.cbOnDragEnterGuideItem = callback;
  }

  /**
   * ガイドアイテムの入れ替え時のコールバックを設定する
   * @param callback コールバック
   */
  setCbOnDropGuideItem(callback:GuideItemOnDropFunction) {
    this.cbOnDropGuideItem = callback;
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
    s.appendChild(Util.dom.make.option("言語選択(自動)"));
  
    // StepCodeのサポート言語の数だけ項目を生成
    StepCode.supportLanguages.map((lang) => {
      s.appendChild(Util.dom.make.option(lang, lang));
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
    this.root.appendChild(this.doms[Config.UIType.Menu]);
    this.root.appendChild(this.doms[Config.UIType.Guide]);
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
    dom[ui.EditorHeader].appendChild(dom[ui.EditorHeaderFile]);
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
  public get md(): HTMLTextAreaElement {
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
      [ElementType.File]          :Config.UIType.EditorHeaderFile,
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
    ace.session.setTabSize(Config.ace.tasSize);
    
    // Configに設定されたStyle、Themeを適用
    Object.assign(ace.container.style, Config.ace.style);
    ace.setTheme(Config.ace.theme);
    
    return ace;
  }
}