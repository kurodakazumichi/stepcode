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

  constructor(target:string | HTMLElement) 
  {
    // StepCode(コア)を保持
    this.core = new Core({});

    console.log(this.core);
    //this.buildElement();

    this.ui = new UI(target);

    this.stepcode = new StepCode(this.ui.stepcode, {});
    
    this.ace = Ace.edit(this.ui.ace);
    this.ace.getSession().setUseWorker(false);
    this.ace.setTheme(ThemeGithub);

    // コンパイルエラー対策
    console.log(this.stepcode);
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




}
