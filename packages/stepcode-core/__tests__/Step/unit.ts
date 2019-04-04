/******************************************************************************
 * import
 *****************************************************************************/
import Step, { IJSON } from '../../src/Step';

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
      step = new Step({title, code, desc});
    });

    describe(`constructor(${title})の時`, () => {

      it(`this.title = ${title}`, () => {
        expect(step.title).toBe(title);
      })

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

      it(`this.title = ""`, () => {
        expect(step.title).toBe("");
      })

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

    it(`this.title = "sample"でtitleに"sample"がセットされること`, () => {
      step.title = "sample";
      expect(step.title).toBe("sample");
    });    

    it(`this.code = "sample"でcodeに"sample"がセットされること`, () => {
      step.code = "sample";
      expect(step.code).toBe("sample");
    });

    it(`this.desc = "sample"でdescに"sample"がセットされること`, () => {
      step.desc = "sample";
      expect(step.desc).toBe("sample");
    })
  })

  //===========================================================================
  // copy()の検証
  //===========================================================================
  describe('copyの検証', () => {
    beforeEach(() => {
      step = new Step({code:"code", desc:"desc"});
    })

    it(`stepとstep.copy()が同じ内容であること`, () => {
      expect(step.copy()).toEqual(step);
    })
  });
  
  //===========================================================================
  // toJSON()の検証
  //===========================================================================
  describe('toJSON()の検証', () => 
  {
    let json:IJSON;
    beforeEach(() => {
      step = new Step({code:"code", desc:"desc"});
      json = step.toJSON();
    })

    it(`プロパティが足りている事をチェック`, () => {
      expect(json).toHaveProperty('title');
      expect(json).toHaveProperty('code');
      expect(json).toHaveProperty('desc');
    })

    it(`step.toJSON().desc と step.desc が一致すること`, () => {
      expect(step.desc).toBe(json.desc);
    })
  })
});