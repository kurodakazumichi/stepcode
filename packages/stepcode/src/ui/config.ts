/******************************************************************************
 * UIの構成情報を定義したファイル
 *****************************************************************************/

/******************************************************************************
 * CSSクラス名の定数
 *****************************************************************************/
export const classNames = {
  root: 'sc-root',
  header: 'sc-header',
  headerTitle: 'sc-header__title',
  headerFileName: 'sc-header__filename',
  editor: 'sc-editor',
  editorLines: 'sc-editor__lines',
  editorLinesItem: 'sc-editor__lines__item',
  editorLinesItemMark: 'sc-editor__lines__item--marking',
  editorCodes: 'sc-editor__codes',
  comment: 'sc-comment',
  footer: 'sc-footer',
  footerLogo: 'sc-footer__logo',
  buttons: 'sc-buttons',
  buttonsItem: 'sc-buttons__item',
  buttonsItemDisable: 'sc-buttons__item--disable',
  pager: 'sc-pager',
  pagerCurrent: 'sc-pager__current',
  pagerSepalater: 'sc-pager__sepalater',
  pagerTotal: 'sc-pager__total',
  progress: 'sc-progress',
  progressItem: 'sc-progress__item',
  progressItemActive: 'sc-progress__item--active',
  markdown: 'sc-markdown'
};

/******************************************************************************
 * UIのType
 *****************************************************************************/
export enum UIType {
  Header = 'Header',
  HeaderTitle = 'HeaderTitle',
  HeaderFileName = 'HeaderFileName',
  Editor = 'Editor',
  EditorLines = 'EditorLines',
  EditorLinesItem = 'EditorLinesItem',
  EditorCodes = 'EditorCodes',
  EditorCodesPre = 'EditorCodesPre',
  EditorCodesPreCode = 'EditorCodesPrecode',
  Comment = 'Comment',
  Footer = 'Footer',
  FooterLogo = 'FooterLogo',
  Buttons = 'Buttons',
  ButtonsPrev = 'ButtonsPrev',
  ButtonsNext = 'ButtonsNext',
  Pager = 'Pager',
  PagerCurrent = 'PagerCurrent',
  PagerSepalater = 'PagerSepalater',
  PagerTotal = 'PagerTotal',
  Progress = 'Progress',
  ProgressItem = 'ProgressItem',
  Markdown = 'Markdown'
}

/******************************************************************************
 * UI構成情報
 *****************************************************************************/
const config = {
  /**
   * 主要Elementの構成情報
   */
  dom: {
    /** ヘッダ */
    [UIType.Header]: {
      tag: 'div',
      className: classNames.header,
      innerHTML: '&nbsp;'
    },

    /** ヘッダ:タイトル */
    [UIType.HeaderTitle]: {
      tag: 'span',
      className: classNames.headerTitle
    },

    /** ヘッダ:ファイルネーム */
    [UIType.HeaderFileName]: {
      tag: 'div',
      className: classNames.headerFileName
    },

    /** エディター */
    [UIType.Editor]: {
      tag: 'div',
      className: classNames.editor
    },

    /** エディター:行番号 */
    [UIType.EditorLines]: {
      tag: 'ol',
      className: classNames.editorLines
    },

    /** エディター:行番号:行 */
    [UIType.EditorLinesItem]: {
      tag: 'li',
      className: classNames.editorLinesItem
    },

    /** エディター:コード */
    [UIType.EditorCodes]: {
      tag: 'div',
      className: classNames.editorCodes
    },

    /** エディター:コード:pre要素 */
    [UIType.EditorCodesPre]: {
      tag: 'pre'
    },

    /** エディター:コード:pre要素:code要素 */
    [UIType.EditorCodesPreCode]: {
      tag: 'code'
    },

    /** コメント */
    [UIType.Comment]: {
      tag: 'div',
      className: classNames.comment
    },

    /** フッター */
    [UIType.Footer]: {
      tag: 'div',
      className: classNames.footer
    },

    /** ロゴ */
    [UIType.FooterLogo]: {
      tag: 'span',
      className: classNames.footerLogo,
      innerHTML: 'StepCode'
    },

    /** ボタン */
    [UIType.Buttons]: {
      tag: 'div',
      className: classNames.buttons
    },

    /** ボタン:戻る */
    [UIType.ButtonsPrev]: {
      tag: 'button',
      className: classNames.buttonsItem,
      innerHTML: '◀︎'
    },

    /** ボタン:次へ */
    [UIType.ButtonsNext]: {
      tag: 'button',
      className: classNames.buttonsItem,
      innerHTML: '▶︎'
    },

    /** ページャー */
    [UIType.Pager]: {
      tag: 'div',
      className: classNames.pager
    },

    /** ページャー:現在ページ */
    [UIType.PagerCurrent]: {
      tag: 'span',
      className: classNames.pagerCurrent,
      innerHTML: '0'
    },

    /** ページャー:ページ区切り */
    [UIType.PagerSepalater]: {
      tag: 'span',
      className: classNames.pagerSepalater,
      innerHTML: '/'
    },

    /** ページャー:最大ページ */
    [UIType.PagerTotal]: {
      tag: 'span',
      className: classNames.pagerTotal,
      innerHTML: '0'
    },

    /** ページャー:進捗バー */
    [UIType.Progress]: {
      tag: 'div',
      className: classNames.progress
    },

    /** ページャー:進捗バー:要素 */
    [UIType.ProgressItem]: {
      tag: 'span',
      className: classNames.progressItem
    },

    /** マークダウン */
    [UIType.Markdown]: {
      tag: 'div',
      className: classNames.markdown
    }
  }
};

/**
 * UIの種類からElementを生成する
 * @param uiType 生成するUIの種類
 */
export function createElement(uiType: UIType): HTMLElement {
  // UIの構成情報を取得
  const data: any = config.dom[uiType];

  // tagが定義されていない場合はデータ設定ミスなのでエラーだす
  if (!data.tag) {
    console.error(uiType, 'tag undefined');
  }

  const e = document.createElement(data.tag);
  Object.assign(e, data);

  return e;
}
