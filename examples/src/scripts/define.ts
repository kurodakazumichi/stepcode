export const isDevelop = (process.env.NODE_ENV === "development");

interface IDefine {
  isDevelop:boolean;
  baseURL:string;
}
const dev:IDefine = {
  isDevelop:isDevelop,
  baseURL:"http://localhost:1234/"
}

const prod:IDefine = {
  isDevelop:isDevelop,
  baseURL:"https://kurodakazumichi.github.io/stepcode/"
}

export default (isDevelop)? dev : prod;