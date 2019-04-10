import * as Util from '../../src/Util';

describe('Util', () => {

  it('Util.storage.clear', () => {
    Util.storage.clear()
    expect(sessionStorage.length).toBe(0);
  });

});