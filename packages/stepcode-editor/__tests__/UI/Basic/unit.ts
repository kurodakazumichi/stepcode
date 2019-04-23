/******************************************************************************
 * import
 *****************************************************************************/
import * as Dom from '../../__tools__/dom';
import * as UI from '../../../src/UI';
import StepCode from '@puyan/stepcode';

describe('UI::生成に関する検証', () => {
  describe(`selectorが指定された場合`, () => {
    Dom.init();
    const ui = new UI.default(Dom.AppSelectorString);

    it('Snapshot', () => {
      expect(ui).toMatchSnapshot();
    });
  });

  describe(`HTMLElementが指定された場合`, () => {
    Dom.init();
    const ui = new UI.default(Dom.appElement());

    it('Snapshot', () => {
      expect(ui).toMatchSnapshot();
    });
  });
});

describe('UI::公開プロパティの検証', () => {
  Dom.init();
  const ui = new UI.default(Dom.AppSelectorString);

  it('stepcodeがStepCodeのインスタンスであること', () => {
    expect(ui.stepcode).toBeInstanceOf(StepCode);
  });
});
