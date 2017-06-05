import React from "react"

import {
    AccountMenu,
    AppSwitcher,
    NavBar,
    subtleShadow
} from "@rover/react-bootstrap"

import { CustomersIcon } from "@rover/react-icons"

const style = {
    ...subtleShadow,
    background: "white",
    position: "relative",
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
}) => (
    <NavBar style={style}>
        <AppSwitcher
            active={"audience"}
            isGimbalEnabled={false}
            isXenioEnabled={false}
        >
            <CustomersIcon size={32} />
            Audience
        </AppSwitcher>

        <div />

        <AccountMenu onRequestSignOut={onRequestSignOut}>{name}</AccountMenu>
    </NavBar>
)

export default MainNav
