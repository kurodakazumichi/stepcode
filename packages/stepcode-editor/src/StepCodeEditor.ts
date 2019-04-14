/******************************************************************************
 * import
 *****************************************************************************/
import * as Util from '@puyan/stepcode-util';
import * as UI from './UI';
import * as Config from './Config';
import Store from './Store';
import Actions from './Actions';

/******************************************************************************
 * StepCodeEditorの本体
 *****************************************************************************/
export default class StepCodeEditor {
  /**
   * StepCodeEditorを構築する
   * @param target ルート要素を取得するセレクター、またはHTML要素
   */
  constructor(target: string | HTMLElement) {
    (window as any).e = this;
    this.store = new Store();
    this.ui = new UI.default(target);
    this.actions = new Actions(this.store, this.ui);
    this.load(this.getInitData());
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** 全てのHTMLELementをもつUIインスタンス */
  private ui: UI.default;

  /** ストア */
  private store: Store;

  /** アクション */
  private actions: Actions;

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * リセット処理(初期状態にする)
   */
  public reset() {
    this.actions.reset();
  }

  /**
   * データをロードする。
   * @param data StepCodeのデータ
   */
  public load(data: any) {
    this.actions.load(data);
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * 初期データを取得する
   */
  private getInitData() {
    // ストレージにデータがあればストレージのデータを、なければ初期データを使用する
    const savedata = Util.storage.load();
    const data = savedata ? savedata : Config.INIT_DATA;
    return data;
  }
}
