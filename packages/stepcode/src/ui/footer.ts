/******************************************************************************
 * import
 *****************************************************************************/
import * as Config from './config';

/******************************************************************************
 * Enum
 *****************************************************************************/
/** 設定可能なイベントの種類 */
export enum EventType {
  /** 前に戻るイベント */
  Prev,
  /** 次へ進むイベント */
  Next,
  /** ページジャンプイベント */
  Jump,
}

/******************************************************************************
 * Footer
 *****************************************************************************/
export default class Footer 
{
  /**
   * コンストラクタ
   */
  constructor() 
  {
    // Footerの要素を生成
    this.root     = Config.createElement(Config.UIType.Footer);
    this.logo     = Config.createElement(Config.UIType.FooterLogo);
    this.buttons  = new Buttons();
    this.pager    = new Pager();
    this.progress = new Progress();

    // 階層構造を構築
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

  /** 
   * 更新 
   */
  public update(data:{currentNo:number, totalNo:number}) 
  {
    this.buttons.update(data.currentNo, data.totalNo);
    this.pager.update(data.currentNo, data.totalNo);
    this.progress.update(data.currentNo, data.totalNo);
  }

  /**
   * Footerのイベント処理を設定する
   * @param events イベント処理が格納されたオブジェクト
   */
  public setEvent(type:EventType, func:Function){
    switch(type) {
      case EventType.Prev: this.buttons.setEvent('prev', func); break;
      case EventType.Next: this.buttons.setEvent('next', func); break;
      case EventType.Jump: this.progress.setEvent(func); break;
    }
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** ボタン要素 */
  private buttons:Buttons;

  /** ページャー */
  private pager:Pager;

  /** 進捗バー */
  private progress:Progress;

  /** ロゴ */
  private logo:HTMLElement;

  //---------------------------------------------------------------------------
  // private メソッド

  /** 
   * 親子関係の構築 
   */
  private build() {    
    this.root.appendChild(this.buttons.node);
    this.root.appendChild(this.pager.node);
    this.root.appendChild(this.progress.node);
    this.root.appendChild(this.logo);
  }
}

/******************************************************************************
 * Buttons
 *****************************************************************************/
class Buttons 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.events = {prev:() => {}, next:() => {}};
    this.root = Config.createElement(Config.UIType.Buttons);
    this.prev = Config.createElement(Config.UIType.ButtonsPrev);
    this.next = Config.createElement(Config.UIType.ButtonsNext);

    this.prev.addEventListener('click', this.onClickPrev.bind(this));
    this.next.addEventListener('click', this.onClickNext.bind(this));

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
  public update(current:number, total:number) {
    
    this.enable(this.prev);
    this.enable(this.next);

    (current === 1) && this.disable(this.prev);
    (current === total) && this.disable(this.next);

  }

  /**
   * 指定されたボタンを有効にする
   * @param button ボタン要素
   */
  private enable(button:HTMLElement) {
    button.classList.remove(Config.classNames.buttonsItemDisable);
  }

  /**
   * 指定されたボタンを無効にする
   * @param button ボタン要素
   */
  private disable(button:HTMLElement) {
    button.classList.add(Config.classNames.buttonsItemDisable);
  }

  /**
   * ボタンに割り当てるイベントを設定する
   * @param events イベントを格納したオブジェクト
   */
  public setEvent(type:'prev'|'next', func:Function) {
    this.events[type] = func;
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** 戻るボタン */
  private prev:HTMLElement;

  /** 次へボタン */
  private next:HTMLElement;

  /** イベント処理を格納したオブジェクト */
  private events:{
    prev: Function,
    next: Function
  };

  //---------------------------------------------------------------------------
  // private メソッド

  /** 
   * 親子関係の構築 
   */
  private build() {    
    this.root.appendChild(this.prev);
    this.root.appendChild(this.next);
  }

  /**
   * 戻るが押された時の処理
   */
  private onClickPrev(e:Event) 
  {
    // ボタンが有効なら戻る処理を実行
    if(this.isEnable(e.target)) {
      this.events.prev();
    } 
  }

  /**
   * 次へが押された時の処理
   */
  private onClickNext(e:Event) {
    // ボタンが有効なら次への処理を実行
    if (this.isEnable(e.target)) {
      this.events.next();
    }
  }

  /**
   * ボタンが有効になっているかを調べる
   * @param maybeButton 多分ボタン要素
   */
  private isEnable(maybeButton:any) 
  {
    // 対象が存在しない、HTML要素ではない場合は終了
    if (!maybeButton || !(maybeButton instanceof HTMLElement)) 
      return;

    // ボタンが有効か調べる
    const button = maybeButton as HTMLElement;
    return !button.classList.contains(Config.classNames.buttonsItemDisable);
  }

}

/******************************************************************************
 * Pager
 *****************************************************************************/
class Pager 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root      = Config.createElement(Config.UIType.Pager);
    this.current   = Config.createElement(Config.UIType.PagerCurrent);
    this.total     = Config.createElement(Config.UIType.PagerTotal);
    this.sepalater = Config.createElement(Config.UIType.PagerSepalater);
    this.build();
  }

