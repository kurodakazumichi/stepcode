/******************************************************************************
 * import
 *****************************************************************************/
import Core from 'stepcode-core';
import StepCode from 'stepcode';
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
import UI from './UI';


/******************************************************************************
 * StepCodeEditorの本体
 *****************************************************************************/
export default class StepCodeEditor {

  /**
   * StepCodeEditorを構築する
   * @param target ルート要素を取得するセレクター、またはHTML要素
   */
  constructor(target:string | HTMLElement) 
  {
    this.core     = new Core({});
    this.ui       = new UI(target);
    this.stepcode = this.initStepCode();
    this.ace      = this.initAce();

    // コンパイルエラー対策
    console.log(this.core);
    console.log(this.stepcode);
    console.log(this.ace);
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** StepCode本体 */
  private core:Core;

  /** 全てのHTMLELementをもつUIインスタンス */
  private ui:UI;

  /** StepCode本体 */
  private stepcode:StepCode;

  /** Ace Editor */
  private ace: Ace.Ace.Editor;

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * StepCodeを初期化(生成)する
   */
  private initStepCode() {
    return new StepCode(this.ui.stepcode, {});
  }

  /**
   * Ace Editorを初期化する
   */
  private initAce() {
    const ace = Ace.edit(this.ui.ace);
    ace.getSession().setUseWorker(false);
    ace.setTheme(ThemeGithub);
    return ace;
  }
}
