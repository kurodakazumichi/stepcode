/******************************************************************************
 * ストレージに関するUtil
 *****************************************************************************/
import Core, { Step } from '@puyan/stepcode-core';

/******************************************************************************
 * ストレージに保存する際のキー定義
 *****************************************************************************/
const PREFIX = 'StepCodeEditor__';
const SKEY_STEP = PREFIX + 'step__';
const SKEY_COUNT = PREFIX + 'count';

/******************************************************************************
 * 関数定義
 *****************************************************************************/
/**
 * Coreの内容をストレージに保存する
 */
function save(core: Core) {
  clear();

  saveCount(core.count);
  for (let i = 0; i < core.count; ++i) {
    const step = core.steps.get(i);
    step && saveStep(i, step);
  }
}

/**
 * ストレージの保存されているデータをロードする。
 */
function load() {
  const data = [];

  if (loadCount() === 0) return null;

  for (let i = 0; i < loadCount(); ++i) {
    const step = loadStep(i);
    step && data.push(step);
  }
  return { steps: data };
}

/**
 * ストレージをクリアする
 */
function clear() {
  const count = loadCount();
  for (let i = 0; i < count; ++i) {
    sessionStorage.removeItem(PREFIX + i);
  }
  sessionStorage.removeItem(SKEY_COUNT);
}

/**
 * Stepの内容をストレージに保存する
 */
function saveStep(index: number, step: Step | null) {
  if (!step) return;
  const key = SKEY_STEP + index;
  sessionStorage.setItem(key, JSON.stringify(step.toJSON()));
}

/**
 * ストレージの保存されているステップのデータを取得する
 */
function loadStep(index: number) {
  const key = SKEY_STEP + index;
  const step = sessionStorage.getItem(key);
  return step ? JSON.parse(step) : null;
}

/**
 * メタデータをストレージに保存する
 */
function saveCount(count: number) {
  sessionStorage.setItem(SKEY_COUNT, count.toString());
}

/**
 * ストレージの保存されているステップの数を取得する。
 */
function loadCount() {
  const count = sessionStorage.getItem(SKEY_COUNT);
  return count ? Number(count) : 0;
}

/******************************************************************************
 * export
 *****************************************************************************/
export default {
  save,
  load,
  clear,
  saveStep,
  loadStep,
  saveCount,
  loadCount
};