  //---------------------------------------------------------------------------
  // public アクセッサ

  /** root nodeを取得する */
  public get node() {
    return this.root;
  }

  /** 現在ページ番号を設定する */
  public set currentNo(num:number) {
    this.current.innerHTML = num.toString();
  }

  /** 最大ページ番号を設定する */
  public set totalNo(num:number) {
    this.total.innerHTML = num.toString();
  }

  //---------------------------------------------------------------------------
  // public メソッド

  /** 更新 */
  public update(current:number, total:number) {
    this.currentNo = current;
    this.totalNo   = total;
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** 現在ページ数 */
  private current:HTMLElement;

  /** 合計ページ数 */
  private total:HTMLElement;

  /** 区切り */
  private sepalater:HTMLElement;

  //---------------------------------------------------------------------------
  // private メソッド

  /** 
   * 親子関係の構築 
   */
  private build() {    
    this.root.appendChild(this.current);
    this.root.appendChild(this.sepalater);
    this.root.appendChild(this.total);
  }

}

/******************************************************************************
 * Progress
 *****************************************************************************/
class Progress 
{
  /**
   * コンストラクタ
   */
  constructor() {
    this.root  = Config.createElement(Config.UIType.Progress);
    this.items = [];
    this.clickCallback = () => {};
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
  public update(current:number, total:number) {
    this.adjustItems(total);
    this.fill(current);
  }

  /**
   * 進捗バーがクリックされた時の処理を設定する。
   * @param func コールバック関数
   */
  public setEvent(func:Function) {
   this.clickCallback = func; 
  }

  //---------------------------------------------------------------------------
  // private メンバ

  /** root要素 */
  private root:HTMLElement;

  /** 進捗要素 */
  private items:HTMLElement[];

  /** 進捗バーのアイテムがクリックされた際のコールバック */
  private clickCallback: Function;

  //---------------------------------------------------------------------------
  // private メソッド

  /**
   * アイテムの数が最大ページ数分になるように調整する。
   * @param total 最大ページ数
   */
  private adjustItems(total:number) {

    // 現在のアイテム数と合計のアイテム数が一致していれば何もしない。
    if (this.items.length === total) return;

    // 一旦アイテムを全て削除する
    for(let i = 0; i < this.items.length; ++i) {
      this.items[i].remove();
    }
    this.items = [];

    // 必要な数だけ進捗アイテムを生成する
    // 各アイテムには割り当たっているページのIndexをdatasetに持たせておく。
    for(let i = 0; i < total; ++i) 
    {
      // ページ数の数だけ進捗アイテムを生成する
      const item = Config.createElement(Config.UIType.ProgressItem);
      item.addEventListener('click', this.onClickItem.bind(this));
      item.dataset.idx = i.toString();
      item.style.width = (100/total) + '%';
      this.root.appendChild(item);
      this.items.push(item);
    }

  }

  /**
   * 指定された個数だけ進捗要素を塗る(css classを付与する)
   * @param num 塗る要素の数
   */
  private fill(num:number) {
    // 全アイテムを処理する
    for(let i = 0; i < this.items.length; ++i) {
      // 塗り対象は明るく、そうでないものは暗くする
      const item = this.items[i];
      (i < num)? this.active(item) : this.inactive(item);
    }
  }

  /**
   * 指定された進捗要素をアクティブにする(ハイライトされる)
   * @param item 進捗要素
   */
  private active(item:HTMLElement) {
    item.classList.add(Config.classNames.progressItemActive);
  }

  /**
   * 指定された進捗要素を非アクティブにする(ハイライトが解除される)
   * @param item 進捗要素
   */
  private inactive(item:HTMLElement) {
    item.classList.remove(Config.classNames.progressItemActive);
  }

  /**
   * 進捗バーの要素がクリックされた時のイベント
   * @param e イベントオブジェクト
   */
  private onClickItem(e:Event) {
    if (e.target) {
      this.clickCallback((e.target as HTMLElement).dataset.idx);  
    }
  }
}