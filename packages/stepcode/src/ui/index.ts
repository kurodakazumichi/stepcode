/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import Header from './header';
import Editor from './editor';
import Comment from './comment';
import Footer, { EventType as FooterEventType } from './footer';
import * as Config from './config';
import Core, { Step } from 'stepcode-core';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** 設定可能なイベントの種類 */
export enum EventType {
  /** 前に戻るイベント */
  Prev,
  /** 次へ進むイベント */
  Next,
  /** ページジャンプイベント */
  Jump
}

/******************************************************************************
 * UI
 *****************************************************************************/
export default class UI {
  //---------------------------------------------------------------------------
  // コンストラクタ

  /**
   * データのロードとUIの構築を行う。
   */
  constructor(selector: string | HTMLElement) {
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
  private root: HTMLElement;

  /** UI Header要素 */
  private header: Header;

  /** UI Editor要素 */
  private editor: Editor;

  /** UI Comment要素 */
  private comment: Comment;

  /** UI Footer要素 */
  private footer: Footer;

  //---------------------------------------------------------------------------
  // public メソッド

  /** リセット */
  public reset() {
    this.header.update('', '');
    this.editor.update({ step: new Step(null), diffs: [] });
    this.comment.update('');
    this.footer.update({ currentNo: 0, totalNo: 0 });
  }

  /**
   * 指定されたCoreの内容でUIを更新する
   */
  public update(core: Core) {
    // データが存在しない場合はUIをリセットして終了
    if (!core.isAvailable || !core.current) {
      this.reset();
      return;
    }

    // 現在のステップを取得
    const step = core.current;

    // ヘッダを更新
    this.header.update(step.title, step.file);

    // エディターを更新
    this.editor.update({
      step: step,
      diffs: core.diffs
    });

    // コメントを更新
    this.comment.update(step.desc);

    // フッタを更新
    this.footer.update({
      currentNo: core.currentNo,
      totalNo: core.lastNo
    });
  }

  /**
   * 指定されたタイトルテキストをプレビューします。(実際のデータは変更されません)
   * @param title タイトルに設定するテキスト
   */
  previewTitle(title: string) {
    if (this.header.titleText === title) return;
    this.header.titleText = title;
  }

  /**
   * 指定されたファイル名をプレビューします。(実際のデータは変更されません)
   * @param name ファイル名テキスト
   */
  previewFile(name: string) {
    if (this.header.fileText === name) return;
    this.header.fileText = name;
  }

  /**
   * 指定された[[Step]]のコードをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewCode(step: Step, diffs: number[]) {
    this.editor.update({ step, diffs });
  }

  /**
   * 指定された[[Step]]のコメントをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewComment(step: Step) {
    this.comment.update(step.desc);
  }

  /**
   * Editorのスクロール量を設定する
   * @param value スクロール量
   */
  public setScrollTopToEditor(value: number) {
    this.editor.node.scrollTop = value;
  }

  /** Editorのスクロール量を取得する */
  public getScrollTopOfEditor() {
    return this.editor.node.scrollTop;
  }

  /**
   * イベントを設定する
   * @param type イベントの種類
   * @param func コールバック関数
   */
  public setEvent(type: EventType, func: Function) {
    switch (type) {
      case EventType.Prev:
        this.footer.setEvent(FooterEventType.Prev, func);
        break;
      case EventType.Next:
        this.footer.setEvent(FooterEventType.Next, func);
        break;
      case EventType.Jump:
        this.footer.setEvent(FooterEventType.Jump, func);
        break;
    }
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * ルート要素を取得する。
   * @param target ルート要素を取得するselector、もしくはルート要素
   */
  private getRoot(target: string | HTMLElement): HTMLElement {
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
