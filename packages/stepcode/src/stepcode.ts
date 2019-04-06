/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import hljs from 'highlight.js';
import Header from './header';
import Editor from './editor';
import Comment from './comment';
import Footer from './footer';
import * as Config from './config';
import Core, { Step } from 'stepcode-core';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** 設定可能なcallback関数の種類 */
export enum CallbackType {
  PrevBefore,
  PrevAfter,
  NextBefore,
  NextAfter,
};

/******************************************************************************
 * Interface
 *****************************************************************************/
/** Callback関数のシグネチャ */
export type ICallbackFunc = (stepcode:StepCode) => void;

/******************************************************************************
 * StepCode本体
 *****************************************************************************/
export default class StepCode
{
  //---------------------------------------------------------------------------
  // 静的メンバ

  /**
   * サポートしている言語の一覧を返します。
   */
  public static supportLanguages() {
    return hljs.listLanguages();
  }

  //---------------------------------------------------------------------------
  // コンストラクタ

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
    
    // UIの親子関係を構築
    this.build();
    this.update();

    // コールバック関数配列を初期化
    this.callbacks = [];

    this.footer.setEvents({
      prev: () => { 
        this.doCallback(CallbackType.PrevBefore);
        this.core.prev(); 
        this.doCallback(CallbackType.PrevAfter);
        this.update(); 
      },
      next: () => { 
        this.doCallback(CallbackType.NextBefore);
        this.core.next(); 
        this.doCallback(CallbackType.NextAfter);
        this.update(); 
      }
    });
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

  /** コールバック関数を格納する配列 */
  private callbacks:ICallbackFunc[];

  //---------------------------------------------------------------------------
  // public プロパティ

  public get lastNo() {
    return this.core.lastNo;
  }

  public get currentNo() {
    return this.core.currentNo;
  }

  public get currentIdx() {
    return Math.max(this.core.cursor);
  }

  // TODO: 指定したページを表示する
  public setNo(no:number){
    this.core.at(no - 1);
    this.update();
  }

  /**
   * 指定されたステップを表示する
   * @param no 表示するStep番号
   */
  public show(no:number) {
    this.core.at(no - 1);
    this.update();
  }

  //---------------------------------------------------------------------------
  // public メンバ

  /**
   * データを新たにロードします。
   * @param data ロードするデータ
   */
  public load(data:any) 
  {
    // 新しいデータを適用する。
    this.core.apply(data);

    // UIを再構築する必要がある

    this.update();
  }

  /**
   * タイトルテキストをセットする
   * @param title タイトルに設定するテキスト
   */
  setTitle(title:string) {
    this.header.titleText = title;
  }

  /**
   * 指定された[[Step]]の内容を設定します。
   * @param step [[Step]]
   */
  setStep(step:Step) {
    this.setCode(step);
    this.setComment(step);
  }

  /**
   * 指定された[[Step]]のコードが設定されます。
   * @param step [[Step]]
   */
  setCode(step:Step) {
    const diffs = this.core.calcDiffs(this.core.current, step);    
    this.editor.update({step, diffs});
  }

  /**
   * 指定された[[Step]]のコメントが設定されます。
   * @param step [[Step]]
   */
  setComment(step:Step) {
    this.comment.update(step.desc);
  }

  /**
   * 指定したコールバック関数を設定します。
   * @param type コールバックの種類
   * @param func コールバック関数
   */
  public setCallback(type:CallbackType, func:ICallbackFunc) {
    this.callbacks[type] = func;
  }

  /**
   * TODO Editorのスクロール量を設定する
   * @param value スクロール量
   */
  public setEditorScrollTop(value:number) {
    this.editor.node.scrollTop = value;
  }

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
    this.header.update(this.core.current.title);

    // エディターを更新
    this.editor.update({
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

  /**
   * 指定されたコールバック関数を実行する
   * @param type 実行するコールバックの種類
   */
  private doCallback(type:CallbackType) {
    const func = this.callbacks[type];
    func && func(this);
  }

}