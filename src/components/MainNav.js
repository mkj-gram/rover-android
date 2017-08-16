import React from 'react'
import PropTypes from 'prop-types'

import {
    AccountMenu,
    AppSwitcher,
    NavBar,
    subtleShadow
} from '@rover/react-bootstrap'

import { AudiencesIcon } from '@rover/react-icons'

const style = {
    ...subtleShadow,
    background: 'white',
    position: 'relative',
    left: {
        paddingLeft: 14
    },
    right: {
        paddingRight: 30
    }
}

const MainNav = ({
    name,
    isGimbalEnabled,
    isXenioEnabled,
    onRequestSignOut = () => null
}) =>
    (<NavBar style={style}>
        <AppSwitcher
            active={'audience'}
            isGimbalEnabled={false}
            isXenioEnabled={false}
        >
            <AudiencesIcon />
            Audience
        </AppSwitcher>

        <div />

        <AccountMenu onRequestSignOut={onRequestSignOut}>
            {name}
        </AccountMenu>
    </NavBar>)

MainNav.propTypes = {
    name: PropTypes.string.isRequired,
    isGimbalEnabled: PropTypes.bool.isRequired,
    isXenioEnabled: PropTypes.bool.isRequired,
    onRequestSignOut: PropTypes.func.isRequired
}

export default MainNav
