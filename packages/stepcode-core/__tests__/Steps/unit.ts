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
    {code:"test1", desc:"test1"}
  ],
  // 2ステップデータ
  [
    {code:"test1", desc:"test1"},
    {code:"test2", desc:"test2"},
  ]
];

// Stepのサンプル
const mockStep = [
  new Step({code:"1", desc:"1"}),
  new Step({code:"2", desc:"2"}),
  new Step({code:"3", desc:"3"}),
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

      it(`this.first = new Step(data[0])`, () => {
        if (data.length === 0) {
          expect(steps.first).toEqual(null);
        } else {
          expect(steps.first).toEqual(new Step(data[0])); 
        }
      })

      it(`this.last = new Step(data[length -1])`, () => {
        if (data.length === 0) {
          expect(steps.last).toEqual(null);
        } else {
          expect(steps.last).toEqual(new Step(data[data.length - 1]));
        }
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

      it(`this.first = null`, () => {
        expect(steps.first).toEqual(null);
      })

      it(`this.last = null`, () => {
        expect(steps.last).toEqual(null);
      })

    });
  });

  //===========================================================================
  // has、getメソッドの検証
  //===========================================================================
  describe('has、getメソッドの検証', () => {

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
    });
  });

  //===========================================================================
  // has、getメソッドの検証
  //===========================================================================
  describe(`ステップ要素の追加、および削除の検証`, () => {

    beforeEach(() => { steps = new Steps(); })

    it(`Stepsの先頭に指定したStepが追加されること `, () => {
      // 要素が追加される事を確認
      steps.unshift(mockStep[0]);
      expect(steps.count).toBe(1);

      // 要素が先頭に追加される事を確認
      steps.unshift(mockStep[1]);
      expect(steps.count).toBe(2);
      expect(steps.first).toEqual(mockStep[1]);
    })

    it(`Stepsの末尾に指定したStepが追加されること`, () => {
      // 要素が追加される事を確認
      steps.push(mockStep[0]);
      expect(steps.count).toBe(1);

      // 要素が末尾に追加される事を確認
      steps.push(mockStep[1]);
      expect(steps.count).toBe(2);
      expect(steps.last).toEqual(mockStep[1]);
    })

    it(`Stepsの指定した場所に、指定したStepが追加されること`, () => {
      // 要素を追加
      steps.push(mockStep[0]);
      steps.push(mockStep[1]);
      expect(steps.count).toBe(2);

      // ２つの要素の真ん中に要素を追加
      steps.add(1, mockStep[2]);
      expect(steps.count).toBe(3);
      expect(steps.get(1)).toEqual(mockStep[2]);
    })

    it(`Stepsが空の状態でshiftをしてもエラーにならないこと`, () => {
      steps.shift();
      expect(steps.count).toBe(0);
    })

    it(`Stepsが空の状態でpopをしてもエラーにならないこと`, () => {
      steps.pop();
      expect(steps.count).toBe(0);
    })

    it(`Stepsの先頭のStepが削除されること`, () => {
      // 要素を２つ追加
      steps.push(mockStep[0]);
      steps.push(mockStep[1]);
      expect(steps.get(0)).toEqual(mockStep[0]);

      // 先頭要素を削除すると、先頭はmockStep[1]になるはず
      steps.shift();
      expect(steps.first).toEqual(mockStep[1]);
    })

    it(`Stepsの末尾のStepが削除されること`, () => {
      // 要素を２つ追加
      steps.push(mockStep[0]);
      steps.push(mockStep[1]);
      expect(steps.last).toEqual(mockStep[1]);

      // 末尾要素を削除すると、末尾はmockStep[0]になるはず
      steps.pop();
      expect(steps.last).toEqual(mockStep[0]);
    })

    it(`Stepsの指定した箇所の要素が削除されること`, () => {
      // 要素を３つ追加
      steps.push(mockStep[0]);
      steps.push(mockStep[1]);
      steps.push(mockStep[2]);

      // 真ん中の要素を削除すると要素数が2になり、先頭がmockStep[0]、末尾がmockStep[2]になるはず
      steps.remove(1);
      expect(steps.count).toBe(2);
      expect(steps.first).toEqual(mockStep[0]);
      expect(steps.last).toEqual(mockStep[2]);
    })
  })

  //===========================================================================
  // toJSON()の検証
  //===========================================================================
  describe(`new Steps(mock[2])のtoJSON()の検証`, () => {
    let json:any;
    beforeEach(() => { 
      steps = new Steps(mock[2] as [])
      json = steps.toJSON();
    });

    it('toJSON()の結果が配列であること', () => {
      expect(json).toBeInstanceOf(Array);
    })

    it(`toJSON()の要素数がsteps.countと一致すること`, () => {
      expect(json.length).toBe(steps.count);
    })

    it(`配列の要素がStepsの持つそれぞれのStepのtoJSON()した結果と一致すること`, () => {
      [0, 1].map((index) => {
        const step = steps.get(index);
        step && expect(json[index]).toEqual(step.toJSON());
      })
    })
  })
});