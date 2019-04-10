import _get from 'lodash';
import Core, { Step } from 'stepcode-core';
export const getValue = (elm:any) => {
  return (elm && elm.value)? elm.value : "";
}

export const getData = (elm:any, key:string, def:string):string => {
  if (!(elm instanceof HTMLElement)) return def;

  if (!elm.dataset) return def;

  const data = elm.dataset[key];
  return (data)? data : def;
}

export const setData = (elm:any, key:string, value:string) => {
  if (!(elm instanceof HTMLElement)) return false;

  elm.dataset[key] = value;
  return true;
}

export const createOption = (text:string, value?:string):HTMLOptionElement => {
  const e = document.createElement('option') as HTMLOptionElement;
  e.innerHTML = text;
  value && (e.value = value);
  return e;
}

export const download = (title:string, json:any) => 
{
  const blob = new Blob(
    [JSON.stringify(json)],
    {type:'application/json'}
  );
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = title + ".stepcode.json";
  a.click();
  a.remove();
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
  save(core:Core) {
    this.clear();
    this.saveMeta(core);
    for(let i = 0; i < core.count; ++i) {
      const step = core.steps.get(i);
      step && this.saveStep(i, step)
    }
  },
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