import * as Util from '@puyan/stepcode-util';
import Store from './Store';
import * as UI from './UI';
import * as Config from './Config';
import * as StepCode from 'stepcode';
import { Step } from 'stepcode-core';

enum KeyCode {
  ArrowLeft = 37,
  ArrowRight = 39,
  Num6 = 54,
  Num7 = 55,
  Num8 = 56,
  Num9 = 57,
  Num0 = 48
}

type PositionToAddStep = 'last' | 'before' | 'after';

export default class Actions {
  constructor(store: Store, ui: UI.default) {
    this.store = store;
    this.ui = ui;
    this.attach();
  }

  private store: Store;
  private ui: UI.default;

  public reset() {
    this.load(Config.INIT_DATA);
  }

  public load(data: any) {
    this.store.load(data);
    this.ui.update(this.store);
  }

  public preview(data: {
    title?: string;
    file?: string;
    lang?: string;
    code?: string;
    desc?: string;
  }) {
    this.store.updateCurrent(data);
    this.ui.stepcode.preview(this.store.getCurrentStep());
  }

  public syncScrollTopEditorToPreview() {
    const value = this.ui.ace.getSession().getScrollTop();
    this.ui.stepcode.setScrollTopToEditor(value);
  }
  public syncScrollTopPreviewToEditor() {
    const value = this.ui.stepcode.getScrollTopOfEditor();
    this.ui.ace.getSession().setScrollTop(value);
  }

  public addStep(position: PositionToAddStep, step?: Step) {
    let guideIndex;
    switch (position) {
      case 'before':
        guideIndex = this.store.addStepBefore(step).idx;
        break;
      case 'after':
        guideIndex = this.store.addStepAfter(step).idx - 1;
        break;
      default:
        guideIndex = this.store.addStepToLast(step).idx - 1;
        break;
    }

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    const isBefore = position === 'before';
    this.ui.addGuideItemAndUpdate(guideIndex, isBefore);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  public removeStep(removeIdx?: number) {
    const removed = this.store.removeStep(removeIdx);
    removed && this.ui.update(this.store);
    return removed;
  }

  public download(title?: string, json?: any) {
    title = title ? title : this.store.mainTitle;
    json = json ? json : this.store.core.json;
    Util.file.download(title, json);
  }

  showPreview(idx: number) {
    this.ui.stepcode.show(idx);
  }

  toPrevPreview() {
    this.ui.stepcode.prev();
  }

  toNextPreview() {
    this.ui.stepcode.next();
  }

  public show(idx: number) {
    this.store.atStep(idx);
    this.ui.update(this.store);
  }

  public toPrev() {
    this.store.toPrevStep();
    this.ui.update(this.store);
  }

  public toNext() {
    this.store.toNextStep();
    this.ui.update(this.store);
  }

  public showEditor(idx: number) {
    this.store.atStep(idx);
    this.ui.updateEditor(this.store);
  }

  public toPrevEditor() {
    this.store.toPrevStep();
    this.ui.updateEditor(this.store);
  }

  public toNextEditor() {
    this.store.toNextStep();
    this.ui.updateEditor(this.store);
  }

  public selectGuide(idx: number) {
    this.ui.resetGuideItemClassAll();
    this.ui.modifyGuideItemToSelected(idx);
  }

  public moveStep(fromIdx: number, toIdx: number) {
    this.store.moveStep(fromIdx, toIdx);
    this.ui.update(this.store);
  }

  /**
   * Editorの内容をPreviewに反映する。
   */
  private syncStoreToPreview() {
    // StepCodeを更新
    this.ui.updateStepCode(this.store);
  }

  /**
   * [[StepCode]]の内容をEditorに反映する
   * @param stepcode
   */
  private syncPreviewToEditor() {
    // StepCodeの現在位置をCoreに反映

    const idx = this.ui.stepcode.currentIdx;
    this.store.atStep(idx);

    // UIを更新
    this.ui.updateEditor(this.store);
    this.ui.updateGuide(this.store);
  }

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
    this.preview({ title });
  }
  private onBlurTitle(_: Event) {
    this.syncStoreToPreview();
  }
  private onInputFile(e: Event) {
    const file = Util.dom.get.value(e.target);
    this.preview({ file });
  }
  private onBlurFile(_: Event) {
    this.syncStoreToPreview();
  }
  private onChangeLang(e: Event) {
    const lang = Util.dom.get.value(e.target);
    this.preview({ lang });
  }
  private onBlurLang(_: Event) {
    this.syncStoreToPreview();
  }

  /**
   * コードの内容が変更された時
   */
  private onChangeAce() {
    const code = this.ui.ace.getValue();
    this.preview({ code });
    this.syncScrollTopEditorToPreview();
  }

  private onBlurAce(_: Event) {
    this.syncStoreToPreview();
  }

  private onInputMarkdown(e: Event) {
    // work.descとプレビューを更新
    const desc = Util.dom.get.value(e.target);
    this.store.updateCurrent({ desc });
    this.ui.stepcode.preview(this.store.getCurrentStep());
  }
  private onBlurMarkdown(_: Event) {
    this.syncStoreToPreview();
  }

  private onClickAddStepToLast(_: Event) {
    this.addStep('last');
  }

  public onClickAddStepBefore(_: Event) {
    this.addStep('before');
  }

  public onClickAddStepAfter(_: Event) {
    this.addStep('after');
  }

  public onClickDelStep() {
    if (!this.store.hasRemovableleSteps) {
      alert('削除できるステップがありません。');
      return;
    }

    if (!confirm(`Step${this.store.current.no}を削除します。`)) {
      return;
    }

    this.removeStep();
  }

  private onClickReset(e: Event) {
    if (!confirm('内容を全てリセットします、よろしいですか？')) return;
    this.reset();
  }

  private onClickDownload() {
    this.download();
  }

  /**
   * ファイルが選択された時の処理
   */
  private onChangeFile(e: Event) {
    Util.file.read(e, (file: any) => {
      this.load(JSON.parse(file));
    });
  }

  /**
   * ステップコードのページが変更された時の処理
   * @param stepcode ステップコード
   */
  private onChangeStepCode(_: StepCode.default) {
    this.syncPreviewToEditor();
  }

  /**
   * ガイドアイテムがクリックされた時の処理
   */
  private onClickGuideItem(idx: number) {
    // クリックされたガイドアイテムに対応するページへジャンプする
    this.show(idx);
  }

  /**
   * ドラッグ中のアイテムが重なった時の処理
   */
  private onDragEnterGuideItem(idx: number) {
    this.showPreview(idx);
  }

  /**
   * ドラッグ開始時の処理
   */
  private onDragStartGuideItem(idx: number) {
    this.showEditor(idx);
    this.selectGuide(idx);
  }

  /**
   * ステップがドロップされた時の処理
   */
  public onDropGuideItem(dragIdx: number, dropIdx: number) {
    // ドロップされた場所にドラッグされたステップを入れる
    this.moveStep(dragIdx, dropIdx);
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
          this.addStep('before');
          break;
        case KeyCode.Num9:
          this.addStep('after');
          break;
        case KeyCode.Num0:
          this.addStep('last');
          break;
      }
    }

    if (ev.ctrlKey && ev.shiftKey) {
      switch (ev.keyCode) {
        case KeyCode.ArrowLeft:
          this.toPrev();
          break;
        case KeyCode.ArrowRight:
          this.toNext();
          break;
      }
    }
  }
}
