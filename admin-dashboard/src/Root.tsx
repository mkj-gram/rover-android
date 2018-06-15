import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './views/Login'

const Root: React.SFC = () => (
    <Router>
        <div style={{ height: '100%', width: '100%' }}>
            <Route path="/" component={Login} />
        </div>
    </Router>
)

export default Root
