/******************************************************************************
 * ファイル関連Util
 *****************************************************************************/

/******************************************************************************
 * 関数定義
 *****************************************************************************/

/**
 * <input type="file">によって選択されたファイルの内容を読み込む。
 * @param e ファイル選択時のイベントオブジェクト
 * @param onloadCallback ファイルのロード完了時のコールバック関数
 */
function read(e: Event, onloadCallback: (file: any) => void) {
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
    result && onloadCallback(result);

    // valueを破棄しておかないと、同じファイルを読み込んだ時にonchangeが発生しなくなる
    (e.target as HTMLInputElement).value = '';
  };
}

/**
 * JSONファイルをダウンロードさせます。
 * @param title ダウンロードされるファイル名
 * @param json ダウンロードさせるデータ
 */
function download(title: string, json: any) {
  // ダウンロード用のURLを生成します。
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // a要素を作成し、ファイルをダウンロードさせる。
  const a = document.createElement('a');
  a.href = url;
  a.download = title + '.stepcode.json';
  a.click();
  a.remove();
}

/******************************************************************************
 * export
 *****************************************************************************/
export default {
  read,
  download
};
