/******************************************************************************
 * ストレージに関するUtil
 *****************************************************************************/
import Core, {Step} from 'stepcode-core';

export default  
{
  /**
   * Coreの内容をストレージに保存する
   */
  save(core:Core) {
    this.clear();
    this.saveMeta(core);
    for(let i = 0; i < core.count; ++i) {
      const step = core.steps.get(i);
      step && this.saveStep(i, step)
    }
  },

  /**
   * ストレージの保存されているデータをロードする。
   */
  load() {

    const data = [];

    if (this.stepCount() === 0) return null;

    for(let i = 0; i < this.stepCount(); ++i) {
      const step = this.getStep(i);  
      step && data.push(step);
    }
    return {steps:data};
  },

  /**
   * メタデータをストレージに保存する
   */
  saveMeta(core:Core) {
    sessionStorage.setItem("count", core.count.toString());
  },

  /**
   * Stepの内容をストレージに保存する
   */
  saveStep(index:number, step:Step) {
    sessionStorage.setItem(index.toString(), JSON.stringify(step.toJSON()));
  },

  /**
   * ストレージの保存されているステップのデータを取得する
   */
  getStep(index:number) {
    const step = sessionStorage.getItem(index.toString());
    return (step)? JSON.parse(step):null;
  },

  /**
   * ストレージをクリアする
   */
  clear() {
    sessionStorage.clear();
  },

  /**
   * ストレージの保存されているステップの数を取得する。
   */
  stepCount() {
    const count = sessionStorage.getItem('count');
    return (count)? Number(count) : 0;
  },
}