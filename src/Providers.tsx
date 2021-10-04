import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { RefreshContextProvider } from 'contexts/RefreshContext'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HelmetProvider>
        <RefreshContextProvider>
          {children}
        </RefreshContextProvider>
      </HelmetProvider>
    </Web3ReactProvider>
  )
}

export default Providers
