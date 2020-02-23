/******************************************************************************
 * import
 *****************************************************************************/
import MarkdownIt from 'markdown-it';
import * as Config from './config';
import * as Types from '../types';

/******************************************************************************
 * Markdown
 *****************************************************************************/
export default class Markdown implements Types.IUI {
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.Markdown);

    this.md = new MarkdownIt({
      breaks: true,
      linkify: true,
      html: false
    })
      .use(require('markdown-it-deflist'))
      .use(require('markdown-it-katex'));

    this.md.renderer.rules.heading_open = function(tokens:any, idx:number) {
      const token = tokens[idx];

      switch(token.markup) {
        case "#"    : return '<h2>';
        case "##"   : return '<h3>';
        case "###"  : return '<h4>';
        case "####" : return '<h5>';
        case "#####": return '<h6>';
        default     : return '<h6>';
      }
    }
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
  public update(markdown: string) {
    this.node.innerHTML = this.md.render(markdown);
  }

  /** プレビュー */
  public preview(data: { markdown?: string }) {
    const { markdown } = data;
    if (typeof markdown === 'undefined') return;
    this.node.innerHTML = this.md.render(markdown);
  }

  public show() {
    this.node.style.display = 'block';
  }

  public hide() {
    this.node.style.display = 'none';
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root: HTMLElement;

  /** MarkdownItのインスタンス */
  private md: MarkdownIt;
}
