/******************************************************************************
 * import
 *****************************************************************************/
import Core from 'stepcode-core';
import StepCode from 'stepcode';
import * as Config from './config';
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';

/******************************************************************************
 * StepCodeEditorの本体
 *****************************************************************************/
export default class StepCodeEditor {

  constructor(selector:string | HTMLElement) 
  {
    // StepCode(コア)を保持
    this.core = new Core({});

    // ルート要素を取得、保持
    this.root = this.getRoot(selector);

    console.log(this.core);
    this.buildElement();
  }

  private buildElement() {

    const main = Config.createElement(Config.UIType.Main);
    const mainEditor = Config.createElement(Config.UIType.MainEditor);
    const mainPreview = Config.createElement(Config.UIType.MainPreview);
    const mainPreviewStepCode = Config.createElement(Config.UIType.MainPreviewStepCode);
    const editorTitle = Config.createElement(Config.UIType.EditorTitle);
    const editorTitleText = Config.createElement(Config.UIType.EditorTitleText);
    const editorCode = Config.createElement(Config.UIType.EditorCode);
    const editorCodeAce = Config.createElement(Config.UIType.EditorCodeAce);
    const editorMd = Config.createElement(Config.UIType.EditorMd);
    const editorMdInput = Config.createElement(Config.UIType.EditorMdInput);
    const editorFooter = Config.createElement(Config.UIType.EditorFooter);
    const editorFooterLogo = Config.createElement(Config.UIType.EditorFooterLogo);
    const menu = Config.createElement(Config.UIType.Menu);
    const menuSaveButton = Config.createElement(Config.UIType.MenuSaveButton);

    // メインの構築
    main.appendChild(mainEditor);
    main.appendChild(mainPreview);
    

    // エディターの構築
    mainEditor.appendChild(editorTitle);
    editorTitle.appendChild(editorTitleText);
    mainEditor.appendChild(editorCode);
    editorCode.appendChild(editorCodeAce);
    mainEditor.appendChild(editorMd);
    editorMd.appendChild(editorMdInput);
    mainEditor.appendChild(editorFooter);
    editorFooter.appendChild(editorFooterLogo);

    // プレビューの構築
    mainPreview.appendChild(mainPreviewStepCode);

    // メニューの構築
    menu.appendChild(menuSaveButton);

    // ルートの構築
    this.root.appendChild(main);
    this.root.appendChild(menu);

    // ステップコード初期化
    new StepCode(mainPreviewStepCode, {});

    // Aceを初期化
    const editor = Ace.edit(editorCodeAce);
    editor.getSession().setUseWorker(false);
    editor.setTheme(ThemeGithub);

  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** StepCode本体 */
  private core:Core;

  /** UI Root */
  private root:HTMLElement;

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
}
