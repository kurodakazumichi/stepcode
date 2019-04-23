/******************************************************************************
 * import
 *****************************************************************************/
import { Step, Util } from '@puyan/stepcode-core';
import * as Config from './config';
import * as Define from '../define';
import * as Types from '../types';
import Lines from './lines';
import Codes from './codes';
import Markdown from './markdown';

/******************************************************************************
 * Editor
 *****************************************************************************/
export default class Editor implements Types.IUI {
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.Editor);
    this.lines = new Lines();
    this.codes = new Codes();
    this.markdown = new Markdown();
    this.build();
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root: HTMLElement;

  /** 行番号要素 */
  private lines: Lines;

  /** ソースコード要素 */
  private codes: Codes;

  private markdown: Markdown;

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** root nodeを取得する */
  public get node() {
    return this.root;
  }

  public get scrollTop() {
    return this.node.scrollTop;
  }
  public set scrollTop(v: number) {
    this.node.scrollTop = v;
  }
  public get scrollLeft() {
    return this.node.scrollLeft;
  }
  public set scrollLeft(v: number) {
    this.node.scrollLeft = v;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(data: { step: Step; prev: Step | null }) {
    const { step, prev } = data;

    if (step.lang === Define.SUPPORT_LANG_DRAWING) {
      this.setMode('markdown');
      this.markdown.update(step.code);
    } else {
      this.setMode('code');

      // 行番号の更新
      const diffs = Util.calcDiffs(prev, step);
      this.lines.update({ lineCount: step.codeLineNum, diffs });

      // コードの更新
      this.codes.update(step);
    }
  }

  /** コードを表示するか、マークダウンを表示するか */
  public setMode(mode: 'code' | 'markdown') {
    if (mode === 'code') {
      this.lines.show();
      this.codes.show();
      this.markdown.hide();
    } else {
      this.lines.hide();
      this.codes.hide();
      this.markdown.show();
    }
  }

  /** プレビュー */
  public preview(data: { step: Step; prev: Step | null }) {
    this.update(data);
  }

  public show() {
    this.node.style.display = 'block';
  }

  public hide() {
    this.node.style.display = 'none';
  }

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * DOMを構築する(親子関係の生成)
   */
  private build() {
    this.root.appendChild(this.lines.node as Node);
    this.root.appendChild(this.codes.node as Node);
    this.root.appendChild(this.markdown.node as Node);
  }
}
