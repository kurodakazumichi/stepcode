/**
 * import
 */
//import Sample01 from './datas/sample01';
import Sample02 from '../datas/sample02';

import StepCode from 'stepcode';
import 'stepcode/styles/style.scss';
import '../styles/index.scss';
//new StepCode("#container", convert(Sample01));
const stepcode = new StepCode(".stepcode__container", Sample02);
(window as any).e = stepcode;

const fileButton = document.getElementById('stepcode__file');

if (fileButton) {
  fileButton.addEventListener('change', (e:Event) => {
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
      //result && onloadCallback(result);
      stepcode.load(JSON.parse(result));
      (e.target as HTMLInputElement).value = "";
    }
  })
}
