/******************************************************************************
 * import
 *****************************************************************************/
import * as Config from './config';
import Markdown from './markdown';

/******************************************************************************
 * Comment
 *****************************************************************************/
export default class Comment {
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.Comment);
    this.markdown = new Markdown();
    this.root.appendChild(this.markdown.node);
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root: HTMLElement;

  /** Markdown要素 */
  private markdown: Markdown;

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** root nodeを取得する */
  public get node() {
    return this.root;
  }

  public get scrollTop() {
    return this.node.scrollTop;
  }
  public set scrollTop(v: number) {
    this.node.scrollTop = v;
  }
  public get scrollLeft() {
    return this.node.scrollLeft;
  }
  public set scrollLeft(v: number) {
    this.node.scrollLeft = v;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(markdown: string) {
    this.markdown.update(markdown);
  }

  /** プレビュー */
  public preview(data: { comment?: string }) {
    this.markdown.preview({ markdown: data.comment });
  }
}
