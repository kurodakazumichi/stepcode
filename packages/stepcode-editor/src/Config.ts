/******************************************************************************
 * UIの構成情報を定義したファイル
 *****************************************************************************/

/******************************************************************************
 * 定数
 *****************************************************************************/
/** デフォルトで表示するコードの内容 */
export const DEF_CODE_TEXT = "ここにコードを記述します。";

/** デフォルトで表示する解説の内容 */
export const DEF_DESC_TEXT = "ここには解説を記述します。";

/**
 * ステップコードのデータが存在しない場合に使用される初期データ
 */
export const INIT_DATA = {
  steps:[
    {
      code:DEF_CODE_TEXT, 
      desc:DEF_DESC_TEXT
    }
  ]
}

/******************************************************************************
 * CSSクラス名の定数
 *****************************************************************************/
export const classNames = {
  root               : "sce-root",
  main               : "sce-main",
  mainEditor         : "sce-main__editor",
  mainPreview        : "sce-main__preview",
  mainPreviewStepCode: "sce-main__preview__stepcode",
  editorHeader       : "sce-editor-header",
  editorCode         : "sce-editor-code",
  editorCodeAce      : "sce-editor-code__ace",
  editorMd           : "sce-editor-md",
  editorMdInput      : "sce-editor-md__input",
  editorFooter       : "sce-editor-footer",
  menu               : "sce-menu",
  guide              : "sce-guide",
  guideItem          : "sce-guide__item",
  guideItemSelected  : "sce-guide__item--selected",
  guideItemInserted  : "sce-guide__item--inserted",
}

/******************************************************************************
 * UIのType
 *****************************************************************************/
export enum UIType {
  Main                = "Main",
  MainEditor          = "MainEditor",
  MainPreview         = "MainPreview",
  MainPreviewStepCode = "MainPreviewStepCode",
  EditorHeader        = "EditorHeader",
  EditorHeaderTitle   = "EditorHeaderText",
  EditorHeaderLang    = "EditorHeaderLang",
  EditorCode          = "EditorCode",
  EditorCodeAce       = "EditorCodeAce",
  EditorMd            = "EditorMd",
  EditorMdInput       = "EditorMdInput",
  EditorFooter        = "EditorFooter",
  EditorFooterLogo    = "EditorFooterLogo",
  Menu                = "Menu",
  MenuAddStepLast     = "MenuAddStepLast",
  MenuAddStepBefore   = "MenuAddStepBefore",
  MenuAddStepAfter    = "MenuAddStepAfter",
  MenuDelStep         = "MenuDelStep",
  MenuReset           = "MenuReset",
  MenuDownload        = "MenuDownload",
  Guide               = "Guide",
  GuideItem           = "GuideItem",
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

    /** エディター:ヘッダ */
    [UIType.EditorHeader]: {
      tag:"div",
      className:classNames.editorHeader
    },

    /** エディター:ヘッダ:テキスト */
    [UIType.EditorHeaderTitle]: {
      tag:"input",
      placeholder:"タイトル"
    },

    /** エディター:ヘッダ:言語 */
    [UIType.EditorHeaderLang]: {
      tag:"select",
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

    /** メニュー:ステップを最後に追加ボタン */
    [UIType.MenuAddStepLast]: {
      tag:"button",
      innerHTML:"ステップを最後に追加"
    },
    /** メニュー:ステップを前に追加する */
    [UIType.MenuAddStepBefore]: {
      tag:"button",
      innerHTML:"ステップを前に追加"
    },
    /** メニュー:ステップを後ろに追加する */
    [UIType.MenuAddStepAfter]: {
      tag:"button",
      innerHTML:"ステップを後ろに追加"
    },

    /** メニュー:ステップ削除ボタン */
    [UIType.MenuDelStep]: {
      tag:"button",
      innerHTML:"ステップを削除"
    },

    /** メニュー:リセットボタン */
    [UIType.MenuReset]: {
      tag:"button",
      innerHTML:"リセット"
    },
    /** メニュー:ダウンロード */
    [UIType.MenuDownload]: {
      tag:"a",
      innerHTML:"ダウンロード",
    },
    /** ガイド */
    [UIType.Guide]: {
      tag:"div",
      className: classNames.guide
    },
    /** ガイド:アイテム */
    [UIType.GuideItem]: {
      tag:"div",
      className: classNames.guideItem
    }
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