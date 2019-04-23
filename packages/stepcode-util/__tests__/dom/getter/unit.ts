/******************************************************************************
 * dom/getter.tsのユニットテスト
 *****************************************************************************/
import * as Getter from '../../../src/dom/getter';

/******************************************************************************
 * テストデータ定義
 *****************************************************************************/
const mockInput = document.createElement('input') as HTMLInputElement;
mockInput.value = "test";

const mockDiv = document.createElement('div') as HTMLElement;
mockDiv.dataset.test = "sample";

/******************************************************************************
 * ユニットテスト開始
 *****************************************************************************/
describe('dom/getterの検証', () => {

  describe('value()のデフォルト引数の検証', () => {
    it('value(null)の戻り値が""になること', () => {
      expect(Getter.value(null)).toBe("");
    })
  })

  describe.each`
  element | def | result
  ${mockInput} | ${""}  | ${mockInput.value}
  ${null}        | ${"a"} | ${"a"}
  ${"string"}    | ${"a"} | ${"a"}
  `('value()の総合検証', ({element, def, result}) => {
    it(`value(${element}, "${def}") = ${result} になること`, () => {
      expect(Getter.value(element, def)).toBe(result);
    });
  });

  describe('data()のデフォルト引数の検証', () => {
    it('data(null, "")の戻り値が""になること', () => {
      expect(Getter.data(null, "")).toBe("");
    })
  });

  describe.each`
  element | key | def | result
  ${mockInput} | ${"test"} | ${"a"} | ${"a"}
  ${mockDiv}   | ${"test"} | ${"a"} | ${"sample"}
  `('data()の総合検証', ({element, key, def, result}) => {
    it(`value(${element}, "${key}", "${def}") = ${result} になること`, () => {
      expect(Getter.data(element, key, def)).toBe(result);
    });
  });

})