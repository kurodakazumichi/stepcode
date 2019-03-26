/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import hljs from 'highlight.js';
import Steps from './steps';

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
    this._filename = "";
    this._steps = new Steps();
    this.apply(datas);
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** ファイル名 */
  public get filename() {
    return this._filename;
  }

  /** 言語 */
  public get lang() {
    const ext = this.filename.split('.').pop();
    return (!!hljs.getLanguage(ext? ext:""))? ext : "";
  }

  /** ステップ数 */
  public get stepCount() {
    return this.steps.count;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを適用する
   * @param datas データ
   */
  apply(datas:any) {
    this._filename = _.get(datas, "filename", "untile.txt");
    this._steps.apply(_.get(datas, "steps", []));
  }

  /**
   * ステップを取得する
   * @param stepIndex 取得したいステップを指すIndex
   */
  public getStep(stepIndex:number) {
    return this.steps.get(stepIndex);
  }

  /** 
   * 指定したステップと１つ前のステップに含まれるコードの差分行情報を取得する。
   * @param stepIndex 差分を取得したいステップを指すIndex
   */
  public getDiffLineNums(stepIndex:number):number[] 
  {
    // 現在と１つ前のステップを取得する
    const cur = this.steps.get(stepIndex);
    const pre = this.steps.get(stepIndex - 1);
    
    // ステップがない場合は差分が取れないので空の配列を返す
    if(!pre || !cur) { return [] };

    // 現在のコードと前回のコードを比較して差分行の配列を生成する
    const diffs:number[] = [];
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

  //---------------------------------------------------------------------------
  // private メンバ
  
  /** ファイル名 */
  private _filename:string;

  /** ステップデータ */
  private _steps:Steps;

  /** ステップデータ */
  private get steps() {
    return this._steps;
  }
}