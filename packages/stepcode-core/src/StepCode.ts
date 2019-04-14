/******************************************************************************
 * import
 *****************************************************************************/
import _get from 'lodash/get';
import Steps, { IJSON as StepsJSON } from './Steps';
import Step from './Step';
import * as Diff from 'diff';
/******************************************************************************
 * Interface
 *****************************************************************************/
/** StepCodeのJSONフォーマットインターフェース */
export interface IJSON {
  steps: StepsJSON;
}

/******************************************************************************
 * StepCodeで扱う全てのデータを制御するクラス
 *
 * 外部からstepcode-coreを扱う場合、原則としてこのクラスが窓口になります。
 *****************************************************************************/
export default class StepCode {
  /**
   * プロパティの初期化、および与えられたデータを解析し読み込みます。
   * @param datas ロードさせるStepCodeのデータ
   */
  constructor(datas: any = {}) {
    // 初期化
    this._cursor = 0;
    this._steps = new Steps();

    // データの適用
    this.apply(datas);
  }

  //---------------------------------------------------------------------------
  // privatre プロパティ

  /** ステップデータ */
  private _steps: Steps;

  /** 現在のステップを指し示すカーソルです。 */
  private _cursor: number;

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** ステップの配列インスタンスを返します。 */
  public get steps() {
    return this._steps;
  }

  /** タイトルを取得します。 */
  public get title() {
    return this.current ? this.current.title : '';
  }

  /** ステップの総数を取得します。 */
  public get count() {
    return this._steps.count;
  }

  /** カーソルの位置を取得します */
  public get currentIdx() {
    return this._cursor;
  }

  /** 最後のIndex */
  public get lastIdx() {
    return this.count - 1;
  }

  /**
   * StepCodeが利用可能かどうか
   *
   * [[constructor]]、および[[apply]]で読み込んだデータが正しく読み込めなかった場合にfalseを返します。
   */
  public get isAvailable(): boolean {
    if (!this.count) return false;
    return true;
  }

  /**
   * [[_cursor]]が指しているステップのデータを取得します
   */
  public get current() {
    return this._steps.get(this._cursor);
  }

  /**
   * [[_cursor]]が指している１つ前のステップデータを取得します
   */
  public get prev() {
    if (this.isFirst) return null;
    return this._steps.get(this._cursor - 1);
  }

  /**
   * 最初の[[Step]]を取得します
   */
  public get first() {
    return this.steps.first;
  }

  /**
   * 最後の[[Step]]を取得します
   */
  public get last() {
    return this.steps.last;
  }

  /**
   * コードに差分のある行番号の配列を返します。
   *
   * [[_cursor]]の指すステップと、その１つ前のステップのコードの差分です。
   */
  public get diffs() {
    return this.getDiffLineNums(this._cursor);
  }

  /** 現在のステップ番号(現在ページ番号として利用できます) */

  public get currentNo() {
    return this._cursor + 1;
  }

  /** 最後のステップ番号(最後の番号として利用できます) */

  public get lastNo() {
    return this.count;
  }

  /**
   * [[_cursor]]が最初のステップを指している場合にtrueになります
   */

  public get isFirst() {
    return this._cursor === 0;
  }

  /**
   * [[_cursor]]が最後のステップを指している場合にtrueになります
   */

  public get isLast() {
    return this.currentNo === this.lastNo;
  }

  /**
   * 与えられた２つの[[Step]]の差分行を計算する
   * @param base 比較元となるステップ
   * @param target 比較先となるステップ
   */
  public calcDiffs(base: Step | null, target: Step | null) {
    // 差分行番号の配列を生成する
    const diffs: number[] = [];

    // 比較対象がなければ空配列を返す
    if (!target) return diffs;

    // 比較元のステップがない(最初のページなど)の場合は、全行を変更扱い
    if (!base) {
      return target.codeArray.map((v, k) => k + 1);
    }

    // 前後の内容で差分を取り、差分行番号の配列を作成する
    let line = 0;
    const diff = Diff.diffArrays(base.codeArray, target.codeArray);

    diff.map(data => {
      // 削除された行は無視する
      if (!data.count) return;
      if (data.removed) return;

      // 追加された行数を登録
      if (data.added) {
        for (let i = 0; i < data.count; ++i) {
          diffs.push(++line);
        }
      }
      // 変更がない場合は行数だけ加算する
      else {
        line += data.count;
      }
    });

    return diffs;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * データを適用し、プロパティを初期化する。
   * @param datas ロードさせるStepCodeのデータ
   */
  public apply(datas: any) {
    // データの適用
    this._steps.apply(_get(datas, 'steps', []));

    // カーソルはデータ適用時にリセットする
    this._cursor = 0;
  }

  /**
   * JSONに変換する
   */
  public toJSON(): IJSON {
    return {
      steps: this.steps.toJSON()
    };
  }

  /**
   * 指定した位置に[[_cursor]]を移動する。
   * 範囲外を指定した場合、カーソルは0以上、ステップ数未満に収められます。
   *
   * @param point カーソルの位置
   */
  public at(point: number) {
    point = Math.max(0, point);
    point = Math.min(this.count - 1, point);
    this._cursor = point;
  }

  /**
   * [[_cursor]]が先頭に移動します。
   */
  public toFirst() {
    this.at(0);
  }

  /**
   * [[_cursor]]が最後に移動します。
   */
  public toLast() {
    this.at(this.count - 1);
  }

  /**
   * [[_cursor]]を1つ前に移動します、移動できない場合は現在の位置に留まります。
   */
  public toPrev() {
    this.at(this._cursor - 1);
  }

  /**
   * [[_cursor]]を1つ次に移動します、移動できない場合は現在の位置に留まります。
   */
  public toNext() {
    this.at(this._cursor + 1);
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * 指定したステップと１つ前のステップに含まれるコードの差分行配列を取得する。
   * @param stepIndex 差分を取得したいステップを指すIndex
   */
  private getDiffLineNums(stepIndex: number): number[] {
    // 現在と１つ前のステップを取得する
    const cur = this._steps.get(stepIndex);
    const pre = this._steps.get(stepIndex - 1);

    return this.calcDiffs(pre, cur);
  }
}
