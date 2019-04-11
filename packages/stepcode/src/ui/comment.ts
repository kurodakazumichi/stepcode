/******************************************************************************
 * import
 *****************************************************************************/
import MarkdownIt from 'markdown-it'
import * as Config from './config';

/******************************************************************************
 * Comment
 *****************************************************************************/
export default class Comment 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.Comment);

    this.md = new MarkdownIt({
      breaks:true,
      linkify:true,
      html:false,
    })
    .use(require('markdown-it-deflist'));
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** root nodeを取得する */
  public get node() {
    return this.root;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(markdown:string) {
    this.node.innerHTML = this.md.render(markdown);
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** MarkdownItのインスタンス */
  private md:MarkdownIt;
}

