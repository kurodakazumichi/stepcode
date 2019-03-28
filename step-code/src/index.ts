/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import Header from './header';
import Editor from './editor';
import Comment from './comment';
import Footer from './footer';
import * as Config from './config';

import Core from '../../core/src/index';

/******************************************************************************
 * UI
 *****************************************************************************/
export default class StepCode
{
  /** 
   * コンストラクタ 
   */
  constructor(selector:string, datas:any) 
  {
    // StepCode(コア)を保持
    this.core = new Core(datas);
    
    // ルート要素を取得、保持
    this.root = document.querySelector(selector) as HTMLElement;
    this.root.classList.add(Config.classNames.root);
    
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
  // public メンバ

  public update() {

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

  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCode本体 */
  private core:Core;

  /** UIリスト */
  private root:HTMLElement;
  private header:Header;
  private editor:Editor;
  private comment:Comment;
  private footer:Footer;

  //---------------------------------------------------------------------------
  // private メソッド

  /** UIの構築 */
  private build() {    
    this.root.appendChild(this.header.node as Node);
    this.root.appendChild(this.editor.node as Node);
    this.root.appendChild(this.comment.node as Node);
    this.root.appendChild(this.footer.node as Node);
  }

  /** ファイル名を設定する */
  public setFileName(filename:string) {
    this.header.titleText = filename;
  }

}