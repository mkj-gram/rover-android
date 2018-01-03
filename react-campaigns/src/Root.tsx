import * as React from 'react'
import { Provider } from 'react-redux'
import {
  HashRouter as Router,
  Route,
  Link } from 'react-router-dom'
import { Store } from 'redux'

import configureStore from './configureStore'
import { match as Match } from 'react-router';

const store = configureStore()

type param = {
  campaignType?: string;
  campaignStatus?: string;
  pageNumber?: number;
  keyword?: string;
}

type reportParam = {
  campaignId: string
}

const list = ({ match }: { match: Match<param> } ) => (
  <div>
    List Page
    {` campaign status: ${match.params.campaignStatus || 'null'}`}
    {` campaign type: ${match.params.campaignType || 'null'}`}
    {` pageNumber: ${match.params.pageNumber || 'null'}`}
    {` keyword: ${match.params.keyword || ''}`}
  </div>
)

const report = ({ match }: { match: Match<reportParam> }) => (
  <div>report campaign id: {match.params.campaignId || ''}</div>
)
const settings = ({ match }: { match: Match<param> }) => (
  <div>
    Settings
    {` campaign status: ${match.params.campaignStatus || 'null'}`}
    {` campaign type: ${match.params.campaignType || 'null'}`}
    {` pageNumber: ${match.params.pageNumber || 'null'}`}
    {` keyword: ${match.params.keyword || ''}`}
  </div>
)

const wizard = ({ match }: { match: Match<param> }) => (
  <div>
    Wizard
    {` campaign status: ${match.params.campaignStatus || 'null'}`}
    {` campaign type: ${match.params.campaignType || 'null'}`}
    {` pageNumber: ${match.params.pageNumber || 'null'}`}
    {` keyword: ${match.params.keyword || ''}`}
  </div>
)

const Root: React.StatelessComponent<{}> = () => (
    <Provider store={store}>
      <Router>
        <div>
          <Route path="/list/:campaignType/:campaignStatus?/:pageNumber?/:keyword?" component={list} />
          <Route path="/report/:campaignId" component={report} />
          <Route path="/settings/:campaignType?/:campaignStatus?/:pageNumber?/:keyword?" component={settings} />
          <Route path="/wizard/:campaignType?/:campaignStatus?/:pageNumber?/:keyword?" component={wizard} />
        </div>
      </Router>
    </Provider>
)

export default Root
