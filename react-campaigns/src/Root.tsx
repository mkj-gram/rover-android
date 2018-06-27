/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Link
} from 'react-router-dom'
import { Store } from 'redux'

import configureStore from './configureStore'
import { match as Match } from 'react-router'

import ListPage from './views/home/ListPage'

const store = configureStore()

type param = {
    campaignType?: string
    campaignStatus?: string
    pageNumber?: number
    keyword?: string
}

type reportParam = {
    campaignId: string
}

const Root: React.StatelessComponent<{}> = () => (
    <Provider store={store}>
        <Router>
            <div style={{ height: '100%', width: '100%' }}>
                <Route path="/campaigns/" component={ListPage} />
            </div>
        </Router>
    </Provider>
)

export default Root
