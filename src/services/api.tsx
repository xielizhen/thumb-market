import axiosInstance from "./base";


export const sendCode = (value: string) => {
  // TODO: sendCode API
  // 以下为mock代码，待删除
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
  // TODO: sendAccount API
  // 以下为mock代码，待删除
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('suce')
      resolve('success')
    }, 2000);
  })
}

// 以下为mock代码，待删除
// TIP: 如果数据结构更改了，需要到调用的地方更改返回值，thanks
export interface IAccountRes {
  email: string,
  auth: boolean
}
export const getThumbAccount = (account: string): Promise<IAccountRes> => {
  // TODO: getAccount API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: '432@163.com',
        auth: true
      })
    }, 0);
  })
}