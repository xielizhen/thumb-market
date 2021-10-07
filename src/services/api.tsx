import axiosInstance from "./base";

export const sendCode = (value: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(124)
    }, 2000)
  })
}


interface ICreateAccountParams {
  email: string,
  password: string, 
  code: string,
}
export const sendThumbAccount = (params: ICreateAccountParams) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success')
    }, 2000);
  })
}
export interface IAccountRes {
  email: string,
  isRegister: boolean
}

export const getThumbAccount = async (account: string): Promise<IAccountRes> => {
  const res = await axiosInstance({
    method: 'post',
    url: '/register/query',
    data: {
     openid: account
    }
  });
  return res.data
}