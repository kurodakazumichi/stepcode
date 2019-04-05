/******************************************************************************
 * import
 *****************************************************************************/
import Core, { Step } from 'stepcode-core';
import * as StepCode from 'stepcode';
import Ace from 'ace-builds';
import ThemeGithub from 'ace-builds/src-noconflict/theme-github';
import UI from './UI';
import { UIType } from './Config';

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
    this.stepcode = this.createStepCode();
    this.ace      = this.createAce();

    // UIにデータを設定
    this.stepcode.load(this.core.toJSON());
    this.ace.setValue(this.work.code);
    this.ui.md.value = this.work.desc;

    // タイトルが変更された時の処理
    this.ui.on(UIType.EditorHeaderTitle, 'change', (e:Event) => {
      if (e.target instanceof HTMLInputElement) {
        this.work.title = e.target.value;
        this.syncEditorToPreview();
      } 
    });

    // コードが変更された時の処理
    this.ace.on('change', (e) => {
      this.work.code = this.ace.getValue();
      this.stepcode.setCode(this.work);
    });

    this.ace.on('blur', (e) => {
      this.syncEditorToPreview();
    });

    // マークダウンが変更された時の処理
    this.ui.on(UIType.EditorMdInput, 'input', (e:Event) => {
      if (e.target instanceof HTMLTextAreaElement){
        this.work.desc = e.target.value;
        this.stepcode.setComment(this.work);
      }
    })

    this.ui.on(UIType.EditorMdInput, 'blur', (e:Event) => {
      this.syncEditorToPreview();
    })

    // 保存ボタンのクリック処理
    this.ui.on(UIType.MenuAddStep, 'click', (e:Event) => {
      this.core.steps.push(this.work.copy());
      this.stepcode.load(this.core.toJSON());
      this.stepcode.setNo(this.stepcode.lastNo);
    })

    // 更新ボタンのクリック処理
    // this.ui.on(UIType.MenuUpdateButton, 'click', () => {
    //   this.core.at(this.stepcode.currentNo -1);
    //   (this.core.current as Step).apply(this.work);
    //   const cNo = this.stepcode.currentNo;
    //   this.stepcode.load(this.core.toJSON());
    //   this.stepcode.setNo(cNo);
    // })

    this.stepcode.setCallback(StepCode.CallbackType.PrevAfter, (stepcode) => {
      this.syncPreviewToEditor();
    });

    this.stepcode.setCallback(StepCode.CallbackType.NextAfter, (stepcode) => {
      this.syncPreviewToEditor();
    });

    // TODO:ステップの削除
    this.ui.on(UIType.MenuDelStep, 'click', (e:Event) => {
      const idx = this.stepcode.currentIdx;
      this.core.steps.remove(idx);
      this.core.at(idx);
      if(this.core.current)
        this.work.apply(this.core.current.toJSON());
      this.syncPreviewToEditor();
      this.syncEditorToPreview();

    });

    // リセットボタン
    this.ui.on(UIType.MenuReset, 'click', (e:Event) => {
      if(confirm("内容を全てリセットします、よろしいですか？")) {
        sessionStorage.clear();
        window.location.reload();
      }
    });

    // ステップを前に追加する
    this.ui.on(UIType.MenuAddStepBefore, 'click', (e:Event) => {
      const idx = this.stepcode.currentIdx;
      this.core.steps.add(idx, this.work.copy());
      this.stepcode.load(this.core.toJSON());
      this.stepcode.setNo(idx + 1);
    });

    // ステップを後に追加する
    this.ui.on(UIType.MenuAddStepAfter, 'click', (e:Event) => {
      const idx = this.stepcode.currentIdx + 1;
      this.core.steps.add(idx, this.work.copy());
      this.stepcode.load(this.core.toJSON());
      this.stepcode.setNo(idx + 1);
    });

    // TODO:データのダウンロード
    this.ui.on(UIType.MenuDownload, 'click', () => {
      const blob = new Blob([JSON.stringify(this.core.toJSON())], {type:'application/json'});
      const url  = URL.createObjectURL(blob);
      const anchor = this.ui.get<HTMLAnchorElement>(UIType.MenuDownload);
      anchor.href = url;
      anchor.download = "stepdata.json";
    });

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
            this.stepcode.load(JSON.parse(target.result));
            this.core.apply(JSON.parse(target.result));
            this.syncPreviewToEditor();
          }
          
        }
      }
        
      
      
    });
  }

  /**
   * Editorの入力内容をPreviewと同期する
   */
  syncEditorToPreview() {

    // Previewが表示しているIdx、Noを取得
    const idx = this.stepcode.currentIdx;
    const no  = this.stepcode.currentNo;

    console.log(idx, no);

    // Coreの方もPreviewと同じ位置に設定する
    this.core.at(idx);
    
    // 入力内容をCoreに適用する
    (this.core.current as Step).apply(this.work);

    // Coreの内容をPreviewに読み込ませる
    this.stepcode.load(this.core.toJSON());

    // 表示ページを更新
    this.stepcode.show(no);

    // TODO: ストレージにデータを保存
    sessionStorage.setItem("data", JSON.stringify(this.core.toJSON()));

  }

  syncPreviewToEditor() {
    const idx = this.stepcode.currentIdx;

    
    const step = this.core.steps.get(idx);

    if (step) {
      this.ui.md.value = step.desc;
      this.ace.setValue(step.code);
      this.ace.clearSelection();
      this.work.apply(step);
    }
    
  }

  //---------------------------------------------------------------------------
  // private プロパティ

  /** StepCode本体 */
  private core:Core;

  /** 全てのHTMLELementをもつUIインスタンス */
  private ui:UI;

  /** StepCode本体 */
  private stepcode:StepCode.default;

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
    let data:any;
    // 初期データ
    const ini = {
      steps:[
        {
          code:"ここにコードを記述します。", 
          desc:"ここには解説を記述します。"
        }
      ]
    }

    // TODO: ストレージにデータがあればそのデータから復元する
    let save = sessionStorage.getItem("data");
    if (save) {
      data = JSON.parse(save);
    } else {
      data = ini;
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
  private createUI(target:string | HTMLElement) {
    return new UI(target);
  }

  /**
   * StepCodeを初期化(生成)する
   */
  private createStepCode() {
    return new StepCode.default(this.ui.stepcode, {});
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
}
