import axiosInstance from "./base";

export const sendCode = async (code: string) => {
  const res = await axiosInstance({
    method: 'post',
    url: '/register/sendcaptcha',
    data: {
      userName: code
    }
  })
  return res.data
}

interface ICreateAccountParams {
  openid: string,
  userName: string,
  passwd: string, 
  captcha: string,
}
export const sendThumbAccount = async (params: ICreateAccountParams) => {
  const res = await axiosInstance({
    method: 'post',
    url: '/register/register',
    data: params
  })
  return res.data
}
export interface IAccountRes {
  name: string,
  username: string,
  gold: number,
  isRegister: boolean,
}
export const getThumbAccount = async (account: string): Promise<IAccountRes> => {
  const res = await axiosInstance({
    method: 'post',
    url: '/register/query',
    data: {
      openid: account
    }
  })
  return res.data
}