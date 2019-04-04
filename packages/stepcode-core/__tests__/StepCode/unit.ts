/******************************************************************************
 * import
 *****************************************************************************/
import StepCode from '../../src/StepCode';
import Step from '../../src/step';

/******************************************************************************
 * Mockデータ
 *****************************************************************************/
// step1のコード
const step1_code =``;

// step2のコード
const step2_code = `
1`;

// step3のコード
const step3_code = `
1
2
3`;

// step4のコード
const step4_code = `
1

3
4`;

// step5のコード
const step5_code = `0`;

// StepCodeのモックデータ1
const mock1 = {
  steps: [
    {title: "sample1", code:step1_code, desc:"step1"},
    {title: "sample1", code:step2_code, desc:"step2"},
    {title: "sample1", code:step3_code, desc:"step3"},
    {title: "sample1", code:step4_code, desc:"step4"},
    {title: "sample1", code:step5_code, desc:"step5"},
  ]
};

/******************************************************************************
 * グローバル変数
 *****************************************************************************/
let stepCode:StepCode;

/******************************************************************************
 * StepsクラスのUnitテスト
 *****************************************************************************/
describe('Steps', () => {

  //===========================================================================
  describe('インスタンス生成(正常系)の検証', () => {

    describe('new StepCode(mock1)', () => {
      beforeEach(() => {
        stepCode = new StepCode(mock1);
      });
  
      it(`title = ${mock1.steps[0].title}になること`, () => {
        expect(stepCode.title).toBe(mock1.steps[0].title);
      });
  
      it(`count = ${mock1.steps.length}になること`, () => {
        expect(stepCode.count).toBe(mock1.steps.length);
      });
  
      it(`isAvailable = trueになること`, () => {
        expect(stepCode.isAvailable).toBe(true);
      });
  
      it(`currentが最初のステップを指していること`, () => {
        expect(stepCode.current).toEqual(new Step(mock1.steps[0]));
      });
  
      it(`currentNoは1になること`, () => {
        expect(stepCode.currentNo).toBe(1);
      })
  
      it(`lastNoは${mock1.steps.length}になること`, () => {
        expect(stepCode.lastNo).toBe(mock1.steps.length);
      })
  
      it(`isFirstがtrueになること`, () => {
        expect(stepCode.isFirst).toBe(true);
      })
  
      it(`isLastがfalseになること`, () => {
        expect(stepCode.isLast).toBe(false);
      })
    })

  });

  //===========================================================================
  describe.each`
  title       | data
  ${"null"}       | ${null}
  ${"undefined"}  | ${undefined}
  ${"0"}          | ${0}
  ${"\"string\""} | ${"string"}
  ${"{}"}         | ${{}}
  `('インスタンスを生成(異常系)の検証', ({title, data}) => {

    beforeEach(() => {
      stepCode = new StepCode(data);
    });

    describe(`new StepCode(${title})の検証`, () => {

      it(`title = ""になること`, () => {
        expect(stepCode.title).toBe("");
      });
  
      it(`count = 0になること`, () => {
        expect(stepCode.count).toBe(0);
      });
  
      it(`isAvailable = falseになること`, () => {
        expect(stepCode.isAvailable).toBe(false);
      });
  
      it(`current = nullになること`, () => {
        expect(stepCode.current).toEqual(null);
      });
  
      it(`currentNo = 1になること`, () => {
        expect(stepCode.currentNo).toBe(1);
      })

      it(`diffs = []になること`, () => {
        expect(stepCode.diffs).toEqual([]);
      })
  
      it(`lastNoは = 0になること`, () => {
        expect(stepCode.lastNo).toBe(0);
      })
  
      it(`isFirstがtrueになること`, () => {
        expect(stepCode.isFirst).toBe(true);
      })
  
      it(`isLastがtrueになること`, () => {
        expect(stepCode.isLast).toBe(false);
      })
    });
  });

  //===========================================================================
  describe.each`
  title                 | code      | result
  ${"改行なし + 文字なし"} | ${''}     | ${[]}
  ${"改行なし + 文字あり"} | ${'1'}    | ${[1]}
  ${"改行あり + 文字なし"} | ${'\n'}   | ${[1,2]}
  ${"改行あり + 文字あり"} | ${'1\n1'} | ${[1,2]}
  `('最初のページにおける差分行の判定処理テスト', ({title, code, result}) => {

    beforeEach(() => { 
      stepCode = new StepCode({title:"test", steps:[{code}]}); 
    })

    it(`最初に設定されたコードが「${title}」の場合、初回のdiffsが[${result}]になっていること`, () => {
      expect(stepCode.diffs).toEqual(result);
    });

  });

  //===========================================================================
  describe('publicメソッドの動作検証 (new StepCode(mock1)', () => {

    beforeEach(() => {
      stepCode = new StepCode(mock1);
    })
    
    //-------------------------------------------------------------------------
    describe.each`
    point | currentNo
    ${-1} | ${1}
    ${0}  | ${1}
    ${1}  | ${2}
    ${2}  | ${3}
    ${3}  | ${4}
    ${4}  | ${5}
    ${5}  | ${5}
    `('at(point)の検証', ({point, currentNo}) => {

      it(`at(${point})を指定するとcurrentNoが${currentNo}になること`, () => {
        stepCode.at(point);
        expect(stepCode.currentNo).toBe(currentNo);
      })

    })

    //-------------------------------------------------------------------------
    describe(`last()の検証`, () => {
      it(`last()を実行するとcurrentNoが${mock1.steps.length}になること`, () => {
        stepCode.last();
        expect(stepCode.currentNo).toBe(mock1.steps.length);
      });
    });

    //-------------------------------------------------------------------------
    describe(`first()の検証`, () => {
      it('first()を実行するとcurrentNoが1に戻ること', () => {
        stepCode.last();
        stepCode.first();
        expect(stepCode.currentNo).toBe(1);
      })
    });

    //-------------------------------------------------------------------------
    describe(`prev()の検証`, () => {
      it(`先頭でprev()を実行しても前に戻ら無いこと`, () => {
        stepCode.first();
        const no = stepCode.currentNo;
        stepCode.prev();
        expect(stepCode.currentNo).toBe(no);
      });

      it(`prev()を実行すると前に戻ること`, () => {
        stepCode.last();
        const no = stepCode.currentNo;
        stepCode.prev();
        expect(stepCode.currentNo).toBe(no - 1);
      })
    });

    //-------------------------------------------------------------------------
    describe(`next()の検証`, () => {
      it(`next()を実行すると次に進むこと`, () => {
        stepCode.first();
        const no = stepCode.currentNo;
        stepCode.next();
        expect(stepCode.currentNo).toBe(no + 1);
      });

      it(`最後のページでnext()をしても次に進まないこと`, () => {
        stepCode.last();
        const no = stepCode.currentNo;
        stepCode.next();
        expect(stepCode.currentNo).toBe(no);
      })
    });

    //-------------------------------------------------------------------------
    describe.each`
    point | diffs
    ${0}  | ${[]}
    ${1}  | ${[1,2]}
    ${2}  | ${[3,4]}
    ${3}  | ${[3,5]}
    ${4}  | ${[1]}
    `(`diffsの検証`, ({point, diffs}) => {

      it(`at(${point})のdiffsは[${diffs}]になること`, () => {
        stepCode.at(point);
        expect(stepCode.diffs).toEqual(diffs);
      })
    });

    //-------------------------------------------------------------------------
    describe('toJSONの検証', () => {
      it('toJSON().steps と stepCode.steps.toJSON() が一致すること', () => {
        expect(stepCode.toJSON().steps).toEqual(stepCode.steps.toJSON());
      })
    })
  });
});