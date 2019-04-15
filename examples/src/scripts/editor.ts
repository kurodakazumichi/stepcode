import StepCodeEditor from '@puyan/stepcode-editor';
import '@puyan/stepcode/styles/style.scss';
import '@puyan/stepcode-editor/styles/style.scss';
import '../styles/editor.scss';

/**
 * StepCodeEditorを初期化
 */
new StepCodeEditor(document.querySelector('.sce-root') as HTMLElement);
