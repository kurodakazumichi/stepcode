import * as Util from '@puyan/stepcode-util';
import Store from './Store';
import * as UI from './UI';
import * as Config from './Config';
import { Step } from 'stepcode-core';

type PositionToAddStep = 'last' | 'before' | 'after';

export default class Actions {
  constructor(store: Store, ui: UI.default) {
    this.store = store;
    this.ui = ui;
  }

  private store: Store;
  private ui: UI.default;

  public reset() {
    this.load(Config.INIT_DATA);
  }

  public load(data: any) {
    this.store.load(data);
    this.ui.update(this.store);
  }

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

  public syncScrollTopEditorToPreview() {
    const value = this.ui.ace.getSession().getScrollTop();
    this.ui.stepcode.setScrollTopToEditor(value);
  }
  public syncScrollTopPreviewToEditor() {
    const value = this.ui.stepcode.getScrollTopOfEditor();
    this.ui.ace.getSession().setScrollTop(value);
  }

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

  public download(title?: string, json?: any) {
    title = title ? title : this.store.mainTitle;
    json = json ? json : this.store.core.json;
    Util.file.download(title, json);
  }

  public show(idx: number) {
    this.store.atStep(idx);
    this.ui.update(this.store);
  }

  public toPrev() {
    this.store.toPrevStep();
    this.ui.update(this.store);
  }

  public toNext() {
    this.store.toNextStep();
    this.ui.update(this.store);
  }

  showPreview(idx: number) {
    this.ui.stepcode.show(idx);
  }

  toPrevPreview() {
    this.ui.stepcode.prev();
  }

  toNextPreview() {
    this.ui.stepcode.next();
  }

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

  public selectGuide(idx: number) {
    this.ui.resetGuideItemClassAll();
    this.ui.modifyGuideItemToSelected(idx);
  }

  public syncStoreToPreview() {
    this.ui.updateStepCode(this.store);
  }

  public syncPreviewToEditor() {
    const idx = this.ui.stepcode.currentIdx;
    this.store.atStep(idx);
    this.ui.updateEditor(this.store);
    this.ui.updateGuide(this.store);
  }
}
