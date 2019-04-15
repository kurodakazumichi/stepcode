/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import hljs from 'highlight.js';
import Core, { Step } from 'stepcode-core';
import UI, { EventType } from './ui';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** 設定可能なcallback関数の種類 */
export enum CallbackType {
  /** 前へボタンの処理が実行される直前に呼ばれるイベント */
  PrevBefore,
  /** 前へボタンの処理が実行される直後に呼ばれるイベント */
  PrevAfter,
  /** 次へボタンの処理が実行される直前に呼ばれるイベント */
  NextBefore,
  /** 次へボタンの処理が実行される直後に呼ばれるイベント */
  NextAfter,
  /** ページジャンプ処理が実行される直前に呼ばれるイベント */
  JumpBefore,
  /** ページジャンプ処理が実行される直後に呼ばれるイベント */
  JumpAfter,
  /** エディターのスクロールトップが変更された後に呼ばれるイベント */
  ScrollTopEditor
}

/******************************************************************************
 * Interface
 *****************************************************************************/
/** Callback関数のシグネチャ */
export type ICallbackFunc = (stepcode: StepCode) => void;

/******************************************************************************
 * StepCode本体
 *****************************************************************************/
export default class StepCode {
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
  constructor(selector: string | HTMLElement, datas: any) {
    // コールバック関数配列を初期化
    this.callbacks = [];

    // StepCode(コア)を保持
    this.core = new Core(datas);

    // ルート要素を取得、保持
    this.ui = new UI(selector);
    this.updateUI();

    // イベントの割り当て
    this.ui.setEvent(EventType.Prev, this.prev.bind(this));
    this.ui.setEvent(EventType.Next, this.next.bind(this));
    this.ui.setEvent(EventType.Jump, this.jump.bind(this));
    this.ui.setEvent(EventType.ScrollTopEditor, this.scrollEditor.bind(this));
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCode本体 */
  private core: Core;

  /** UI */
  private ui: UI;

  /** コールバック関数を格納する配列 */
  private callbacks: ICallbackFunc[];

  //---------------------------------------------------------------------------
  // public プロパティ
  public get current() {
    return {
      idx: this.core.currentIdx,
      no: this.core.currentNo
    };
  }

  public get last() {
    return {
      idx: this.core.lastIdx,
      no: this.core.lastNo
    };
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを新たにロードします。
   * すでに読み込まれているデータがある場合は破棄されます。
   * @param data ロードするデータ
   */
  public load(data: any) {
    // 新しいデータを適用する。
    this.core.apply(data);

    // UIを更新
    this.updateUI();
  }

  /**
   * 渡された[[Step]]の内容をプレビュー(表示のみ)する。
   * 保持している内部のデータに影響はない。
   */
  public preview(step: Step) {
    this.ui.preview(step, this.core.prev);
  }

  /**
   * 指定されたステップを表示する
   * @param idx 表示するStepのIndex
   */
  public show(idx: number) {
    this.core.at(idx);
    this.updateUI();
  }

  /**
   * 指定したコールバック関数を設定します。
   * @param type コールバックの種類
   * @param func コールバック関数
   */
  public setCallback(type: CallbackType, func: ICallbackFunc) {
    this.callbacks[type] = func;
  }

  /**
   * Editorのスクロールトップの量を設定する
   * @param value スクロール量
   */
  public setScrollTopToEditor(value: number) {
    this.ui.setScrollTopToEditor(value);
  }

  /**
   * Editorのスクロールトップの量を取得する
   */
  public getScrollTopOfEditor() {
    return this.ui.getScrollTopOfEditor();
  }

  /**
   * ページを前へ進める処理
   */
  public prev() {
    this.doCallback(CallbackType.PrevBefore);
    this.core.toPrev();
    this.doCallback(CallbackType.PrevAfter);
    this.updateUI();
  }

  /**
   * ページを次へ進める処理
   */
  public next() {
    this.doCallback(CallbackType.NextBefore);
    this.core.toNext();
    this.doCallback(CallbackType.NextAfter);
    this.updateUI();
  }

  /**
   * ページジャンプの処理
   * @param toIndex 異動先のページIndex
   */
  public jump(toIndex: number) {
    this.doCallback(CallbackType.JumpBefore);
    this.core.at(toIndex);
    this.doCallback(CallbackType.JumpAfter);
    this.updateUI();
  }

  /**
   * スクロールが変化した時
   */
  private scrollEditor() {
    this.doCallback(CallbackType.ScrollTopEditor);
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * UIを更新する
   */
  private updateUI() {
    this.ui.update(this.core);
  }

  /**
   * 指定されたコールバック関数を実行する
   * @param type 実行するコールバックの種類
   */
  private doCallback(type: CallbackType) {
    const func = this.callbacks[type];
    func && func(this);
  }
}
