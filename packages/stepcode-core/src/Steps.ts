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

  /**
   * 先頭の[[Step]]を返します。
   */
  public get first() {
    return this.get(0);
  }

  /**
   * 最後の[[Step]]を返します。
   */
  public get last() {
    return this.get(this.count - 1);
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

  /**
   * 先頭に[[Step]]を追加します。
   * @param step 追加する[[Step]]
   */
  public unshift(step:Step) {
    this.steps.unshift(step);
  }

  /**
   * 末尾に[[Step]]を追加します。
   * @param step 追加する[[Step]]
   */
  public push(step:Step) {
    this.steps.push(step);
  }

  /**
   * 指定した箇所に[[Step]]を追加します。
   * @param atIndex 追加する位置
   * @param step 追加する[[Step]]
   */
  public add(atIndex:number, step:Step) {
    this.steps.splice(atIndex, 0, step);
  }

  /**
   * 先頭の[[Step]]を削除します。
   */
  public shift() {
    this.steps.shift();
  }

  /**
   * 末尾の[[Step]]を削除します。
   */
  public pop() {
    this.steps.pop();
  }

  /**
   * 指定した箇所の[[Step]]を削除します。
   * @param atIndex 削除する位置
   */
  public remove(atIndex:number) {
    this.steps.splice(atIndex, 1);
  }
}
