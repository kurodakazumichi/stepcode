/******************************************************************************
 * DOMに対するGetter
 *****************************************************************************/

/******************************************************************************
 * 関数定義
 *****************************************************************************/

/**
 * 指定されたElementのvalueプロパティの内容を取得する、取得できなければデフォルト値
 * @param elm HTMLElementを想定
 * @param defaultValue デフォルト値
 */
function value(elm: any, defaultValue: string = '') {
  return elm && elm.value ? elm.value : defaultValue;
}

/**
 * 指定されたElementのdatasetプロパティから、指定したデータを取得する
 * 取得できなければデフォルト値
 * @param elm HTMLElementを想定
 * @param key datasetのkey
 * @param defaultValue デフォルト値
 */
function data(elm: any, key: string, defaultValue: string = ''): string {
  if (!elm || !elm.dataset) return defaultValue;

  const data = elm.dataset[key];
  return data ? data : defaultValue;
}

/******************************************************************************
 * export
 *****************************************************************************/
export { value, data };
