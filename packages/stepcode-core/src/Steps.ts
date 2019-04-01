/******************************************************************************
 * import
 *****************************************************************************/
import Step from './Step';

/******************************************************************************
 * 全てのステップデータを管理するクラス。
 * [[Step]] クラスも参照してください。
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
  // privatre プロパティ

  /** 全ステップデータ */
  private steps:Step[];

  //---------------------------------------------------------------------------
  // public アクセッサ
  
  /** ステップの総数を取得します。 */
  public get count() {
    return this.steps.length;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * 与えられたステップデータをプロパティに適用する。
   * @param datas ステップデータの配列
   */
  public apply(datas:[]) 
  {
    // データが配列じゃなかったらエラー
    if (!Array.isArray(datas)) {
      console.warn("Error: Data must be array.");
      return;
    }

    // データの数だけStepクラスを生成
    datas.map((data:any) => {
      this.steps.push(new Step(data));
    });
  }

  /**
   * 指定されたindexに[[Step]]が存在するかを返します。
   * @param index 存在を確認するステップのIndex値
   */
  public has(index:number):boolean{
    return (!!this.steps[index]);
  }

  /**
   * 指定されたindexに存在する[[Step]]を返します。
   * @param index 取得したいステップのIndex値
   */
  public get(index:number) {
    return (this.has(index))? this.steps[index] : null;
  }
}
