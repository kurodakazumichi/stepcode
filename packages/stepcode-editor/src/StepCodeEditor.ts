/******************************************************************************
 * import
 *****************************************************************************/
import Core, { Step } from 'stepcode-core';
import StepCode from 'stepcode';
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
import UI from './UI';
import { UIType } from './Config';
import EscapeHtml from 'escape-html';

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
    this.work     = new Step({});
    this.ui       = new UI(target);
    this.stepcode = this.initStepCode();
    this.ace      = this.initAce();
    
    // コンパイルエラー対策
    console.log(this.core);

    // タイトルが変更された時の処理
    this.ui.on(UIType.EditorTitleText, 'change', (e:Event) => {
      if (e.target instanceof HTMLInputElement)
        this.stepcode.setTitle(e.target.value);
    });

    // コードが変更された時の処理
    this.ace.on('change', (e) => {
      this.work.code = EscapeHtml(this.ace.getValue());
      this.stepcode.setStep(this.work);
    });

    // マークダウンが変更された時の処理
    this.ui.on(UIType.EditorMdInput, 'input', (e:Event) => {
      if (e.target instanceof HTMLTextAreaElement){
        this.work.desc = e.target.value;
        this.stepcode.setComment(this.work);
      }
    })
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

  /** 作業中の内容 */
  private work:Step;

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
