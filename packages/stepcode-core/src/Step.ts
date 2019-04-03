/******************************************************************************
 * import
 *****************************************************************************/
import _get from 'lodash/get';

/******************************************************************************
 * 表示するソースコードと解説文を管理するクラス
 *****************************************************************************/
export default class Step 
{
  /**
   * 与えらたデータをプロパティに適用する。
   * @param data 1ステップに該当するデータ
   */
  constructor(data:any) {
    this._code = "";
    this._desc = "";
    this.apply(data);
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** コードテキスト */
  private _code:string;

  /** 解説テキスト */
  private _desc:string;

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** コードを返します。 */
  public get code() {
    return this._code;
  }

  /** コードをセットします。 */
  public set code(v:string) {
    this._code = v;
  }

  /** 改行コードで分割されたコードの配列を返します。 */
  public get codeArray() {
    if (!this.code) return [];
    return this.code.split(/\r\n|\n/);
  }

  /** コードの行数を返します。　*/
  public get codeLineNum() {
    return this.codeArray.length;
  }

  /** 解説文を返します。 */
  public get desc() {
    return this._desc;
  }

  /** 解説文をセットします */
  public set desc(v:string) {
    this._desc = v;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * 与えられたデータをプロパティに適用します。
   * @param data 1ステップに該当するデータ
   */
  apply(data:any) {
    this._code = _get(data, "code", "");
    this._desc = _get(data, "desc", "");
  }

  /**
   * JSONに変換する
   */
  public toJSON() {
    return {
      code: this._code,
      desc: this._desc
    };
  }
}