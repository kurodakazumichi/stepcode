export const isDevelop = (process.env.NODE_ENV === "development");

interface IDefine {
  isDevelop:boolean;
  baseURL:string;
}
const dev:IDefine = {
  isDevelop:isDevelop,
  baseURL:window.location.origin + "/"
}

const prod:IDefine = {
  isDevelop:isDevelop,
  baseURL:"https://www.nekonecode.com/stepcode/"
}

export default (isDevelop)? dev : prod;