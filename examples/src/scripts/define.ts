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
  baseURL:"http://127.0.0.1:8081/"
}

export default (isDevelop)? dev : prod;