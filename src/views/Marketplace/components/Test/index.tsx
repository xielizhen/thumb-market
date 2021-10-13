import { useWeb3React } from '@web3-react/core'
import { notification } from 'antd'
import useWeb3 from 'hooks/useWeb3'
import React, { useCallback } from 'react'

const Test: React.FC<{ updateAssets: (id: string) => void}> = ({ updateAssets }) => {

  const web3 = useWeb3()
  const { account } = useWeb3React();
  const handleClick = async (tokenId: string) => {
    try {
      // const res = await getStoreContract(web3).methods.buy(tokenId).send({
      //   from: account,
      //   gas: 500000
      // })

      notification.success({
        message: 'Buy Success'
      })

       // 从storelist列表删除
       updateAssets(tokenId)
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    }
  }

  return (
    <div onClick={() => handleClick('1')}>test</div>
  )
}

export default Test