/******************************************************************************
 * import
 *****************************************************************************/
import _get from 'lodash/get';
import Steps from './Steps';

/******************************************************************************
 * StepCodeのデータクラス
 *****************************************************************************/
export default class Data 
{
  /**
   * コンストラクタ
   * @param datas データ
   */
  constructor(datas:any) 
  {
    // 初期化
    this._cursor = 0;
    this._title  = "";
    this._steps  = new Steps();

    // データの適用
    this.apply(datas);
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** タイトル */
  public get title() {
    return this._title;
  }

  /** ステップ数 */
  public get count() {
    return this._steps.count;
  }

  /**
   * StepCodeが利用可能かどうか
   */
  public get isAvailable(): boolean {
    if (!this.count) return false;
    return true;
  }

  /**
   * 現在のステップデータ
   */
  public get current() {
    return this._steps.get(this._cursor);
  }

  /**
   * 差分のある行番号の配列
   */
  public get diffs() {
    return this.getDiffLineNums(this._cursor);
  }

  // 現在のステップ番号
  public get currentNo() {
    return this._cursor + 1;
  }

  // 最後のステップ番号
  public get lastNo() {
    return this.count;
  }

  // 最初です
  public get isFirst() {
    return (this._cursor === 0);
  }

  // 最後です
  public get isLast() {
    return (this.currentNo === this.lastNo);
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを適用する
   * @param datas データ
   */
  apply(datas:any) 
  {  
    // データの適用
    this._title = _get(datas, "title", "タイトル無し");
    this._steps.apply(_get(datas, "steps", []));

    // カーソルはデータ適用時にリセットする
    this._cursor = 0;
  }

  /**
   * cursorを指定する
   * @param point カーソルの位置
   */
  public at(point:number) {
    point = Math.max(0, point);
    point = Math.min(this.count - 1, point);
    this._cursor = point;
  }

  /**
   * cursorを最初に戻す
   */
  public first() {
    this.at(0);
  }

  /** 
   * cursorを最後に進める 
   */
  public last() {
    this.at(this.count - 1);
  }

  /**
   * cursorの値を前へ戻す
   */
  public prev() {
    this.at(this._cursor - 1);
  }

  /**
   * cursorの値を次へ進める
   */
  public next() {
    this.at(this._cursor + 1);
  }

  //---------------------------------------------------------------------------
  // private メンバ
  
  /** タイトル */
  private _title:string;

  /** ステップデータ */
  private _steps:Steps;

  /** ステップを指し示すカーソル(Index) */
  private _cursor:number;

  //---------------------------------------------------------------------------
  // private メソッド

  /** 
   * 指定したステップと１つ前のステップに含まれるコードの差分行情報を取得する。
   * @param stepIndex 差分を取得したいステップを指すIndex
   */
  private getDiffLineNums(stepIndex:number):number[] 
  {
    // 現在と１つ前のステップを取得する
    const cur = this._steps.get(stepIndex);
    const pre = this._steps.get(stepIndex - 1);
    
    // 差分行番号の配列を生成する
    const diffs:number[] = [];

    // ありえないが、現在のステップがなければ差分もクソもないのでから配列を返して終わり
    if (!cur) return diffs;

    // 前のステップがない(最初のページ)の場合は、全行を変更扱い
    if (!pre) {
      return cur.codeArray.map((v, k) => k + 1)
    }

    const preArray = pre.codeArray;

    // 現ステップの１行を前ステップのコードと総当たりチェックする
    cur.codeArray.map((curLine, curIndex) => {

      const matchIndex = preArray.indexOf(curLine);

      // マッチする行がなければ新規行か変更行
      if (matchIndex === -1) {
        diffs.push(curIndex + 1);
      } else {
        preArray.splice(matchIndex, 1);
      }
    })

    return diffs;
  }
}