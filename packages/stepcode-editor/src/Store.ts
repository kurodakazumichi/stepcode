/******************************************************************************
 * import
 *****************************************************************************/
import * as Util from '@puyan/stepcode-util';
import Core, { Step } from 'stepcode-core';

/******************************************************************************
 * StepCodeEditorのデータを管理するクラス
 *****************************************************************************/
export default class Store {
  constructor() {
    this.core = new Core();
    this.work = new Step();
  }

  private core: Core;
  private work: Step;

  /**
   * 削除可能な[[Step]]を持っていることを真偽値で表す。
   *
   * # 仕様
   * Stepは最低でも1つ以上存在させる。
   * 削除はStepが2つ以上ある場合でないとできない。
   */
  public get hasRemovableleSteps() {
    return 2 <= this.core.count;
  }

  public saveWorkToStorage() {
    Util.storage.saveCount(this.core.count);
    Util.storage.saveStep(this.core.currentIdx, this.work);
  }
  public load(data: any) {
    this.core.apply(data);
    this.work.apply(this.core.current);
    Util.storage.save(this.core);
  }

  public addStep(index: number, step: Step, isBefore = false) {
    // ステップを基準位置の後ろに追加する場合はindexを1加算する
    const stepIndex = isBefore ? index : index + 1;

    // Coreに新しくStepを追加し、追加したStepを選択した状態にする
    this.core.steps.add(stepIndex, step.clone());
    this.core.at(stepIndex);

    // Coreの内容をStorageに保存する
    Util.storage.save(this.core);
  }

  public addStepToLast(step?: Step) {
    const addIndex = this.core.lastIdx;
    const addStep = step ? step : this.work;
    this.addStep(addIndex, addStep);
    return addIndex;
  }

  public addStepBefore(step?: Step) {
    const addIndex = this.core.currentIdx;
    const addStep = step ? step : this.work;
    this.addStep(addIndex, addStep, true);
    return addIndex;
  }

  public addStepAfter(step?: Step) {
    const addIndex = this.core.currentIdx;
    const addStep = step ? step : this.work;
    this.addStep(addIndex, addStep);
    return addIndex;
  }

  public removeStep(index: number) {
    if (!this.hasRemovableleSteps) return false;

    this.core.steps.remove(index);
    this.core.at(index);
    this.work.apply(this.core.current);

    Util.storage.save(this.core);
    return true;
  }

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

  public getStep(index: number) {
    this.core.steps.get(index);
  }

  public atStep(index: number) {
    this.core.at(index);
    this.work.apply(this.core.current);
  }

  public moveStep(fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    const step = this.core.steps.get(fromIdx);
    if (step) {
      this.core.steps.remove(fromIdx);
      this.core.steps.add(toIdx, step);
    }

    this.atStep(toIdx);
  }

  public sync() {
    if (this.core.current) {
      this.core.current.apply(this.work.toJSON());
    }
  }

  public get deprecatedCore() {
    return this.core;
  }

  public get deprecatedWork() {
    return this.work;
  }
}
