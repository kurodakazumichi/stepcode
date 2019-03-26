/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import UI from './ui';
import Data from './data';

/******************************************************************************
 * StepCodeの本体
 *****************************************************************************/
export default class StepCode 
{
  /**
   * コンストラクタ
   * @param data データ
   */
  constructor(data:any) {
    this.currentIndex = 0;
    this.ui = null;
    this.data = new Data(data);
  }

  //---------------------------------------------------------------------------
  // public アクセッサ


  /** タイトルを取得 */
  public get title() {
    return this.data.filename;
  }

  public get lang() {
    return this.data.lang;
  }

  // 現在のステップを取得
  public get current() {
    return this.data.getStep(this.currentIndex);
  }

  public get diffs() {
    return this.data.getDiffLineNums(this.currentIndex);
  }


  // 再生可能です
  public get canPlay() {
    return (0 < this.data.stepCount);
  }

  // 現在のページ数
  public get currentPageNum() {
    return this.currentIndex + 1;
  }

  // 合計のページ数
  public get totalPageNum() {
    return this.data.stepCount;
  }

  // 最後のステップです
  public get isLastStep() {
    return (this.currentPageNum === this.totalPageNum);
  }

  // 最初のステップです
  public get isFirstPage() {
    return (this.currentIndex === 0);
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * 
   * @param data 適用したいStepCodeのデータ
   */
  public apply(data:any) {
    this.currentIndex = 0;
    this.data.apply(data);
  }

  public createUI(selector:string) {
    this.ui = new UI(this, selector);
    this.ui.update();
    return this;
  }

  // 次のステップに進む
  public next() 
  {
    const index = Math.min(this.totalPageNum - 1, this.currentIndex + 1);

    // indexが変わらないのであれば何もしない
    if (index === this.currentIndex) return;

    // indexとUIを更新
    this.currentIndex = index;
  }

  // 前のステップに戻る
  public prev() 
  {
    const index = Math.max(0, this.currentIndex - 1);

    // indexが変わらないのであれば何もしない
    if (index === this.currentIndex) return;

    // indexとUIを更新
    this.currentIndex = index;
  }
  //---------------------------------------------------------------------------
  // private メンバ

  /** StepCodeのUI */
  private ui:UI|null;

  /** StepCodeのデータ */
  private data:Data;

  /** 現在のページIndex */
  private currentIndex:number;
  
  
}