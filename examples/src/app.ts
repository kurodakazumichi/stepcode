/**
 * import
 */
import Sample01 from './datas/sample01';

import StepCode from 'stepcode';
import 'stepcode/styles/style.scss';
/**
 * HTML文字をエスケープする
 * @param str 文字列
 */
function escapeHtml(str:string){
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#x27;');
  str = str.replace(/`/g, '&#x60;');
  return str;
}

/**
 * StepCodeデータの元をStepCodeのデータ形式に変換する
 * @param data StepCodeデータの元
 */
function convert(data:{title:string, contents:string[]}) {

  const { title, contents } = data;

  const step = [];
  for(let i = 0; i < contents.length; ++i) {
    step.push({
      code: escapeHtml(contents[i]),
      desc: escapeHtml(contents[++i])
    })
  }

  return {
    title,
    steps:step
  }
}

/**
 * StepCodeを実行
 */


new StepCode("#container", convert(Sample01));