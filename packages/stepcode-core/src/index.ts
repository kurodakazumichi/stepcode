/**
 * stepcode-coreのエントリーポイント
 */
import { default as StepCode, calcDiffs } from './StepCode';

/**
 * 詳細は[[StepCode]] classをみてください。
 */
export default StepCode;

/**
 * 詳細は[[Step]] classをみてください。
 */
export { default as Step } from './Step';

const Util = {
  calcDiffs
};

export { Util };
