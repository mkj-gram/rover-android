import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import configureStore from './configureStore'
import Login from './views/Login'

const store = configureStore()

const Root: React.SFC = () => (
    <Provider store={store}>
        <Router>
            <div style={{ height: '100%', width: '100%' }}>
                <Route path="/login/" component={Login} />
            </div>
        </Router>
    </Provider>
)

export default Root
