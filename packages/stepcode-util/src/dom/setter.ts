/******************************************************************************
 * DOMに対するSetter
 *****************************************************************************/

/******************************************************************************
 * 関数定義
 *****************************************************************************/

/**
 * 指定された要素のvalueに値を設定する
 * @param elm なにかしらの要素
 * @param value valueプロパティに設定する値
 */
function value(elm: any, value: string) {
  if (!elm || !elm.value) return false;
  elm.value = value;
  return true;
}

/**
 * 指定された要素のdataset.keyに値を設定する
 * @param elm なにかしらの要素
 * @param key datasetのkey名
 * @param value dataset.keyに設定する値
 */
function data(elm: any, key: string, value: string) {
  if (!elm || !elm.dataset) return false;
  elm.dataset[key] = value;
  return true;
}

/******************************************************************************
 * export
 *****************************************************************************/
export { value, data };
