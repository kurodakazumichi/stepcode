/******************************************************************************
 * import
 *****************************************************************************/
import hljs from 'highlight.js';
import * as Config from './config';
import { Step } from 'stepcode-core';
import EscapeHtml from 'escape-html';

/******************************************************************************
 * Editor
 *****************************************************************************/
export default class Editor 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.Editor);
    this.lines = new Lines();
    this.codes = new Codes();
    this.build();
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** root nodeを取得する */
  public get node() {
    return this.root;
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(data:{step:Step, diffs:number[]}) {

    const {step, diffs} = data;

    // 行番号の更新
    this.lines.update(step.codeLineNum, diffs);

    // コードの更新
    this.codes.update(step.lang, step.code);
    
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** 行番号要素 */
  private lines:Lines;

  /** ソースコード要素 */
  private codes:Codes;

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * DOMを構築する(親子関係の生成)
   */
  private build() {
    this.root.appendChild(this.lines.node as Node);
    this.root.appendChild(this.codes.node as Node);
  }
}

/******************************************************************************
 * Lines
 *****************************************************************************/
class Lines 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root = Config.createElement(Config.UIType.EditorLines);
    this.items = [];
  }

  //---------------------------------------------------------------------------
  // public アクセッサ
  public get node() {
    return this.root;
  }

  //---------------------------------------------------------------------------
  // public メンバ

  /**
   * 行を更新する
   * @param lineCount 行数
   * @param diffs 差分行リスト
   */
  public update(lineCount:number, diffs:number[]) {
    this.adjustItem(lineCount);
    this.markingItem(diffs);
  }



  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root :HTMLElement;

  /** 行リスト */
  private items:HTMLElement[];

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * アイテム(行要素)を生成する。
   * @param startNo 開始行番号
   * @param count      作成する行数
   */
  createItem(startNo:number, count:number) 
  {
    for(let i = startNo; i < startNo + count; ++i) {
      // 行要素を生成し、行数を設定
      const item = Config.createElement(Config.UIType.EditorLinesItem);
      item.innerHTML = (i).toString();

      // 親要素、およびアイテムリストに登録
      this.root.appendChild(item);
      this.items.push(item);
    }
  }

  /**
   * アイテム(行要素)の末尾から指定した数だけ削除する
   * @param count 削除したい行の数
   */
  popItem(count:number) {
    for(let i = 0; i < count; ++i) {
      const item = this.items.pop() as HTMLElement;
      item.remove();
    }
  }

  /**
   * アイテム数が指定された数量になるように調整する
   * @param wantCount 求める行数
   */
  private adjustItem(wantCount:number) 
  {
    // 現在のリアルな数量
    const realCount = this.items.length;

    // リアルな数と求める数が同じであれば何もしない
    if (realCount === wantCount) return;

    // 差分を計算
    const sub = wantCount - realCount;

    // 差分が正の数の場合、求める量の方が多いので足りない分を作る
    if (0 < sub) {
      this.createItem(realCount + 1, sub);
    }

    // 差分が負の数の場合、現状は多すぎるので多い分を削除する
    if (sub < 0) {
      this.popItem(Math.abs(sub));
    }
  }

  /**
   * 指定された行をマーキングする
   * @param diffs 変更行のリスト
   */
  private markingItem(diffs:number[]) 
  {
    // 行マークを解除する  
    this.items.map((item) => {
      this.unmarked(item);
    });

    // 必要な行だけマークする
    diffs.map((index) => {
      const item = this.items[index - 1];
      item && this.marked(item);
    });
  }

  /**
   * 指定された行をマークする
   * @param item 行要素
   */
  private marked(item:HTMLElement) {
    item.classList.add(Config.classNames.editorLinesItemMark);
  }

  /**
   * 指定された行のマークを解除する
   * @param item 行要素
   */
  private unmarked(item:HTMLElement) {
    item.classList.remove(Config.classNames.editorLinesItemMark);
  }
}

/******************************************************************************
 * Code
 *****************************************************************************/
class Codes 
{
  /**
   * コンストラクタ
   */
  constructor() 
  {
    // 全体を包むrootとpre、codeタグを生成
    this.root = Config.createElement(Config.UIType.EditorCodes);
    this.pre  = Config.createElement(Config.UIType.EditorCodesPre);
    this.code = Config.createElement(Config.UIType.EditorCodesPreCode);

    // 親子関係の構築
    this.build();
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** rootノードのアクセッサ */
  public get node() {
    return this.root;
  }

  /** 言語を設定する */
  public set lang(lang:string) {
    this.code.className = (hljs.getLanguage(lang))? lang : "";
  }

  /** ソースコードを設定する */
  public set codetext(codetext:string) {
    this.code.innerHTML = EscapeHtml(codetext);
    hljs.highlightBlock(this.code as hljs.Node);
  }

  /** コードを設定する */
  public get codeNode() {
    return this.code;
  }

  //---------------------------------------------------------------------------
  // public メソッド
  
  /** 更新 */
  public update(lang:string, code:string) {
    this.lang     = lang;
    this.codetext = code;
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root */
  private root: HTMLElement;

  /** preタグ要素 */
  private pre : HTMLElement;

  /** codeタグ要素 */
  private code: HTMLElement;

  //---------------------------------------------------------------------------
  // privateメソッド

  /**
   * DOMを構築する(親子関係の生成)
   */
  private build() {
    // root > pre > codeとなるように構築
    this.root.appendChild(this.pre);
    this.pre.appendChild(this.code);
  }
}

