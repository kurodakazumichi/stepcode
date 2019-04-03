/******************************************************************************
 * import
 *****************************************************************************/
import Step from '../../src/Step';

/******************************************************************************
 * グローバル変数
 *****************************************************************************/
let step:Step;

/******************************************************************************
 * StepクラスのUnitテスト
 *****************************************************************************/
describe('Step', () => {
  
  //===========================================================================
  // 正常系テスト
  //===========================================================================
  describe.each`
  title       | code      | desc      | rLineNum
  ${"ケース1"} | ${""}     | ${""}     | ${0}
  ${"ケース1"} | ${"test"} | ${"test"} | ${1}
  `('コンストラクタの正常系テスト', ({title, code, desc, rLineNum}) => {

    beforeEach(() => {
      step = new Step({code, desc});
    });

    describe(`constructor(${title})の時`, () => {

      it(`this.code = ${code}`, () => {
        expect(step.code).toBe(code);
      })
    
      it(`this.codeLineNum' = ${rLineNum}`, () => {
        expect(step.codeLineNum).toBe(rLineNum);
      })

      it(`this.desc = ${desc}`, () => {
        expect(step.desc).toBe(desc);
      })

    });
  });

  //===========================================================================
  // 異常系テスト
  //===========================================================================
  describe.each`
  title       | data
  ${"null"}   | ${null}
  ${"undefined"} ${undefined}
  ${"0"}         | ${0}
  ${"\"string\""}    | ${"string"}
  ${"{}"}    | ${{}}
  `('コンストラクタの異常系テスト', ({title, data}) => {

    beforeEach(() => {
      step = new Step(data);
    });

    describe(`constructor(${title})の時`, () => {

      it(`this.code = ""`, () => {
        expect(step.code).toBe("");
      })

      it('this.codeArray = []', () => {
        expect(step.codeArray).toEqual([]);
      })

      it('this.codeLineNum', () => {
        expect(step.codeLineNum).toBe(0);
      })

      it('this.desc = ""', () => {
        expect(step.desc).toBe("");
      })

    });
  });

  //===========================================================================
  // セッターのテスト
  //===========================================================================
  describe('セッターのテスト', () => {
    beforeEach(() => {
      step = new Step({});
    })

    it(`this.code = "sample"でcodeに"sample"がセットされること`, () => {
      step.code = "sample";
      expect(step.code).toBe("sample");
    });

    it(`this.desc = "sample"でdescに"sample"がセットされること`, () => {
      step.desc = "sample";
      expect(step.desc).toBe("sample");
    })
  })
});