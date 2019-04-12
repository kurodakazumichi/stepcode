/******************************************************************************
 * import
 *****************************************************************************/
import _ from 'lodash';
import * as Config from './config';

/******************************************************************************
 * Header
 *****************************************************************************/
export default class Header 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root     = Config.createElement(Config.UIType.Header);
    this.title    = Config.createElement(Config.UIType.HeaderTitle);
    this.filename = Config.createElement(Config.UIType.HeaderFileName);
    this.build();
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** Header Nodeのgetter */
  public get node() {
    return this.root;
  }

  /** タイトルテキストを設定する */
  public set titleText(title:string) {
    this.title && (this.title.innerHTML = title);
  }

  /** タイトルテキストを取得する */
  public get titleText() {
    return this.title.innerHTML;
  }

  /** ファイル名テキストを設定する */
  public set fileText(name:string) {

    if (name) {
      this.filename.innerHTML = name;
      this.filename.style.display = "block";
    } else {
      this.filename.style.display = "none";
    }
  }
  
  //---------------------------------------------------------------------------
  // public メンバ

  /** 更新 */
  public update(title:string, filename:string) {
    this.titleText = title;
    this.fileText = filename;
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** Header要素(root) */
  private root : HTMLElement;

  /** タイトル要素 */
  private title : HTMLElement;

  /** ファイル名要素 */
  private filename : HTMLElement;

  //---------------------------------------------------------------------------
  // private メソッド

  /** DOM構築する */
  private build() {
    this.root.appendChild(this.title);
    this.root.appendChild(this.filename);
  }

}