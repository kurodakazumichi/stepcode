/******************************************************************************
 * import
 *****************************************************************************/
import Axios from 'axios';
import DefaultData from '../datas/AboutStepCode';
import StepCode from 'stepcode';
import Define from './define';

import 'stepcode/styles/style.scss';
import '../styles/index.scss';

/******************************************************************************
 * Util
 *****************************************************************************/
const Util = {
  async getContent(url: string) {
    const axios = Axios.create({
      baseURL: Define.baseURL + 'static/data/',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    });

    // データを取得
    const result = await axios.get(url + '.json');

    // 通信成功、かつデータがあればレスポンスデータを返す
    if (result.status === 200 && result.data) {
      return result.data;
    } else {
      return null;
    }
  },
  fileread(e: Event, callback: Function) {
    // targetがHTMLInputElementでなければ終了
    if (!e.target) return;
    if (!(e.target instanceof HTMLInputElement)) return;

    // ファイルがなければ終了
    if (!e.target.files) return;
    if (!e.target.files[0]) return;

    // FileReaderでFileを読み込む
    const file = e.target.files[0];
    const fr = new FileReader();
    fr.readAsText(file);

    // 読み込み後のコールバックを仕込む
    fr.onload = (ev: ProgressEvent) => {
      // targetがなければ終了
      if (!ev.target) return;

      // ev.target.resultは定義されてないと言われるので、anyにキャストして処理する
      const result = (ev.target as any).result;
      callback(JSON.parse(result));
      (e.target as HTMLInputElement).value = '';
    };
  }
};

/******************************************************************************
 * Index Appクラス
 *****************************************************************************/
class App {
  /**
   * コンストラクタ
   */
  constructor() {
    this.stepcode = new StepCode('.stepcode__container', {});

    // デバッグ用
    if (Define.isDevelop) {
      (window as any).app = this;
    }
  }

  /**
   * ステップコード
   */
  private stepcode: StepCode;

  /**
   * 初期化
   */
  public async init() {
    const data = await this.getInitData();
    this.stepcode.load(data);
    this.initFileButton();
    this.initContentLinks();
  }

  /**
   * 初期データを取得する
   * URLに指定があった場合は指定されたデータの取得を試みる
   * データが指定されていない、もしくは取得できなかった場合はデフォルトのデータを返す。
   */
  async getInitData() {
    // クエリパラメータから指定されたデータURLを抽出する
    const query = location.search.substring(1).split('&');
    const url = query
      .filter(value => value.indexOf('url') === 0)
      .map(value => {
        return value.split('=')[1];
      })[0];

    // URLがなければデフォルトデータ
    if (!url) return DefaultData;

    // URLがあればデータ取得を試みる
    if (url) {
      const data = await Util.getContent(url);
      if (data) {
        return data;
      }
    }

    // ここまで到達したらデフォルトデータを返す
    return DefaultData;
  }

  /**
   * ファイル読み込みボタンの初期化
   */
  initFileButton() {
    const fileButton = document.getElementById('stepcode__file');

    if (!fileButton) return;

    // ファイルが選択された場合、ファイルを読み込み、読み込んだデータをStepCodeにロードする
    fileButton.addEventListener('change', (e: Event) => {
      Util.fileread(e, (file: any) => {
        this.stepcode.load(file);
      });
    });
  }

  /**
   * コンテンツリンクの初期化
   */
  initContentLinks() {
    const contents = document.querySelectorAll('.content');

    // 全てのコンテンツリンクのonClickイベントを設定
    contents.forEach(content => {
      content.addEventListener('click', async (e: Event) => {
        const target = e.target as HTMLElement;
        const url = target.dataset.url;

        if (!url) return;

        const data = await Util.getContent(url);
        if (data) {
          this.stepcode.load(data);
          window.scrollTo(0, 0);
        } else {
          alert('データの取得に失敗しました。');
        }
      });
    });
  }
}

// ページ読み込みが完了したら実行する
window.addEventListener('load', () => {
  new App().init();
});
