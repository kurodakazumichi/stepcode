/******************************************************************************
 * import
 *****************************************************************************/
import Steps from '../../src/Steps';
import Step from '../../src/Step';
/******************************************************************************
 * Mockデータ
 *****************************************************************************/
const mock = [
  // 0ステップデータ
  [],
  // 1ステップデータ
  [
    {code:"test", desc:"test"}
  ],
  // 2ステップデータ
  [
    {code:"test", desc:"test"},
    {code:"test", desc:"test"},
  ]
];

/******************************************************************************
 * グローバル変数
 *****************************************************************************/
let steps:Steps;

/******************************************************************************
 * StepsクラスのUnitテスト
 *****************************************************************************/
describe('Steps', () => {
  
  //===========================================================================
  // 正常系テスト
  //===========================================================================
  describe.each`
  title       | data
  ${"ケース1"} | ${mock[0]}
  ${"ケース2"} | ${mock[1]}
  ${"ケース3"} | ${mock[2]}
  `('コンストラクタの正常系テスト', ({title, data}) => {

    beforeEach(() => {
      steps = new Steps(data);
    });

    describe(`constructor(${title})の検証`, () => {

      it(`this.count = ${data.length}`, () => {
        expect(steps.count).toBe(data.length);
      })
    
    });
  });

  //===========================================================================
  // 異常系テスト
  //===========================================================================
  describe.each`
  title           | data
  ${"null"}       | ${null}
  ${"undefined"}  | ${undefined}
  ${"0"}          | ${0}
  ${"\"string\""} | ${"string"}
  ${"{}"}         | ${{}}
  `('コンストラクタの異常系テスト', ({title, data}) => {

    beforeEach(() => {
      steps = new Steps(data);
    });

    describe(`constructor(${title})の時`, () => {

      it(`this.count = 0`, () => {
        expect(steps.count).toBe(0);
      })

    });
  });

  //===========================================================================
  // Publicメソッドの検証
  //===========================================================================
  describe('Publicメソッドの検証', () => {

    const testData = mock[2];

    describe(`2ステップ分のデータが設定されている場合の検証`, () => {

      beforeEach(() => { steps = new Steps(testData as any); })

      describe.each`
      index | result
      ${-1} | ${false},
      ${0}  | ${true},
      ${1}  | ${true},
      ${2}  | ${false},
      ${3}  | ${false},
      `('has(index)の検証', ({index, result}) => {
  
        it(`this.has(${index}) = ${result}`, () => {
          expect(steps.has(index)).toBe(result);
        })
      })

      describe.each`
      index | result
      ${-1} | ${null},
      ${0}  | ${new Step(testData[0])},
      ${1}  | ${new Step(testData[1])},
      ${2}  | ${null},
      ${3}  | ${null},
      `('get(index)の検証', ({index, result}) => {
  
        it(`this.get(${index}) = ${result}`, () => {
          expect(steps.get(index)).toEqual(result);
        })
      })

    })
  });
});