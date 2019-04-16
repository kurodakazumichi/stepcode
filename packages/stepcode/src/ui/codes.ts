/******************************************************************************
 * import
 *****************************************************************************/
import hljs from 'highlight.js';
import * as Config from './config';
import EscapeHtml from 'escape-html';
import { Types } from '..';

/******************************************************************************
 * Code
 *****************************************************************************/
export default class Codes implements Types.IUI {
  /**
   * コンストラクタ
   */
  constructor() {
    // 全体を包むrootとpre、codeタグを生成
    this.root = Config.createElement(Config.UIType.EditorCodes);
    this.pre = Config.createElement(Config.UIType.EditorCodesPre);
    this.code = Config.createElement(Config.UIType.EditorCodesPreCode);

    // 親子関係の構築
    this.build();
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** rootノードのアクセッサ */
  public get node() {
    return this.root;
  }

  /** 言語を設定する */
  public set lang(lang: string) {
    this.code.className = hljs.getLanguage(lang) ? lang : '';
  }

  /** ソースコードを設定する */
  public set codetext(codetext: string) {
    this.code.innerHTML = EscapeHtml(codetext + '\n');
    hljs.highlightBlock(this.code as hljs.Node);
  }

  /** コードを設定する */
  public get codeNode() {
    return this.code;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(data: { lang: string; code: string }) {
    this.lang = data.lang;
    this.codetext = data.code;
  }

  public show() {
    this.node.style.display = 'block';
  }

  public hide() {
    this.node.style.display = 'none';
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root */
  private root: HTMLElement;

  /** preタグ要素 */
  private pre: HTMLElement;

  /** codeタグ要素 */
  private code: HTMLElement;

  //---------------------------------------------------------------------------
  // privateメソッド

  /**
   * DOMを構築する(親子関係の生成)
   */
  private build() {
    // root > pre > codeとなるように構築
    this.root.appendChild(this.pre);
    this.pre.appendChild(this.code);
  }
}
