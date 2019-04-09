import _get from 'lodash';
import Core, { Step } from 'stepcode-core';
export const getValue = (elm:any) => {
  return (elm && elm.value)? elm.value : "";
}
export const readFile = (e:Event, onloadCallback:Function) => 
{
  // targetがHTMLInputElementでなければ終了
  if (!e.target) return;
  if (!(e.target instanceof HTMLInputElement)) return;

  // ファイルがなければ終了
  if (!e.target.files) return;
  if (!e.target.files[0]) return;

  // FileReaderでFileを読み込む
  const file = e.target.files[0];
  const fr = new FileReader();
  fr.readAsText(file);

  // 読み込み後のコールバックを仕込む
  fr.onload = (ev:ProgressEvent) => {

    // targetがなければ終了
    if (!ev.target) return;

    // ev.target.resultは定義されてないと言われるので、anyにキャストして処理する
    const result = (ev.target as any).result;
    result && onloadCallback(result);
  }
}

export const storage = {
  saveStep(index:number, step:Step) {
    sessionStorage.setItem(index.toString(), JSON.stringify(step.toJSON()));
  },
  saveMeta(core:Core) {
    sessionStorage.setItem("count", core.count.toString());
  },

  clear() {
    sessionStorage.clear();
  },
  get count() {
    const count = sessionStorage.getItem('count');
    return (count)? Number(count) : 0;
  },
  getStep(index:number) {
    const step = sessionStorage.getItem(index.toString());
    return (step)? JSON.parse(step):null;
  },
  get savedata() {

    const data = [];

    if (this.count === 0) return null;

    for(let i = 0; i < this.count; ++i) {
      const step = this.getStep(i);  
      step && data.push(step);
    }
    return {steps:data};
  }
}