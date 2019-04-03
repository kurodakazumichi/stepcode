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
    this.core     = this.createCore();
    this.work     = this.createWork();
    this.ui       = this.createUI(target);
    this.stepcode = this.createStepCode();
    this.ace      = this.createAce();

    this.stepcode.setStep(this.work);
    this.ace.setValue(this.work.code);
    this.ui.md.value = this.work.desc;

    this.ui.on(UIType.EditorMdInput, 'load', (e:Event) => {
      console.log("Hoge");
      if(e.target instanceof HTMLTextAreaElement) {
        e.target.value = this.work.desc;
      }
    })

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
   * Coreを生成する
   */
  private createCore() 
  {
    // 初期データ
    const ini = {
      steps:[
        {
          code:"ここにコードを記述します。", 
          desc:"ここには解説を記述します。"
        }
      ]
    }
    return new Core(ini);
  }

  /**
   * 作業用データを生成する。[[createCore]]のあとに実行すること。
   */
  private createWork() {
    return new Step(this.core.current);
  }

  /**
   * UIを生成する
   */
  private createUI(target:string | HTMLElement) {
    return new UI(target);
  }

  /**
   * StepCodeを初期化(生成)する
   */
  private createStepCode() {
    return new StepCode(this.ui.stepcode, {});
  }

  /**
   * Ace Editorを初期化(生成)する
   */
  private createAce() {
    const ace = Ace.edit(this.ui.ace);
    ace.getSession().setUseWorker(false);
    ace.setTheme(ThemeGithub);
    return ace;
  }
}
