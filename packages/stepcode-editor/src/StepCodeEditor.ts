/******************************************************************************
 * import
 *****************************************************************************/
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
import Core, { Step } from 'stepcode-core';
import * as StepCode from 'stepcode';
import UI from './UI';
import { UIType } from './Config';
import * as Util from './Util';

/******************************************************************************
 * 定数
 *****************************************************************************/
/** デフォルトで表示するコードの内容 */
const DEF_CODE_TEXT = "ここにコードを記述します。";

/** デフォルトで表示する解説の内容 */
const DEF_DESC_TEXT = "ここには解説を記述します。";

/**
 * ステップコードのデータが存在しない場合に使用される初期データ
 */
const INIT_DATA = {
  steps:[
    {
      code:DEF_CODE_TEXT, 
      desc:DEF_DESC_TEXT
    }
  ]
}

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
    (window as any).e = this;
    this.core     = this.createCore();
    this.work     = this.createWork();
    this.ui       = this.createUI(target);
    this.ace      = this.createAce();

    // UIにデータを設定
    this.updateUI(this.core);
    this.attachEvent();
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** StepCode本体 */
  private core:Core;

  /** 全てのHTMLELementをもつUIインスタンス */
  private ui:UI;

  /** Ace Editor */
  private ace: Ace.Ace.Editor;

  /** 作業中の内容 */
  private work:Step;


  //---------------------------------------------------------------------------
  // public プロパティ

  /**
   * ステップが削除できるかどうか
   * ステップ削除はステップが２つ以上ないとできない。
   */
  public get canDeleteStep() {
    return (2 <= this.core.count);
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /**
   * リセット処理(初期状態にする)
   */
  public reset() 
  {
    // Core、Workを初期状態にする
    this.core.apply(INIT_DATA);
    this.work.apply(this.core.current);

    // セッションストレージをクリア
    Util.storage.clear();

    // UIを更新
    this.updateUI(this.core);
  }

  /**
   * ステップを末尾に追加する
   */
  public addStepLast() {
    const addIndex = this.core.count;
    this.addStep(addIndex, this.work);
  }

  /**
   * ステップを前に追加する
   */
  public addStepBefore() {
    const addIndex = this.ui.stepcode.currentIdx;
    this.addStep(addIndex, this.work);
  }

  /**
   * ステップを後ろに追加する
   */
  public addStepAfter() {
    const addIndex = this.ui.stepcode.currentIdx + 1;
    this.addStep(addIndex, this.work);
  }

  /**
   * 現在のステップを削除する
   */
  public delStepCurrent() {
    if (!this.canDeleteStep) {
      alert("このステップは削除できません。");
      return;
    }
    
    this.deleteStep(this.core.cursor);
  }

  /**
   * 指定した[[Step]]を削除する
   * @param delIndex 削除するステップの位置
   */
  public deleteStep(delIndex:number) {
    if (!this.canDeleteStep) return false;

    this.core.steps.remove(delIndex);
    this.core.at(delIndex);
    this.work.apply(this.core.current);
    this.updateUI(this.core);
    return true;
  }



  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * Coreを生成する
   */
  private createCore() 
  {
    let data:any;

    // TODO: ストレージにデータがあればそのデータから復元する
    let save = sessionStorage.getItem("data");
    if (save) {
      data = JSON.parse(save);
    } else {
      data = INIT_DATA;
    }

    return new Core(data);
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
  private createUI(target:string |  HTMLElement) {
    return new UI(target);
  }



  /**
   * Ace Editorを初期化(生成)する
   */
  private createAce() {
    const ace = Ace.edit(this.ui.ace);
    ace.container.style.lineHeight = "1.5";
    ace.container.style.fontSize = "16px";
    ace.getSession().setUseWorker(false);
    ace.setTheme(ThemeGithub);
    return ace;
  }

  //---------------------------------------------------------------------------
  // UI関連

  /**
   * Coreの内容でUIを更新する
   * @param core Core
   */
  private updateUI(core: Core) 
  {
    // UIを更新
    this.updateEditor(core);
    this.updateGuide(core);

    // ステップコードを更新
    this.updateStepCode(core);
  }

  /**
   * コアの内容でEditorを更新する
   * @param core コア
   */
  private updateEditor(core: Core) {
    const step = core.current;
    this.ace.setValue(step? step.code : DEF_CODE_TEXT);
    this.ui.md.value = (step? step.desc : DEF_DESC_TEXT);
    this.ace.clearSelection();
  }

  /**
   * ステップコードを更新する
   * @param core コア
   */
  private updateStepCode(core:Core) {
    this.ui.stepcode.load(core.toJSON());
    this.ui.stepcode.show(core.currentNo);
  }

  /**
   * ステップを追加しUIを更新する
   * @param index ステップを追加する位置
   * @param step 追加するステップ
   */
  private addStep(index:number, step:Step) {
    this.core.steps.add(index, step.clone());
    this.core.at(index);
    this.updateStepCode(this.core);
    this.updateGuide(this.core, true);
  }

  private updateGuide(core:Core, isInsert = false) {
    this.ui.adjustGuideItem(this.core.count);
    this.ui.clearGuideItemClass();
    this.ui.selectedGuideItem(this.core.cursor);
    if(isInsert) {
      this.ui.insertedGuideItem(this.core.cursor);
    }
  }

  private attachEvent() {
    //-------------------------------------------------------------------------
    // タイトルが変更された時の処理
    this.ui.on(UIType.EditorHeaderTitle, 'input', this.onInputTitle.bind(this));
    this.ui.on(UIType.EditorHeaderTitle, 'blur', this.reflectEditorToStepCode.bind(this));

    //-------------------------------------------------------------------------
    // 言語変更時
    this.ui.on(UIType.EditorHeaderLang, 'change', this.onChangeLang.bind(this));
    this.ui.on(UIType.EditorHeaderLang, 'blur', this.reflectEditorToStepCode.bind(this));


    //-------------------------------------------------------------------------
    // コードが変更された時の処理
    this.ace.on('change', this.onChangeAce.bind(this));
    this.ace.on('blur', this.reflectEditorToStepCode.bind(this));

    //-------------------------------------------------------------------------
    // マークダウンが変更された時の処理
    this.ui.on(UIType.EditorMdInput, 'input', this.onInputMarkdown.bind(this));
    this.ui.on(UIType.EditorMdInput, 'blur', this.reflectEditorToStepCode.bind(this));

    //-------------------------------------------------------------------------
    // ステップ追加をクリック
    this.ui.on(UIType.MenuAddStep, 'click', this.addStepLast.bind(this));

    // ステップを前に追加する
    this.ui.on(UIType.MenuAddStepBefore, 'click', this.addStepBefore.bind(this));

    // ステップを後に追加する
    this.ui.on(UIType.MenuAddStepAfter, 'click', this.addStepAfter.bind(this));

    // ステップの削除
    this.ui.on(UIType.MenuDelStep, 'click', this.delStepCurrent.bind(this));

    // リセットボタン
    this.ui.on(UIType.MenuReset, 'click', this.onClickReset.bind(this));

    // データのダウンロード
    this.ui.on(UIType.MenuDownload, 'click', this.onClickDownload.bind(this));

    //-------------------------------------------------------------------------
    this.ui.on(UIType.Main, 'dragover', (e:Event) => {
      console.log("dragover");
      e.preventDefault();
    });

    this.ui.on(UIType.Main, 'drop', (e:Event) => {
      const ev = e as DragEvent;

      ev.preventDefault();
      if (ev.dataTransfer) {
        const file = ev.dataTransfer.files.item(0) as File;
        console.log(file);

        const fr = new FileReader();
        fr.readAsText(file, 'UTF-8');
        fr.onload = (evt:ProgressEvent) => {
          if(evt.target) {
            const target = evt.target as any;
            console.log(JSON.parse(target.result));
            this.ui.stepcode.load(JSON.parse(target.result));
            this.core.apply(JSON.parse(target.result));
            this.reflectStepCodeToEditor(this.ui.stepcode);
          }
          
        }
      }
    });

    this.ui.stepcode.setCallback(StepCode.CallbackType.PrevAfter, this.onChangeStepCode.bind(this));
    this.ui.stepcode.setCallback(StepCode.CallbackType.NextAfter, this.onChangeStepCode.bind(this));
    this.ui.stepcode.setCallback(StepCode.CallbackType.JumpAfter, this.onChangeStepCode.bind(this));

 
  }

  //---------------------------------------------------------------------------
  // イベント関連

  /**
   * タイトルの入力内容が変更された時
   * @param e イベントオブジェクト
   */
  private onInputTitle(e:Event) 
  {
    // work.title、プレビューを更新
    this.work.title = Util.getValue(e.target);
    this.ui.stepcode.previewTitle(this.work.title);

    // セッションストレージに保存
    this.saveWorkToStorage();
  }

  /**
   * 言語の内容が変更された時
   * @param e イベントオブジェクト
   */
  private onChangeLang(e:Event) 
  {
    // work.lang、プレビューを更新
    this.work.lang = Util.getValue(e.target);
    this.ui.stepcode.previewCode(this.work);

    // セッションストレージに保存
    this.saveWorkToStorage();
  }

  /**
   * コードの内容が変更された時
   */
  private onChangeAce() 
  {
    // work.code、プレビューを更新
    this.work.code = this.ace.getValue();
    this.ui.stepcode.previewCode(this.work);
    this.ui.stepcode.setEditorScrollTop(this.ace.getSession().getScrollTop());

    // セッションストレージに保存
    this.saveWorkToStorage();
  }

  /**
   * マークダウンの入力内容が変更された時
   * @param e イベントオブジェクト
   */
  private onInputMarkdown(e:Event) 
  {
    // work.descとプレビューを更新
    this.work.desc = Util.getValue(e.target);
    this.ui.stepcode.previewComment(this.work);

    // セッションステレーじに保存
    this.saveWorkToStorage();
  }

  /**
   * リセットボタンが押された時の処理
   * @param e イベントオブジェクト
   */
  private onClickReset(e:Event) {
    if(!confirm("内容を全てリセットします、よろしいですか？")) return;
    this.reset();
  }

  /**
   * ステップコードのページが変更された時の処理
   * @param stepcode ステップコード
   */
  private onChangeStepCode(stepcode:StepCode.default) {
    this.reflectStepCodeToEditor(stepcode);
  }

  private onClickDownload() {
    const blob = new Blob([JSON.stringify(this.core.toJSON())], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const anchor = this.ui.get<HTMLAnchorElement>(UIType.MenuDownload);
    anchor.href = url;
    anchor.download = "stepdata.json";
  }

  /**
   * Editorの内容を[[StepCode]]に反映する。
   */
  private reflectEditorToStepCode() 
  {
    // 入力されている内容(Work)をCoreに同期する
    this.syncWorkToCurrentOfCore();

    // StepCodeを更新
    this.updateStepCode(this.core);
  }

  /**
   * [[StepCode]]の内容をEditorに反映する
   * @param stepcode 
   */
  private reflectStepCodeToEditor(stepcode:StepCode.default) 
  {
    // StepCodeの現在位置をCoreに反映
    const idx = stepcode.currentIdx;
    this.core.at(idx);

    // エディターとガイドを更新
    this.updateEditor(this.core);
    this.updateGuide(this.core);
  }

  //---------------------------------------------------------------------------
  // データ管理

  /**
   * Workの内容をストレージに保存する。
   */
  private saveWorkToStorage() {
    Util.storage.saveMeta(this.core);
    Util.storage.saveStep(this.core.cursor, this.work);
  }

  /**
   * Workの内容をCoreのcurrentステップに同期する
   */
  private syncWorkToCurrentOfCore() {
    if (this.core.current) {
      this.core.current.apply(this.work.toJSON());
    }
  }
}
