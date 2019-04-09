/******************************************************************************
 * import
 *****************************************************************************/
import _get from 'lodash/get';

/******************************************************************************
 * Interface
 *****************************************************************************/
/** StepのJSONフォーマットインターフェース */
export interface IJSON {
  /** タイトル */
  title:string;

  /** ソースコード */
  code:string;

  /** 解説テキスト(マークダウン) */
  desc:string;

  /** 言語の種類 */
  lang:string;
}

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
    this._title = "";
    this._code  = "";
    this._desc  = "";
    this._lang  = "";
    this.apply(data);
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** タイトル */
  private _title:string;

  /** コードテキスト */
  private _code:string;

  /** 解説テキスト */
  private _desc:string;

  /** 言語の種類 */
  private _lang:string;

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** タイトルを返します。 */
  public get title() {
    return this._title;
  }

  /** タイトルをセットします。 */
  public set title(v:string) {
    this._title = v;
  }

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

  /** 言語の種類を返します */
  public get lang() {
    return this._lang;
  }

  /** 言語の種類をセットします */
  public set lang(v:string) {
    this._lang = v;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * 与えられたデータをプロパティに適用します。
   * @param data 1ステップに該当するデータ
   */
  apply(data:any) {
    this._title = _get(data, "title", "");
    this._code  = _get(data, "code", "");
    this._desc  = _get(data, "desc", "");
    this._lang  = _get(data, "lang", "");
  }

  /**
   * 同じ情報をもったクローンを生成する
   */
  clone() {
    return new Step(this.toJSON());
  }

  /**
   * JSONに変換する
   */
  public toJSON() :IJSON{
    return {
      title: this._title,
      code : this._code,
      desc : this._desc,
      lang : this._lang
    };
  }
}