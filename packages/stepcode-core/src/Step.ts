/******************************************************************************
 * import
 *****************************************************************************/
import _get from 'lodash/get';

/******************************************************************************
 * Step::コードと解説テキストを管理するクラス
 *****************************************************************************/
export default class Step 
{
  /**
   * コンストラクタ
   * @param data 1ステップに該当するデータ
   */
  constructor(data:any) {
    this._code = "";
    this._desc = "";
    this.apply(data);
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** コードのアクセッサ */
  public get code() {
    return this._code;
  }

  /** 改行コードで分割されたコードの配列を取得する */
  public get codeArray() {
    if (!this.code) return [];
    return this.code.split(/\r\n|\n/);
  }

  /**
   * コードの行数
   */
  public get codeLineNum() {
    return this.codeArray.length;
  }

  /** 解説テキストのアクセッサ */
  public get desc() {
    return this._desc;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを適用する
   * @param data 1ステップに該当するデータ
   */
  apply(data:any) {
    this._code = _get(data, "code", "");
    this._desc = _get(data, "desc", "");
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** コードテキスト */
  private _code:string;

  /** 解説テキスト */
  private _desc:string;
}