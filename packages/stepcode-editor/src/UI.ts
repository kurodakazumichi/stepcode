/******************************************************************************
 * import
 *****************************************************************************/
import * as Config from './Config';

/******************************************************************************
 * StepCodeで必要な全てのHTMLElementを管理するクラス
 *****************************************************************************/
export default class UI {

  /**
   * StepCodeEditorに必要な全てのHTMLElementを生成・構築する
   * @param target ルート要素を取得するセレクター、またはHTML要素
   */
  constructor(target:string | HTMLElement) 
  {
    // ルート要素を取得、保持
    this.root = this.getRoot(target);

    // 各種要素を作成・構築
    this.doms = {};
    this.buildElements();
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** UI Root */
  private root:HTMLElement;

  /** StepCodeEditorの全HTMLElementリスト */
  private doms:{[key:string]:HTMLElement};

  //---------------------------------------------------------------------------
  // private プロパティ

  /** StepCodeに該当するHTMLElementを返します */
  get stepcode():HTMLElement {
    return this.doms[Config.UIType.MainPreviewStepCode];
  }

  /** AceEditorに該当するHTMLElementを返します */
  get ace():HTMLElement {
    return this.doms[Config.UIType.EditorCodeAce];
  }

  /** Markdownの入力に該当するHTMLElementを返します */
  get md(): HTMLTextAreaElement {
    return this.doms[Config.UIType.EditorMdInput] as HTMLTextAreaElement;
  }

  /**
   * 要素にイベントを追加する
   * @param uiType UIの種類
   * @param name イベントの名前
   * @param func callback関数
   */
  on(uiType:Config.UIType, name:string, func:EventListenerOrEventListenerObject) {
    this.doms[uiType].addEventListener(name, func);
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * ルート要素を取得する。
   * @param target ルート要素を取得するselector、もしくはルート要素
   */
  private getRoot(target:string | HTMLElement) : HTMLElement 
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
    this.buildMainElements();
    this.buildEditorElements();
    this.buildPreviewElements();
    this.buildMenuElements();

    // ルート要素の階層構築
    this.root.appendChild(this.doms[Config.UIType.Main]);
    this.root.appendChild(this.doms[Config.UIType.Menu]);
  }

  /** 
   * 全てのHTMLElementを生成する 
   */
  private createHTMLElements() 
  {
    console.log(Config.UIType);
    Object.values(Config.UIType).map((uiKey) => {
      this.doms[uiKey] = Config.createElement(uiKey as Config.UIType);
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
    dom[ui.MainEditor].appendChild(dom[ui.EditorTitle]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorCode]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorMd]);
    dom[ui.MainEditor].appendChild(dom[ui.EditorFooter]);

    // エディタ:タイトル直下
    dom[ui.EditorTitle].appendChild(dom[ui.EditorTitleText]);

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

    dom[ui.Menu].appendChild(dom[ui.MenuAddStep]);
    dom[ui.Menu].appendChild(dom[ui.MenuDelStep]);
    
  }

}