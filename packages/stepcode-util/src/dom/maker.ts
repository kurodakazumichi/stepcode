/******************************************************************************
 * DOMを生成するメーカー
 *****************************************************************************/

/** HTMLOptionElementを生成する */
export const option = (text:string, value?:string):HTMLOptionElement =>{
  const e = document.createElement('option') as HTMLOptionElement;
  e.innerHTML = text;
  value && (e.value = value);
  return e;
}