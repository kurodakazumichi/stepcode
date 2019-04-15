/******************************************************************************
 * import
 *****************************************************************************/
import * as Util from '@puyan/stepcode-util';
import { Step } from '@puyan/stepcode-core';
import * as Config from './Config';
import Store from './Store';
import * as UI from './UI';

/** ステップを追加する位置、指定できる候補を定義 */
type PositionToAddStep = 'last' | 'before' | 'after';

/******************************************************************************
 * Actionクラス
 * StepCodeEditorで行えるアクションを定義する。
 *****************************************************************************/
export default class Actions {
  /** コンストラクタ */
  constructor(store: Store, ui: UI.default) {
    this.store = store;
    this.ui = ui;
  }

  /** プロパティ */
  private store: Store;
  private ui: UI.default;

  //---------------------------------------------------------------------------
  // 基本アクション

  /** 初期データでリセットする */
  public reset() {
    this.load(Config.INIT_DATA);
  }

  /** ロード */
  public load(data: any) {
    this.store.load(data);
    this.ui.update(this.store);
  }

  /**
   * データをダウンロードする。
   * 引数が指定された場合は入力中の内容がダウンロードされる。
   */
  public download(title?: string, json?: any) {
    title = title ? title : this.store.mainTitle;
    json = json ? json : this.store.core.json;
    Util.file.download(title, json);
  }

  /** プレビュー */
  public preview(data: {
    title?: string;
    file?: string;
    lang?: string;
    code?: string;
    desc?: string;
  }) {
    this.store.updateCurrent(data);
    this.ui.stepcode.preview(this.store.getCurrentStep());
  }

  /** 指定したidxを表示(UI全体を更新) */
  public show(idx: number) {
    this.store.atStep(idx);
    this.ui.update(this.store);
  }

  /** １つ前を表示(UI全体を更新) */
  public toPrev() {
    this.store.toPrevStep();
    this.ui.update(this.store);
  }

  /** １つ次を表示(UI全体を更新) */
  public toNext() {
    this.store.toNextStep();
    this.ui.update(this.store);
  }

  //---------------------------------------------------------------------------
  // スクロール位置の同期

  public syncScrollTopEditorToPreview() {
    const value = this.ui.ace.getSession().getScrollTop();
    this.ui.stepcode.ui.setScroll(value);
  }

  public syncScrollTopPreviewToEditor() {
    const value = this.ui.stepcode.ui.getScroll();
    this.ui.ace.getSession().setScrollTop(value);
  }

  //---------------------------------------------------------------------------
  // ステップの追加、削除、移動

  public addStep(position: PositionToAddStep, step?: Step) {
    let guideIndex;
    switch (position) {
      case 'before':
        guideIndex = this.store.addStepBefore(step).idx;
        break;
      case 'after':
        guideIndex = this.store.addStepAfter(step).idx - 1;
        break;
      default:
        guideIndex = this.store.addStepToLast(step).idx - 1;
        break;
    }

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    const isBefore = position === 'before';
    this.ui.addGuideItemAndUpdate(guideIndex, isBefore);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  public removeStep(removeIdx?: number) {
    const removed = this.store.removeStep(removeIdx);
    removed && this.ui.update(this.store);
    return removed;
  }

  public moveStep(fromIdx: number, toIdx: number) {
    this.store.moveStep(fromIdx, toIdx);
    this.ui.update(this.store);
  }

  //---------------------------------------------------------------------------
  // プレビューの表示位置操作

  showPreview(idx: number) {
    this.ui.stepcode.show(idx);
  }

  toPrevPreview() {
    this.ui.stepcode.prev();
  }

  toNextPreview() {
    this.ui.stepcode.next();
  }

  //---------------------------------------------------------------------------
  // エディターの表示位置操作

  public showEditor(idx: number) {
    this.store.atStep(idx);
    this.ui.updateEditor(this.store);
  }

  public toPrevEditor() {
    this.store.toPrevStep();
    this.ui.updateEditor(this.store);
  }

  public toNextEditor() {
    this.store.toNextStep();
    this.ui.updateEditor(this.store);
  }

  //---------------------------------------------------------------------------
  // ガイドの操作

  public selectGuide(idx: number) {
    this.ui.resetGuideItemClassAll();
    this.ui.modifyGuideItemToSelected(idx);
  }

  //---------------------------------------------------------------------------
  // 各種同期

  public syncStoreToPreview() {
    this.ui.updateStepCode(this.store);
  }

  public syncPreviewToEditor() {
    const idx = this.ui.stepcode.current.idx;
    this.store.atStep(idx);
    this.ui.updateEditor(this.store);
    this.ui.updateGuide(this.store);
  }
}
