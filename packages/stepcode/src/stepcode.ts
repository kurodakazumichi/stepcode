/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import Header from './header';
import Editor from './editor';
import Comment from './comment';
import Footer from './footer';
import * as Config from './config';
import Core from 'stepcode-core';

/******************************************************************************
 * StepCode本体
 *****************************************************************************/
export default class StepCode
{
  /** 
   * データのロードとUIの構築を行う。
   */
  constructor(selector:string | HTMLElement, datas:any) 
  {
    // StepCode(コア)を保持
    this.core = new Core(datas);
    
    // ルート要素を取得、保持
    this.root = this.getRoot(selector);
    
    // 各UIの要素を生成
    this.header = new Header();
    this.editor = new Editor();
    this.comment = new Comment();
    this.footer = new Footer();

    this.footer.setEvents({
      prev: () => { this.core.prev(); this.update(); },
      next: () => { this.core.next(); this.update(); }
    });
    
    // UIの親子関係を構築
    this.build();
    this.update();
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCode本体 */
  private core:Core;

  /** UI Root */
  private root:HTMLElement;

  /** UI Header要素 */
  private header:Header;

  /** UI Editor要素 */
  private editor:Editor;

  /** UI Comment要素 */
  private comment:Comment;

  /** UI Footer要素 */
  private footer:Footer;

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

    // css classを付与して返す。
    root.classList.add(Config.classNames.root);
    return root;
  }

  /**
   * UIを構築する
   */
  private build() {    
    this.root.appendChild(this.header.node as Node);
    this.root.appendChild(this.editor.node as Node);
    this.root.appendChild(this.comment.node as Node);
    this.root.appendChild(this.footer.node as Node);
  }

  /**
   * UIを更新する
   */
  private update() {

    // 再生不可能なら更新しない
    if (!this.core.isAvailable) return;
    if (!this.core.current) return;

    // ヘッダを更新
    this.header.update(this.core.title);

    // エディターを更新
    this.editor.update({
      lang: "",
      step: this.core.current,
      diffs: this.core.diffs
    });

    // コメントを更新
    this.comment.update(this.core.current.desc);

    // フッタを更新
    this.footer.update({
      currentNo:this.core.currentNo, 
      totalNo  :this.core.lastNo
    });
  }

}