/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import hljs from 'highlight.js';
import Core, { Step } from 'stepcode-core';
import UI from './ui';

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
  public static get supportLanguages() {
    return hljs.listLanguages();
  }

  //---------------------------------------------------------------------------
  // コンストラクタ

  /** 
   * データのロードとUIの構築を行う。
   */
  constructor(selector:string |  HTMLElement, datas:any) 
  {
    // コールバック関数配列を初期化
    this.callbacks = [];

    // StepCode(コア)を保持
    this.core = new Core(datas);
    
    // ルート要素を取得、保持
    this.ui = new UI(selector);
    this.updateUI();
    
    this.ui.setEvent({
      prev: () => { 
        this.doCallback(CallbackType.PrevBefore);
        this.core.prev(); 
        this.doCallback(CallbackType.PrevAfter);
        this.updateUI(); 
      },
      next: () => { 
        this.doCallback(CallbackType.NextBefore);
        this.core.next(); 
        this.doCallback(CallbackType.NextAfter);
        this.updateUI(); 
      }
    })
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCode本体 */
  private core:Core;

  /** コールバック関数を格納する配列 */
  private callbacks:ICallbackFunc[];

  /** UI */
  private ui:UI;

  //---------------------------------------------------------------------------
  // public プロパティ

  /** 現在ページのIndexを返します。 */
  public get currentIdx() {
    return Math.max(this.core.cursor);
  }

  /** 現在ページの番号を返します。 */
  public get currentNo() {
    return this.core.currentNo;
  }

  /** 最終ページの番号を返します。 */
  public get lastNo() {
    return this.core.lastNo;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを新たにロードします。
   * すでに読み込まれているデータがある場合は破棄されます。
   * @param data ロードするデータ
   */
  public load(data:any) {
    // 新しいデータを適用する。
    this.core.apply(data);

    // TODO:UIを再構築する必要がある
    this.ui.update(this.core);
  }

  /**
   * 指定されたタイトルテキストをプレビューします。(実際のデータは変更されません)
   * @param title タイトルに設定するテキスト
   */
  previewTitle(title:string) {
    this.ui.previewTitle(title);
  }

  /**
   * 指定された[[Step]]のコードをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewCode(step:Step) {
    const diffs = this.core.calcDiffs(this.core.current, step);    
    this.ui.previewCode(step, diffs);
  }

  /**
   * 指定された[[Step]]のコメントをプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewComment(step:Step) {
    this.ui.previewComment(step);
  }

  /**
   * 指定された[[Step]]の内容をプレビューします。(実際のデータは変更されません)
   * @param step [[Step]]
   */
  previewStep(step:Step) {
    this.previewCode(step);
    this.previewComment(step);
  }


  /**
   * 指定されたステップを表示する
   * @param no 表示するStep番号
   */
  public show(no:number) {
    this.core.at(no - 1);
    this.updateUI();
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
    this.ui.setEditorScrollTop(value);
  }

  //---------------------------------------------------------------------------
  // private メソッド



  private updateUI() {
    this.ui.update(this.core);
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