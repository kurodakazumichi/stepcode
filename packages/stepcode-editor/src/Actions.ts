import * as Util from '@puyan/stepcode-util';
import Store from './Store';
import * as UI from './UI';
import * as Config from './Config';
import * as StepCode from 'stepcode';

enum KeyCode {
  ArrowLeft = 37,
  ArrowRight = 39,
  B = 66,
  N = 78,
  M = 77,
  Meta = 91,
  Num6 = 54,
  Num7 = 55,
  Num8 = 56,
  Num9 = 57,
  Num0 = 48
}

export default class Actions {
  constructor(store: Store, ui: UI.default) {
    this.store = store;
    this.ui = ui;
    this.attach();
  }

  /**
   * TODO
   * ステップを末尾に追加する
   */
  public addStepLast() {
    const addedIdx = this.store.addStepToLast();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  /**
   * TODO
   * ステップを前に追加する
   */
  public addStepBefore() {
    const addedIdx = this.store.addStepBefore();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  /**
   * TODO
   * ステップを後ろに追加する
   */
  public addStepAfter() {
    const addedIdx = this.store.addStepAfter();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  /**
   * 指定した[[Step]]を削除する
   * @param delIndex 削除するステップの位置
   */
  public deleteStep(delIndex: number) {
    this.store.removeStep(delIndex);
    this.ui.update(this.store);
    return true;
  }

  /**
   * 指定したIndexにジャンプする
   * @param idx 異動先のIndex
   */
  public jump(idx: number) {
    this.ui.stepcode.jump(idx);
  }

  /** 前のステップへ移動 */
  public prev() {
    this.jump(Math.max(0, this.store.current.idx - 1));
  }

  /**
   * 次のステップへ移動 */
  public next() {
    this.jump(Math.min(this.store.last.idx, this.store.current.idx + 1));
  }

  private store: Store;
  private ui: UI.default;

  private attach() {
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
    // work.title、プレビューを更新
    const title = Util.dom.get.value(e.target);
    this.store.updateWork({ title });
    this.ui.stepcode.preview(this.store.getWork());
  }
  private onBlurTitle(_: Event) {
    this.syncEditorToPreview();
  }
  private onInputFile(e: Event) {
    const file = Util.dom.get.value(e.target);
    this.store.updateWork({ file });
    this.ui.stepcode.preview(this.store.getWork());
  }
  private onBlurFile(_: Event) {
    this.syncEditorToPreview();
  }
  /**
   * 言語の内容が変更された時
   * @param e イベントオブジェクト
   */
  private onChangeLang(e: Event) {
    // work.lang、プレビューを更新
    const lang = Util.dom.get.value(e.target);
    this.store.updateWork({ lang });
    this.ui.stepcode.preview(this.store.getWork());
  }
  private onBlurLang(_: Event) {
    this.syncEditorToPreview();
  }

  /**
   * コードの内容が変更された時
   */
  private onChangeAce() {
    // work.code、プレビューを更新
    const code = this.ui.ace.getValue();
    this.store.updateWork({ code });
    this.ui.stepcode.preview(this.store.getWork());
    this.ui.stepcode.setEditorScrollTop(
      this.ui.ace.getSession().getScrollTop()
    );
  }

  private onBlurAce(_: Event) {
    this.syncEditorToPreview();
  }

  private onInputMarkdown(e: Event) {
    // work.descとプレビューを更新
    const desc = Util.dom.get.value(e.target);
    this.store.updateWork({ desc });
    this.ui.stepcode.preview(this.store.getWork());
  }
  private onBlurMarkdown(_: Event) {
    this.syncEditorToPreview();
  }

  private onClickAddStepToLast(_: Event) {
    const addedIdx = this.store.addStepToLast();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  public onClickAddStepBefore(_: Event) {
    const addedIdx = this.store.addStepBefore();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  public onClickAddStepAfter(_: Event) {
    const addedIdx = this.store.addStepAfter();

    // 追加されたステップとエディターに表示されている内容は一致するはずなので
    // エディター以外のUIを更新する。
    this.ui.addGuideItemAndUpdate(addedIdx, false);
    this.ui.updateStepCode(this.store);
    this.ui.footerInfo = this.store.current.no;
  }

  public onClickDelStep() {
    if (!this.store.hasRemovableleSteps) {
      alert('このステップは削除できません。');
      return;
    }

    if (!confirm(`Step${this.store.current.no}を削除します。`)) {
      return;
    }

    this.store.removeStep();
    this.ui.update(this.store);
  }

  private onClickReset(e: Event) {
    if (!confirm('内容を全てリセットします、よろしいですか？')) return;
    this.reset();
  }

  /**
   * ダウンロードがクリックされた時の処理
   */
  private onClickDownload() {
    Util.file.download(this.store.mainTitle, this.store.core.json);
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
  private onChangeStepCode(stepcode: StepCode.default) {
    this.reflectStepCodeToEditor(stepcode);
  }

  /**
   * [[StepCode]]の内容をEditorに反映する
   * @param stepcode
   */
  private reflectStepCodeToEditor(stepcode: StepCode.default) {
    // StepCodeの現在位置をCoreに反映

    const idx = stepcode.currentIdx;
    this.store.atStep(idx);

    // UIを更新
    this.ui.updateEditor(this.store);
    this.ui.updateGuide(this.store);
  }

  /**
   * ガイドアイテムがクリックされた時の処理
   */
  private onClickGuideItem(idx: number) {
    // クリックされたガイドアイテムに対応するページへジャンプする
    this.jump(idx);
  }

  /**
   * ドラッグ中のアイテムが重なった時の処理
   */
  private onDragEnterGuideItem(idx: number) {
    /**
     * StepCodeの方だけページを切り替える。
     * Editorの方はドラッグ中の内容を表示させたいので
     */
    this.ui.stepcode.show(idx + 1);
  }

  /**
   * ドラッグ開始時の処理
   */
  private onDragStartGuideItem(idx: number) {
    /**
     * Editorにはドラッグ開始したガイドアイテムのページ内容を表示する
     * StepCodeの内容はDragEnterの方で制御するのでここでは何もしない。
     */
    this.store.atStep(idx);
    this.ui.updateEditor(this.store);

    // ドラッグ開始したガイドアイテムを選択状態にする。
    this.ui.resetGuideItemClassAll();
    this.ui.modifyGuideItemToSelected(idx);
  }

  /**
   * ステップがドロップされた時の処理
   */
  public onDropGuideItem(dragIdx: number, dropIdx: number) {
    // ドロップされた場所にドラッグされたステップを入れる
    this.store.moveStep(dragIdx, dropIdx);
    this.ui.update(this.store);
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
          this.store.syncWorkToCore();
          this.addStepBefore();
          break;
        case KeyCode.Num9:
          this.store.syncWorkToCore();
          this.addStepAfter();
          break;
        case KeyCode.Num0:
          this.store.syncWorkToCore();
          this.addStepLast();
          break;
      }
    }

    if (ev.ctrlKey && ev.shiftKey) {
      switch (ev.keyCode) {
        case KeyCode.ArrowLeft:
          this.store.syncWorkToCore();
          this.prev();
          break;
        case KeyCode.ArrowRight:
          this.store.syncWorkToCore();
          this.next();
          break;
      }
    }
  }

  public reset() {
    this.load(Config.INIT_DATA);
  }

  /**
   * データをロードする。
   * @param data StepCodeのデータ
   */
  public load(data: any) {
    this.store.load(data);
    this.ui.update(this.store);
  }

  /**
   * Editorの内容をPreviewに反映する。
   */
  private syncEditorToPreview() {
    // 入力されている内容(Work)をCoreに同期する
    this.store.syncWorkToCore();

    // StepCodeを更新
    this.ui.updateStepCode(this.store);
  }
}
