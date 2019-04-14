import * as UI from './UI';
import Actions from './Actions';
import * as StepCode from 'stepcode';
import * as Util from '@puyan/stepcode-util';
import Store from './Store';
enum KeyCode {
  ArrowLeft = 37,
  ArrowRight = 39,
  Num6 = 54,
  Num7 = 55,
  Num8 = 56,
  Num9 = 57,
  Num0 = 48
}
export default class Events {
  constructor(ui: UI.default, store: Store, actions: Actions) {
    this.ui = ui;
    this.store = store;
    this.actions = actions;
    this.attach();
  }
  private ui: UI.default;
  private actions: Actions;
  private store: Store;

  //----------------------------------------------------------------
  public attach() {
    this.ui.on(UI.ElementType.Title, 'input', this.onInputTitle.bind(this));
    this.ui.on(UI.ElementType.Title, 'blue', this.onBlurTitle.bind(this));
    this.ui.on(UI.ElementType.File, 'input', this.onInputFile.bind(this));
    this.ui.on(UI.ElementType.File, 'blur', this.onBlurFile.bind(this));
    this.ui.on(UI.ElementType.Lang, 'change', this.onChangeLang.bind(this));
    this.ui.on(UI.ElementType.Lang, 'blur', this.onBlurLang.bind(this));

    this.ui.ace.on('change', this.onChangeAce.bind(this));
    this.ui.ace.on('blur', this.onBlurAce.bind(this));

    this.ui.on(UI.ElementType.Desc, 'input', this.onInputMarkdown.bind(this));
    this.ui.on(UI.ElementType.Desc, 'blur', this.onBlurMarkdown.bind(this));

    this.ui.on(
      UI.ElementType.AddStepLast,
      'click',
      this.onClickAddStepToLast.bind(this)
    );

    this.ui.on(
      UI.ElementType.AddStepBefore,
      'click',
      this.onClickAddStepBefore.bind(this)
    );

    this.ui.on(
      UI.ElementType.AddStepAfter,
      'click',
      this.onClickAddStepAfter.bind(this)
    );

    // ステップの削除
    this.ui.on(UI.ElementType.DelStep, 'click', this.onClickDelStep.bind(this));

    // リセットボタン
    this.ui.on(UI.ElementType.Reset, 'click', this.onClickReset.bind(this));

    // データのダウンロード
    this.ui.on(
      UI.ElementType.Download,
      'click',
      this.onClickDownload.bind(this)
    );

    // ファイルが読み込まれた時
    this.ui.on(UI.ElementType.LoadFile, 'change', this.onChangeFile.bind(this));

    // StepCodeのコールバックを設定
    this.ui.stepcode.setCallback(
      StepCode.CallbackType.PrevAfter,
      this.onChangeStepCode.bind(this)
    );
    this.ui.stepcode.setCallback(
      StepCode.CallbackType.NextAfter,
      this.onChangeStepCode.bind(this)
    );
    this.ui.stepcode.setCallback(
      StepCode.CallbackType.JumpAfter,
      this.onChangeStepCode.bind(this)
    );

    // ガイドアイテムのコールバックを設定
    this.ui.setCbOnClickGuideItem(this.onClickGuideItem.bind(this));
    this.ui.setCbOnDragStartGuideItem(this.onDragStartGuideItem.bind(this));
    this.ui.setCbOnDragEnterGuideItem(this.onDragEnterGuideItem.bind(this));
    this.ui.setCbOnDropGuideItem(this.onDropGuideItem.bind(this));

    // キーボードイベント
    document.body.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onInputTitle(e: Event) {
    console.log('input title');
    const title = Util.dom.get.value(e.target);
    this.actions.preview({ title });
  }
  private onBlurTitle(_: Event) {
    this.actions.syncStoreToPreview();
  }
  private onInputFile(e: Event) {
    const file = Util.dom.get.value(e.target);
    this.actions.preview({ file });
  }
  private onBlurFile(_: Event) {
    this.actions.syncStoreToPreview();
  }
  private onChangeLang(e: Event) {
    const lang = Util.dom.get.value(e.target);
    this.actions.preview({ lang });
  }
  private onBlurLang(_: Event) {
    this.actions.syncStoreToPreview();
  }

  /**
   * コードの内容が変更された時
   */
  private onChangeAce() {
    const code = this.ui.ace.getValue();
    this.actions.preview({ code });
    this.actions.syncScrollTopEditorToPreview();
  }

  private onBlurAce(_: Event) {
    this.actions.syncStoreToPreview();
  }

  private onInputMarkdown(e: Event) {
    // work.descとプレビューを更新
    const desc = Util.dom.get.value(e.target);
    this.actions.preview({ desc });
  }
  private onBlurMarkdown(_: Event) {
    this.actions.syncStoreToPreview();
  }

  private onClickAddStepToLast(_: Event) {
    this.actions.addStep('last');
  }

  public onClickAddStepBefore(_: Event) {
    this.actions.addStep('before');
  }

  public onClickAddStepAfter(_: Event) {
    this.actions.addStep('after');
  }

  public onClickDelStep() {
    if (!this.store.hasRemovableleSteps) {
      alert('削除できるステップがありません。');
      return;
    }

    if (!confirm(`Step${this.store.current.no}を削除します。`)) {
      return;
    }

    this.actions.removeStep();
  }

  private onClickReset(e: Event) {
    if (!confirm('内容を全てリセットします、よろしいですか？')) return;
    this.actions.reset();
  }

  private onClickDownload() {
    this.actions.download();
  }

  /**
   * ファイルが選択された時の処理
   */
  private onChangeFile(e: Event) {
    Util.file.read(e, (file: any) => {
      this.actions.load(JSON.parse(file));
    });
  }

  /**
   * ステップコードのページが変更された時の処理
   * @param stepcode ステップコード
   */
  private onChangeStepCode(_: StepCode.default) {
    this.actions.syncPreviewToEditor();
  }

  /**
   * ガイドアイテムがクリックされた時の処理
   */
  private onClickGuideItem(idx: number) {
    // クリックされたガイドアイテムに対応するページへジャンプする
    this.actions.show(idx);
  }

  /**
   * ドラッグ中のアイテムが重なった時の処理
   */
  private onDragEnterGuideItem(idx: number) {
    this.actions.showPreview(idx);
  }

  /**
   * ドラッグ開始時の処理
   */
  private onDragStartGuideItem(idx: number) {
    this.actions.showEditor(idx);
    this.actions.selectGuide(idx);
  }

  /**
   * ステップがドロップされた時の処理
   */
  public onDropGuideItem(dragIdx: number, dropIdx: number) {
    // ドロップされた場所にドラッグされたステップを入れる
    this.actions.moveStep(dragIdx, dropIdx);
  }

  /**
   * ショートカットキーイベント処理
   * Ctrl + 6:コード入力欄にfocus
   * Ctrl + 7:解説入力欄にfocus
   * Ctrl + 8:前にステップを追加
   * Ctrl + 9:後ろにステップを追加
   * Ctrl + 0:最後にステップを追加
   * Ctrl + Shift + ←:前ステップへ移動
   * Ctrl + Shift + →:右ステップへ移動
   */
  private onKeyDown(ev: KeyboardEvent) {
    if (ev.ctrlKey) {
      switch (ev.keyCode) {
        case KeyCode.Num6:
          this.ui.ace.focus();
          break;
        case KeyCode.Num7:
          this.ui.md.focus();
          break;
        case KeyCode.Num8:
          this.actions.addStep('before');
          break;
        case KeyCode.Num9:
          this.actions.addStep('after');
          break;
        case KeyCode.Num0:
          this.actions.addStep('last');
          break;
      }
    }

    if (ev.ctrlKey && ev.shiftKey) {
      switch (ev.keyCode) {
        case KeyCode.ArrowLeft:
          this.actions.toPrev();
          break;
        case KeyCode.ArrowRight:
          this.actions.toNext();
          break;
      }
    }
  }
}