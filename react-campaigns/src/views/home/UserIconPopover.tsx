/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    PopoverContainer,
    UserIcon,
    charcoal,
    Text,
    aquamarine,
    turquoise,
    ExternalLinkIcon,
    titanium,
    steel,
    white,
    cloud
} from '@rover/ts-bootstrap/dist/src'

import MobilePopover from '../wizards/components/MobilePopover'

import {
    updateActivePopover,
    fetchUser,
    closePopoverModalForm
} from '../../actions'

import {
    getActivePopover,
    getUser,
    getIsPopoverModalFormOpen
} from '../../reducers'

export interface Props {
    device: Media
}

export interface UserIconPopoverProps {
    activePopover: string
    user: User
    isPopoverModalFormOpen: string
}

export interface UserIconPopoverDispatchProps {
    updateActivePopover: (field: string) => void
    fetchUser: () => void
    closePopoverModalForm: () => void
}

export interface UserIconPopoverState {
    profileMouseEventDirection: 'up' | 'down'
    settingsMouseEventDirection: 'up' | 'down'
}

class UserIconPopover extends React.Component<
    UserIconPopoverProps & UserIconPopoverDispatchProps & Props,
    UserIconPopoverState
> {
    constructor(
        props: UserIconPopoverProps & UserIconPopoverDispatchProps & Props
    ) {
        super(props)
        this.state = {
            profileMouseEventDirection: 'up',
            settingsMouseEventDirection: 'up'
        }
        this.handleSignOut = this.handleSignOut.bind(this)
        this.closeProfileSettingSelection = this.closeProfileSettingSelection.bind(
            this
        )
    }

    componentDidMount() {
        this.props.fetchUser()
    }

    handleSignOut() {
        localStorage.removeItem('ember_simple_auth:session')
        window.location.replace('/auth/sign-in')
    }

    closeProfileSettingSelection() {
        const {
            closePopoverModalForm,
            device,
            updateActivePopover
        } = this.props

        closePopoverModalForm()
        setTimeout(() => updateActivePopover(''), device === 'Mobile' ? 500 : 0)
    }

    render() {
        const {
            activePopover,
            updateActivePopover,
            device,
            user,
            isPopoverModalFormOpen
        } = this.props
        const { userName, userEmail, accountName } = user
        const {
            profileMouseEventDirection,
            settingsMouseEventDirection
        } = this.state

        const getUserIconInformation = () => (
            <div
                style={{
                    width: device !== 'Mobile' ? 384 : '100%',
                    paddingLeft: device !== 'Mobile' ? 16 : 24,
                    paddingRight: device !== 'Mobile' ? 16 : 24,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: device !== 'Mobile' ? 80 : 96,
                        borderBottom: `1px solid ${titanium}`
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text size="medium" text={userName} />
                        <Text
                            label={true}
                            size="small"
                            text={userEmail}
                            textStyle={{ color: steel }}
                        />
                    </div>
                    {device === 'Desktop' && (
                        <a
                            href="/settings/overview"
                            style={{
                                textDecoration: 'none',
                                cursor: 'default'
                            }}
                            target="_blank"
                        >
                            <div
                                onMouseDown={() =>
                                    this.setState({
                                        profileMouseEventDirection: 'down'
                                    })
                                }
                                onMouseUp={() => {
                                    this.setState({
                                        profileMouseEventDirection: 'up'
                                    })
                                    this.closeProfileSettingSelection()
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    text="Profile"
                                    size="medium"
                                    textStyle={{
                                        marginRight: 8,
                                        fontWeight: 600,
                                        color:
                                            profileMouseEventDirection === 'up'
                                                ? turquoise
                                                : aquamarine
                                    }}
                                />
                                <ExternalLinkIcon
                                    fill={
                                        profileMouseEventDirection === 'up'
                                            ? turquoise
                                            : aquamarine
                                    }
                                />
                            </div>
                        </a>
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: device !== 'Mobile' ? 56 : 72,
                        borderBottom:
                            device === 'Mobile' ? `1px solid ${titanium}` : null
                    }}
                >
                    <Text size="medium" text={accountName} />
                    {device === 'Desktop' && (
                        <a
                            href="/settings/overview"
                            style={{
                                textDecoration: 'none',
                                cursor: 'default'
                            }}
                            target="_blank"
                        >
                            <div
                                onMouseDown={() =>
                                    this.setState({
                                        settingsMouseEventDirection: 'down'
                                    })
                                }
                                onMouseUp={() => {
                                    this.setState({
                                        settingsMouseEventDirection: 'up'
                                    })
                                    this.closeProfileSettingSelection()
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    text="Settings"
                                    size="medium"
                                    textStyle={{
                                        marginRight: 8,
                                        fontWeight: 600,
                                        color:
                                            settingsMouseEventDirection === 'up'
                                                ? turquoise
                                                : aquamarine
                                    }}
                                />
                                <ExternalLinkIcon
                                    fill={
                                        settingsMouseEventDirection === 'up'
                                            ? turquoise
                                            : aquamarine
                                    }
                                />
                            </div>
                        </a>
                    )}
                </div>
            </div>
        )
        const navBarProps = {
            buttonLeft: 'Done',
            buttonLeftCallback: this.closeProfileSettingSelection,
            buttonRight: 'Sign Out',
            buttonRightCallback: this.handleSignOut,
            title: device === 'Mobile' ? 'Account' : ''
        }

        return device !== 'Mobile' ? (
            <PopoverContainer
                id="user-icon-home-page"
                popoverProps={{
                    placement:
                        device === 'Desktop' ? 'bottom-end' : 'bottom-start',
                    navBarProperties: navBarProps,
                    arrowColors: {
                        primary: cloud,
                        secondary: white,
                        border: titanium
                    }
                }}
                onClick={() =>
                    activePopover === 'user-icon-home-page-popover'
                        ? updateActivePopover('')
                        : updateActivePopover('user-icon-home-page-popover')
                }
                targetParent="root"
                showPopover={activePopover === 'user-icon-home-page-popover'}
            >
                <UserIcon
                    fill={charcoal}
                    height={device === 'Desktop' ? '20' : '24'}
                    width={device === 'Desktop' ? '20' : '24'}
                    viewBox="0 0 24 24"
                />

                {getUserIconInformation()}
            </PopoverContainer>
        ) : (
            <div
                onClick={() =>
                    updateActivePopover('user-icon-home-page-popover')
                }
            >
                <UserIcon
                    fill={charcoal}
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                />
                {activePopover === 'user-icon-home-page-popover' &&
                    ReactDOM.createPortal(
                        <MobilePopover
                            animation={isPopoverModalFormOpen}
                            navbarProps={navBarProps}
                        >
                            {getUserIconInformation()}
                        </MobilePopover>,
                        document.getElementById('root')
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state: State): UserIconPopoverProps => ({
    activePopover: getActivePopover(state),
    user: getUser(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state)
})
const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): UserIconPopoverDispatchProps => {
    return {
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        fetchUser: () => dispatch(fetchUser()),
        closePopoverModalForm: () => dispatch(closePopoverModalForm())
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserIconPopover)
