import * as DomGetter from './dom/getter';
import * as DomSetter from './dom/setter';
import * as DomMaker  from './dom/maker';
import storage  from './storage';
import file from './file';

const dom = {
  get: DomGetter,
  set: DomSetter,
  make: DomMaker
}

export { dom };
export { storage };
export { file }

