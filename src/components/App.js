import React, { Component } from 'react'
import { unselectable } from '@rover/react-bootstrap'

import MainNav from './MainNav'
import AppQueryRenderer from './AppQueryRenderer'

class App extends Component {
    constructor() {
        super()
        this.state = {
            name: ''
        }
        this.getToken = this.getToken.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    componentWillMount() {
        const storageKey = 'ember_simple_auth:session'
        const user = JSON.parse(localStorage.getItem('ajs_user_traits'))

        window.addEventListener('storage', (event) => {
            if (event.key === storageKey && !this.getToken()) {
                 window.location.replace('/auth/sign-in')
            }
        })

        if (this.getToken() && user) {
            this.setState({
                name: user.name
            })
        } else {
            window.location.replace('/auth/sign-in')
        }
    }

    getToken() {
        const session = JSON.parse(
            localStorage.getItem('ember_simple_auth:session')
        )
        return session ? session.authenticated.token : null
    }

    handleSignOut() {
        localStorage.removeItem('ember_simple_auth:session')
        if (!this.getToken()) {
             window.location.replace('/auth/sign-in')
        }
    }

    render() {
        return (
            <div
                style={{
                    ...unselectable,
                    height: '100%',
                    widht: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <MainNav
                    name={this.state.name}
                    isGimbalEnabled={false}
                    isXenioEnabled={false}
                    onRequestSignOut={() => this.handleSignOut()}
                />
                <AppQueryRenderer />
            </div>
        )
    }
}

export default App
