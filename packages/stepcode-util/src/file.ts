/******************************************************************************
 * ファイル関連
 *****************************************************************************/
export default {
  read (e:Event, onloadCallback:Function)
  {
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
    fr.onload = (ev:ProgressEvent) => {
  
      // targetがなければ終了
      if (!ev.target) return;
  
      // ev.target.resultは定義されてないと言われるので、anyにキャストして処理する
      const result = (ev.target as any).result;
      result && onloadCallback(result);
      (e.target as HTMLInputElement).value = "";
    }
  },
  download(title:string, json:any)
  {
    const blob = new Blob(
      [JSON.stringify(json)],
      {type:'application/json'}
    );
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = title + ".stepcode.json";
    a.click();
    a.remove();
  }
}

