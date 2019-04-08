/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import Header from './header';
import Editor from './editor';
import Comment from './comment';
import Footer from './footer';
import * as Config from './config';
import Core, { Step } from 'stepcode-core';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** 設定可能なEventの種類 */
export enum EventType {
  Prev,
  Next
};

/******************************************************************************
 * UI
 *****************************************************************************/
export default class UI{

  //---------------------------------------------------------------------------
  // コンストラクタ

  /** 
   * データのロードとUIの構築を行う。
   */
  constructor(selector:string |  HTMLElement) 
  {
    // ルート要素を取得、保持
    this.root = this.getRoot(selector);
    
    // 各UIの要素を生成
    this.header = new Header();
    this.editor = new Editor();
    this.comment = new Comment();
    this.footer = new Footer();
    
    // UIの親子関係を構築
    this.build();
  }

  //---------------------------------------------------------------------------
  // private メンバ

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
  // public メソッド

  /**
   * 指定されたCoreの内容でUIを更新する
   */
  public update(core:Core) {

    // 再生不可能なら更新しない
    if (!core.isAvailable) return;
    if (!core.current) return;

    // ヘッダを更新
    this.header.update(core.current.title);

    // エディターを更新
    this.editor.update({
      step: core.current,
      diffs: core.diffs
    });

    // コメントを更新
    this.comment.update(core.current.desc);

    // フッタを更新
    this.footer.update({
      currentNo:core.currentNo, 
      totalNo  :core.lastNo
    });
  }

  /**
   * 指定されたタイトルテキストをプレビューします。(実際のデータは変更されません)
   * @param title タイトルに設定するテキスト
   */
  previewTitle(title:string) {
    this.header.titleText = title;
  }

  /**
   * 指定された[[Step]]のコードをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewCode(step:Step, diffs: number[]) {
    this.editor.update({step, diffs});
  }

  /**
   * 指定された[[Step]]のコメントをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewComment(step:Step) {
    this.comment.update(step.desc);
  }

  /**
   * Editorのスクロール量を設定する
   * @param value スクロール量
   */
  public setEditorScrollTop(value:number) {
    this.editor.node.scrollTop = value;
  }

  // TODO
  public setEvent(events:{prev:Function, next:Function}) {
    
    this.footer.setEvents(events);

  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * ルート要素を取得する。
   * @param target ルート要素を取得するselector、もしくはルート要素
   */
  private getRoot(target:string |  HTMLElement) : HTMLElement 
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



}