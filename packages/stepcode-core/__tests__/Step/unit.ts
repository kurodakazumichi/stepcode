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
  title       | code      | desc      | lang    | rLineNum
  ${"ケース1"} | ${""}     | ${""}     | ${"js"} | ${0}
  ${"ケース1"} | ${"test"} | ${"test"} | ${"js"} | ${1}
  `('コンストラクタの正常系テスト', ({title, code, desc, lang, rLineNum}) => {

    beforeEach(() => {
      step = new Step({title, code, desc, lang});
    });

    describe(`constructor(${title})の時`, () => {

      it(`this.title = ${title}`, () => {
        expect(step.title).toBe(title);
      })

      it(`this.code = ${code}`, () => {
        expect(step.code).toBe(code);
      })
    
      it(`this.codeLineNum = ${rLineNum}`, () => {
        expect(step.codeLineNum).toBe(rLineNum);
      })

      it(`this.desc = ${desc}`, () => {
        expect(step.desc).toBe(desc);
      })

      it(`this.lang = ${lang}`, () => {
        expect(step.lang).toBe(lang);
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

      it('this.lang = ""', () => {
        expect(step.lang).toBe("");
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

    it(`this.lang = "js"でlangに"js"がセットされること`, () => {
      step.lang = "js";
      expect(step.lang).toBe("js");
    })
  })

  //===========================================================================
  // copy()の検証
  //===========================================================================
  describe('copyの検証', () => {
    beforeEach(() => {
      step = new Step({code:"code", desc:"desc"});
    })

    it(`stepとstep.clone()が同じ内容であること`, () => {
      expect(step.clone()).toEqual(step);
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

    it(`step.toJSON()とstepの内容 が一致すること`, () => {
      expect(step.title).toBe(json.title);
      expect(step.code).toBe(json.code);
      expect(step.desc).toBe(json.desc);
      expect(step.lang).toBe(json.lang);
    })
  })
});