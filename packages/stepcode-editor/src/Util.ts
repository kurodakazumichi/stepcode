import _get from 'lodash';
import Core, { Step } from 'stepcode-core';
export const getValue = (elm:any) => {
  return (elm && elm.value)? elm.value : "";
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
  }
}