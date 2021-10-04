const checkStrong = (sValue: string): {
  label: string,
  mode: number,
  color: string,
} => {
  console.log(sValue)
  let modes = 0;
  if (sValue.length < 1) return {
    label: '密码太弱',
    mode: 0,
    color: 'red',
  };
  if (/\d/.test(sValue)) modes++; //数字
  if (/[a-z]/.test(sValue)) modes++; //小写
  if (/[A-Z]/.test(sValue)) modes++; //大写  
  if (/\W/.test(sValue)) modes++; //特殊字符
  switch (modes) {
    case 1:
      return {
        label: '密码弱',
        mode: 1,
        color: 'red',
      }
    case 2:
      return {
        label: '密码中',
        mode: 2,
        color: 'orange',
      };
    case 3:
    case 4:
      return sValue.length < 12 ? {
        label: '密码强',
        mode: 3,
        color: 'blue'
      } : {
        label: '密码非常强',
        mode: 4,
        color: 'blue'
      }
  }
}

export {
  checkStrong
}