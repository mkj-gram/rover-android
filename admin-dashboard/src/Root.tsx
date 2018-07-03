import firebase from 'firebase/app'
import 'firebase/auth'
import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { authenticate } from './actions'
import configureStore from './configureStore'
import Dashboard from './views/Dashboard'
import Login from './views/Login'

const store = configureStore()

const Root: React.SFC = () => {
    firebase.auth().onAuthStateChanged(user => {
        // tslint:disable-next-line:no-any
        store.dispatch<any>(authenticate(user))
    })
    return (
        <Provider store={store}>
            <Router>
                <div style={{ height: '100%', width: '100%' }}>
                    <Route exact={true} path="/" component={Dashboard} />
                    <Route path="/login" component={Login} />
                </div>
            </Router>
        </Provider>
    )
}
export default Root
