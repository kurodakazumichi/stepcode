/******************************************************************************
 * DOMに対するSetter
 *****************************************************************************/

/** 
 * 指定されたElementのvalueに値を設定する 
 */
export const value = (elm:any, value:string) => {
  if (!elm || !elm.value) return false;
  elm.value = value;
  return true;
}

/**
 * 指定されたElementのdataset.keyに値を設定する。
 */
export const data = (elm:any, key:string, value:string) => {
  if (!elm || !elm.dataset) return false;
  elm.dataset[key] = value;
  return true;
}