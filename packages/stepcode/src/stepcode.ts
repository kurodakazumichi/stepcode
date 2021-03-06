/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import hljs from 'highlight.js';
import Core, { Step } from '@puyan/stepcode-core';
import UI, { EventType as UIEventType } from './ui';
import * as Define from './define';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** イベントの種類 */
export enum EventType {
  /** 前ページにに移動した時 */
  Prev,
  /** 次ページに移動した時 */
  Next,
  /** ページジャンプした時 */
  Jump,
  /** エディターがスクロールした時 */
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
    const langs = hljs.listLanguages();
    // 言語の種類ではないが、codeをmarkdonwとして評価した状態
    // つまり実際に描画された状態を表す選択肢を追加
    langs.unshift(Define.SUPPORT_LANG_DRAWING);
    return langs;
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
    this.ui.setEvent(UIEventType.Prev, this.prev.bind(this));
    this.ui.setEvent(UIEventType.Next, this.next.bind(this));
    this.ui.setEvent(UIEventType.Jump, this.jump.bind(this));
    this.ui.setEvent(UIEventType.ScrollTopEditor, this.scrollEditor.bind(this));
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCode本体 */
  private core: Core;

  /** UI */
  public ui: UI;

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
   * イベントリスナー関数を設定します。
   * @param type イベントの種類
   * @param func コールバック関数
   */
  public on(type: EventType, func: ICallbackFunc) {
    this.callbacks[type] = func;
  }

  /**
   * ページを前へ進める処理
   */
  public prev() {
    this.core.toPrev();
    this.doCallback(EventType.Prev);
    this.updateUI();
  }

  /**
   * ページを次へ進める処理
   */
  public next() {
    this.core.toNext();
    this.doCallback(EventType.Next);
    this.updateUI();
  }

  /**
   * ページジャンプの処理
   * @param toIndex 異動先のページIndex
   */
  public jump(toIndex: number) {
    this.core.at(toIndex);
    this.doCallback(EventType.Jump);
    this.updateUI();
  }

  /**
   * スクロールが変化した時
   */
  private scrollEditor() {
    this.doCallback(EventType.ScrollTopEditor);
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
  private doCallback(type: EventType) {
    const func = this.callbacks[type];
    func && func(this);
  }
}
