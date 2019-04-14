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
    this._core = new Core();
    this._work = new Step();
  }

  private _core: Core;
  private _work: Step;

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

  public saveWorkToStorage() {
    Util.storage.saveCount(this._core.count);
    Util.storage.saveStep(this._core.currentIdx, this._work);
  }
  public load(data: any) {
    this._core.apply(data);
    this._work.apply(this._core.current);
    Util.storage.save(this._core);
  }

  public addStep(index: number, step: Step, isBefore = false) {
    // ステップを基準位置の後ろに追加する場合はindexを1加算する
    const stepIndex = isBefore ? index : index + 1;

    // Coreに新しくStepを追加し、追加したStepを選択した状態にする
    this._core.steps.add(stepIndex, step.clone());
    this._core.at(stepIndex);

    // Coreの内容をStorageに保存する
    Util.storage.save(this._core);
  }

  public addStepToLast(step?: Step) {
    const addIndex = this._core.lastIdx;
    const addStep = step ? step : this._work;
    this.addStep(addIndex, addStep);
    return addIndex;
  }

  public addStepBefore(step?: Step) {
    const addIndex = this._core.currentIdx;
    const addStep = step ? step : this._work;
    this.addStep(addIndex, addStep, true);
    return addIndex;
  }

  public addStepAfter(step?: Step) {
    const addIndex = this._core.currentIdx;
    const addStep = step ? step : this._work;
    this.addStep(addIndex, addStep);
    return addIndex;
  }

  public removeStep(index: number) {
    if (!this.hasRemovableleSteps) return false;

    this._core.steps.remove(index);
    this._core.at(index);
    this._work.apply(this._core.current);

    Util.storage.save(this._core);
    return true;
  }

  public get current() {
    return {
      json: this.convertStepToJson(this._core.current),
      idx: this._core.currentIdx,
      no: this._core.currentNo
    };
  }

  public get last() {
    return {
      json: this.convertStepToJson(this._core.last),
      idx: this._core.lastIdx,
      no: this._core.lastNo
    };
  }

  public atStep(index: number) {
    this._core.at(index);
    this._work.apply(this._core.current);
  }

  public moveStep(fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    const step = this._core.steps.get(fromIdx);
    if (step) {
      this._core.steps.remove(fromIdx);
      this._core.steps.add(toIdx, step);
    }

    this.atStep(toIdx);
  }

  public sync() {
    if (this._core.current) {
      this._core.current.apply(this._work.toJSON());
    }
  }

  public updateWork(data: {
    title?: string;
    file?: string;
    lang?: string;
    code?: string;
    desc?: string;
  }) {
    if (data.title) this._work.title = data.title;
    if (data.file) this._work.file = data.file;
    if (data.lang) this._work.lang = data.lang;
    if (data.code) this._work.code = data.code;
    if (data.desc) this._work.desc = data.desc;
    this.saveWorkToStorage();
  }

  public getWork() {
    return this._work.clone();
  }

  private convertStepToJson(step: Step | null) {
    if (!step) return null;
    return step.toJSON();
  }
}
