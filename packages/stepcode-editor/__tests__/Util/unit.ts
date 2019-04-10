import * as Util from '../../src/Util';

const dom = `<div id="app"></div>`;
describe('Util', () => {

  it('Util.storage.clear', () => {
    Util.storage.clear()
    expect(sessionStorage.length).toBe(0);
  });

  it('getElementById', () => {
    document.body.innerHTML = dom;
    expect(document.getElementById("app")).toBeInstanceOf(HTMLElement);
  })

});