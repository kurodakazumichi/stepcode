/******************************************************************************
 * UIの構成情報を定義したファイル
 *****************************************************************************/

/******************************************************************************
 * CSSクラス名の定数
 *****************************************************************************/
export const classNames = {
  root               : "sce-root",
  main               : "sce-main",
  mainEditor         : "sce-main__editor",
  mainPreview        : "sce-main__preview",
  mainPreviewStepCode: "sce-main__preview__stepcode",
  editorTitle        : "sce-editor-title",
  editorCode         : "sce-editor-code",
  editorCodeAce      : "sce-editor-code__ace",
  editorMd           : "sce-editor-md",
  editorMdInput      : "sce-editor-md__input",
  editorFooter       : "sce-editor-footer",
  menu               : "sce-menu"
}

/******************************************************************************
 * UIのType
 *****************************************************************************/
export enum UIType {
  Main                = "Main",
  MainEditor          = "MainEditor",
  MainPreview         = "MainPreview",
  MainPreviewStepCode = "MainPreviewStepCode",
  EditorTitle         = "EditorTitle",
  EditorTitleText     = "EditorTitleText",
  EditorCode          = "EditorCode",
  EditorCodeAce       = "EditorCodeAce",
  EditorMd            = "EditorMd",
  EditorMdInput       = "EditorMdInput",
  EditorFooter        = "EditorFooter",
  EditorFooterLogo    = "EditorFooterLogo",
  Menu                = "Menu",
  MenuSaveButton      = "MenuSaveButton",
  MenuUpdateButton    = "MenuUpdateButton"
}

/******************************************************************************
 * UI構成情報
 *****************************************************************************/
const config = 
{
  /**
   * 主要Elementの構成情報
   */
  dom: {
    /** メイン要素 */
    [UIType.Main]: {
      tag:"div",
      className:classNames.main
    },

    /** メイン領域:エディター */
    [UIType.MainEditor]:{
      tag:"span",
      className:classNames.mainEditor,
    },

    /** メイン領域:プレビュー */
    [UIType.MainPreview]: {
      tag:"div",
      className:classNames.mainPreview
    },

    /** メイン領域:プレビュー:ステップコード */
    [UIType.MainPreviewStepCode]:{
      tag:"div",
      className:classNames.mainPreviewStepCode
    },

    /** エディター:タイトル */
    [UIType.EditorTitle]: {
      tag:"div",
      className:classNames.editorTitle
    },

    /** エディター:タイトル:テキスト */
    [UIType.EditorTitleText]: {
      tag:"input",
      placeholder:"ファイル名を入れてね"
    },

    /** エディター:コード */
    [UIType.EditorCode]: {
      tag:"div",
      className:classNames.editorCode
    },

    /** エディター:コード:Ace */
    [UIType.EditorCodeAce]: {
      tag:"div",
      className:classNames.editorCodeAce
    },

    /** エディター:マークダウン */
    [UIType.EditorMd]: {
      tag:"div",
      className:classNames.editorMd,
    },

    /** エディター:マークダウン:入力欄 */
    [UIType.EditorMdInput]: {
      tag:"textarea",
      className:classNames.editorMdInput,
      innerHTML:"解説を入れてね"
    },

    /** エディター:フッター */
    [UIType.EditorFooter]: {
      tag:"div",
      className:classNames.editorFooter,
    },

    /** エディター:フッター:ロゴ */
    [UIType.EditorFooterLogo]: {
      tag:"span",
      innerHTML:"StepCode Editor",
    },

    /** メニュー */
    [UIType.Menu]:{
      tag:"div",
      className:classNames.menu
    },

    /** メニュー:保存ボタン */
    [UIType.MenuSaveButton]: {
      tag:"button",
      innerHTML:"保存"
    },

    /** メニュー:更新ボタン */
    [UIType.MenuUpdateButton]: {
      tag:"button",
      innerHTML:"更新"
    },
  }
}

/**
 * UIの種類からElementを生成する
 * @param uiType 生成するUIの種類
 */
export function createElement(uiType:UIType) :HTMLElement
{
  // UIの構成情報を取得
  const data:any = config.dom[uiType];

  // tagが定義されていない場合はデータ設定ミスなのでエラーだす
  if (!data.tag) {
    console.error(uiType, "tag undefined");
  }
  
  const e = document.createElement(data.tag);
  e.className = (data.className)? data.className : "";
  e.innerHTML = (data.innerHTML)? data.innerHTML : "";

  if (data.placeholder) {
    (e as HTMLInputElement).placeholder = data.placeholder;
  }
  return e;
}