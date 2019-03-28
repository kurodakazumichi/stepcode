/******************************************************************************
 * import
 *****************************************************************************/
import Step from './Step';

/******************************************************************************
 * 前ステップデータを管理するクラス
 *****************************************************************************/
export default class Steps 
{
  /**
   * コンストラクタ
   * @param datas ステップデータの配列
   */
  constructor(datas:[] = []) {
    this.steps = [];
    this.apply(datas);
  }

  //---------------------------------------------------------------------------
  // public アクセッサ
  
  /** データ数 */
  public get count() {
    return this.steps.length;
  }

  /** 指定されたステップデータを持っているか */
  public has(index:number):boolean{
    return (!!this.steps[index]);
  }

  /** 指定されたIndexに該当するデータを返す */
  public get(index:number) {
    return (this.has(index))? this.steps[index] : null;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを適用する
   * @param datas ステップデータの配列
   */
  public apply(datas:[]) 
  {
    // データが配列じゃなかったらエラー
    if (!Array.isArray(datas)) {
      console.warn("data error");
      return;
    }

    // データの数だけStepクラスを生成
    datas.map((data:any) => {
      this.steps.push(new Step(data));
    });
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** 全ステップデータ */
  private steps:Step[];
}
