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
    this.root = Config.createElement(Config.UIType.Header);
    this.title = Config.createElement(Config.UIType.HeaderTitle);
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
  
  //---------------------------------------------------------------------------
  // public メンバ

  /** 更新 */
  public update(title:string) {
    this.titleText = title;
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** Header要素(root) */
  private root : HTMLElement;

  /** タイトル要素 */
  private title : HTMLElement;

  //---------------------------------------------------------------------------
  // private メソッド

  /** DOM構築する */
  private build() {
    this.root.appendChild(this.title);
  }

}