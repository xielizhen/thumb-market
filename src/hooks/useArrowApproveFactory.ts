import { useWeb3React } from "@web3-react/core";
import { useSafeState } from "ahooks";
import { notification } from "antd";
import { MAX_UNIT_256 } from "config";
import { useEffect } from "react";
import { getBitBowFactoryAddress } from "utils/addressHelpers";
import { getArrowContract } from "utils/contractHelpers";
import useWeb3 from "./useWeb3"

const useFactoryApproveArrow = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()

  const [loading, setLoading] = useSafeState(false)
  const [isApproved, setIsApproved] = useSafeState(false)
  const [disabled, setDisabled] = useSafeState(true)

   // 获取授权金额
   const getIsApproved = async () => {
    if (!account) return
    try {
      setDisabled(true)
      const allownance = await getArrowContract()
        .methods
        .allowance(account, getBitBowFactoryAddress())
        .call()
      
      setIsApproved(+allownance > 1000)
    } finally {
      setDisabled(false)
    }
  }

  // 授权
  const handleApprove = async () => {
    const amount = web3.utils.toHex(MAX_UNIT_256.toString())
    try {
      setLoading(true)
      await getArrowContract(web3)
        .methods
        .approve(getBitBowFactoryAddress(), amount)
        .send({
          from: account
        })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      await getIsApproved()
    } catch (e: any) {
      notification.error({
        message: 'Error',
        description: e?.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getIsApproved()
  }, [account])

  return {
    loading,
    getIsApproved,
    handleApprove,
    disabled,
    isApproved,
    setLoading
  }
}

export default useFactoryApproveArrow