import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector, 
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from 'utils/types'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import { notification } from 'antd'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork()
            if (hasSetup) {
              activate(connector)
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              notification.error({
                message: 'Provider Error',
                description: 'No provider was found',
                className: 'notification-error'
              })
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null
              }
              notification.error({
                message: 'Authorization Error', 
                description: 'Please authorize to access your account',
                className: 'notification-error'
              })
            } else {
              notification.error({
                message: error.name, 
                description: error.message,
                className: 'notification-error'
              })
            }
          }
        })
      } else {
        notification.error({
          message: 'Unable to find connector',
          description: 'The connector config is wrong',
          className: 'notification-error'
        })
      }
    },
    [activate],
  )

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName.walletconnect.close()
      connectorsByName.walletconnect.walletConnectProvider = null
    }
  }, [deactivate])

  return { login, logout }
}

export default useAuth
