// @flow

import React from 'react'
import { unselectable } from '@rover/react-bootstrap'

import MainNav from './MainNav'
import SideBar from './sidebar/Sidebar'
import AudienceTable from './table/AudienceTable'

const App = () => (
    <div style={{ ...unselectable, height: '100%', widht: '100%', display: 'flex', flexDirection: 'column' }}>
        <MainNav
            name="Alex Graham"
            isGimbalEnabled={false}
            isXenioEnabled={false}
            onRequestSignOut={() => null}
        />
        <div style={{ display: 'flex', flex: '1 1 100%' }}>
            <SideBar />
            <AudienceTable />
        </div>
    </div>
)

export default App
