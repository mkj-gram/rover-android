/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import {
    PopoverContainer,
    UserIcon,
    charcoal,
    Text,
    Button,
    aquamarine,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import { updateActivePopover, fetchUser } from '../../actions'

import { getActivePopover, getUser } from '../../reducers'

export interface Props {
    device: Media
}

export interface UserIconPopoverProps {
    activePopover: string
    user: User
}

export interface UserIconPopoverDispatchProps {
    updateActivePopover: (field: string) => void
    fetchUser: () => void
}

class UserIconPopover extends React.Component<
    UserIconPopoverProps & UserIconPopoverDispatchProps & Props,
    {}
> {
    constructor(
        props: UserIconPopoverProps & UserIconPopoverDispatchProps & Props
    ) {
        super(props)
        this.getToken = this.getToken.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    componentDidMount() {
        this.props.fetchUser()
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
        const { activePopover, updateActivePopover, device, user } = this.props
        const { userName, userEmail, accountName } = user

        return (
            <PopoverContainer
                id="user-icon-home-page"
                popoverProps={{
                    placement:
                        device === 'Desktop' ? 'bottom-end' : 'bottom-start'
                }}
                onClick={() =>
                    activePopover === 'user-icon-home-page-popover'
                        ? updateActivePopover('')
                        : updateActivePopover('user-icon-home-page-popover')
                }
                targetParent="root"
                showPopover={activePopover === 'user-icon-home-page-popover'}
                style={{
                    height: 20
                }}
            >
                <UserIcon
                    fill={charcoal}
                    height={device === 'Desktop' ? '20' : '24'}
                    width={device === 'Desktop' ? '20' : '24'}
                    viewBox="0 0 24 24"
                />
                <div
                    style={{
                        width: 192,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <Text
                            text="Account Name :"
                            label={true}
                            size="small"
                            textStyle={{ marginRight: 8 }}
                        />
                        <Text
                            text={accountName}
                            size="medium"
                            textStyle={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <Text
                            text="Name :"
                            label={true}
                            size="small"
                            textStyle={{ marginRight: 8 }}
                        />
                        <Text
                            text={userName}
                            size="medium"
                            textStyle={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <Text
                            text="Email :"
                            label={true}
                            size="small"
                            textStyle={{ marginRight: 8 }}
                        />
                        <Text
                            text={userEmail}
                            size="medium"
                            textStyle={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 8
                        }}
                    >
                        <Button
                            text="Sign Out"
                            type="regular"
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                            onClick={() => this.handleSignOut()}
                        />
                    </div>
                </div>
            </PopoverContainer>
        )
    }
}

const mapStateToProps = (state: State): UserIconPopoverProps => ({
    activePopover: getActivePopover(state),
    user: getUser(state)
})
const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): UserIconPopoverDispatchProps => {
    return {
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        fetchUser: () => dispatch(fetchUser())
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserIconPopover)
