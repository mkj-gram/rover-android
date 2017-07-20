import React from 'react'
import { unselectable } from '@rover/react-bootstrap'

import MainNav from './MainNav'
import AppQueryRenderer from './AppQueryRenderer'

const App = () =>
    (<div
        style={{
            ...unselectable,
            height: '100%',
            widht: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <MainNav
            name="Alex Graham"
            isGimbalEnabled={false}
            isXenioEnabled={false}
            onRequestSignOut={() => null}
        />
        <AppQueryRenderer />
    </div>)

export default App
