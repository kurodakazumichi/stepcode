/******************************************************************************
 * import
 *****************************************************************************/
import * as Util from '@puyan/stepcode-util';
import Core, { Step } from '@puyan/stepcode-core';

type AddStepResult = { idx: number; ok: boolean };
/******************************************************************************
 * StepCodeEditorのデータを管理するクラス
 *****************************************************************************/
export default class Store {
  constructor() {
    this._core = new Core();
  }

  private _core: Core;

  public get core() {
    return {
      json: this._core.toJSON(),
      count: this._core.count
    };
  }

  public get mainTitle() {
    const title = this._core.firstTitle;
    return title ? title : 'untitled';
  }

  /**
   * 削除可能な[[Step]]を持っていることを真偽値で表す。
   *
   * # 仕様
   * Stepは最低でも1つ以上存在させる。
   * 削除はStepが2つ以上ある場合でないとできない。
   */
  public get hasRemovableleSteps() {
    return 2 <= this._core.count;
  }

  public saveCurrent() {
    const { count, currentIdx, current } = this._core;
    Util.storage.saveCount(count);
    Util.storage.saveStep(currentIdx, current);
  }
  public load(data: any) {
    this._core.apply(data);
    Util.storage.save(this._core);
  }

  public addStep(
    index: number,
    step: Step | null,
    isBefore = false
  ): AddStepResult {
    if (!step) return { idx: index, ok: false };
    // ステップを基準位置の後ろに追加する場合はindexを1加算する
    const stepIndex = isBefore ? index : index + 1;

    // Coreに新しくStepを追加し、追加したStepを選択した状態にする
    this._core.steps.add(stepIndex, step.clone());
    this._core.at(stepIndex);

    // Coreの内容をStorageに保存する
    Util.storage.save(this._core);
    return { idx: stepIndex, ok: true };
  }

  public addStepToLast(step?: Step): AddStepResult {
    const { lastIdx, current } = this._core;
    const addStep = step ? step : current;
    return this.addStep(lastIdx, addStep);
  }

  public addStepBefore(step?: Step): AddStepResult {
    const { currentIdx, current } = this._core;
    const addStep = step ? step : current;
    return this.addStep(currentIdx, addStep, true);
  }

  public addStepAfter(step?: Step): AddStepResult {
    const { currentIdx, current } = this._core;
    const addStep = step ? step : current;
    return this.addStep(currentIdx, addStep);
  }

  public removeStep(index?: number) {
    if (!this.hasRemovableleSteps) return false;

    index = index ? index : this.current.idx;

    this._core.steps.remove(index);
    this._core.at(index);

    Util.storage.save(this._core);
    return true;
  }

  public get current() {
    return {
      idx: this._core.currentIdx,
      no: this._core.currentNo
    };
  }

  public getCurrentStep() {
    const { current } = this._core;
    const step = current ? current.clone() : new Step();
    return step;
  }

  public getCurrentJSON() {
    return this.convertStepToJson(this._core.current);
  }

  public get last() {
    return {
      idx: this._core.lastIdx,
      no: this._core.lastNo
    };
  }

  public atStep(index: number) {
    this._core.at(index);
  }

  public toPrevStep() {
    this._core.toPrev();
  }
  public toNextStep() {
    this._core.toNext();
  }
  public moveStep(fromIdx: number, toIdx: number) {
    const moved = this._core.steps.move(fromIdx, toIdx);

    if (moved) {
      this.atStep(toIdx);
    }
  }

  public updateCurrent(data: {
    title?: string;
    file?: string;
    lang?: string;
    code?: string;
    desc?: string;
  }) {
    const { current } = this._core;
    if (!current) return;
    current.partialUpdate(data);
    this.saveCurrent();
  }

  private convertStepToJson(step: Step | null) {
    if (!step) return null;
    return step.toJSON();
  }
}
