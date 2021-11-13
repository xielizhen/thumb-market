import React, { lazy } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import BigNumber from 'bignumber.js'
import Layout from 'components/Layouts'
import SuspenseWithChunkError from 'components/SuspenseWithChunkError'
import Loading from 'components/Loading'
import useEagerConnect from 'hooks/useEagerConnect'
import history from './routerHistory'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const AccountAssets = lazy(() => import('./views/Assets'))
const Inventory = lazy(() => import('./views/Inventory'))
const MysteryBox = lazy(() => import('./views/MysteryBox'))
const Dashboard = lazy(() => import('./views/Dashboard'))
const Marketplace = lazy(() => import('./views/Marketplace'))
const Deposit = lazy(() => import('./views/Deposit'))
const NotFound = lazy(() => import('./views/NotFound'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useEagerConnect()

  return (
    <Router history={history}>
      <Layout>
        <SuspenseWithChunkError fallback={<Loading />}>
          <Switch>
            <Route path="/market" exact>
              <Marketplace />
            </Route>
            <Route path="/account/assets" exact>
              <AccountAssets />
            </Route>
            <Route path="/account/inventory" exact>
              <Inventory />
            </Route>
            <Route path="/account/mystery" exact>
              <MysteryBox />
            </Route>
            <Route path="/account/deposit" exact>
              <Deposit />
            </Route>

            {/* redirects */}
            <Route path="/" exact>
              <Redirect to="/market" />
            </Route>
            <Route path="/account" exact>
              <Redirect to="/account/assets" />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Layout>
    </Router>
  )
}

export default React.memo(App)
