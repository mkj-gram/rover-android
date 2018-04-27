/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { handleAlertOptionsModalDisplay } from '../../../actions'
import { getIsAlertOptionsOpen } from '../../../reducers'

import {
    AlertOptionsBadgeNumber,
    AlertOptionsNotificationCenter,
    AlertOptionsPushNotification,
    PhoneComponent,
    NavBar,
    Text,
    white
} from '@rover/ts-bootstrap/dist/src'

export interface StateProps {
    deviceInfoSelected: string
}

export interface AlertOptionsPhonePreviewProps {
    device?: Media
    val?: string
    descriptionVal?: string
}

export interface DispatchProps {
    handleAlertOptionsModalDisplay: (deviceInfoSelected?: string) => void
}

class AlertOptionsPhonePreview extends React.Component<
    StateProps & DispatchProps & AlertOptionsPhonePreviewProps,
    {}
> {
    constructor(
        props: StateProps & DispatchProps & AlertOptionsPhonePreviewProps
    ) {
        super(props)
    }

    render() {
        const matchName: StringMap<string> = {
            notificationAlertOptionPushNotification:
                'Alert users with a system notification',
            notificationAlertOptionNotificationCenter:
                'Add to your app’s Notification Center',
            notificationAlertOptionBadgeNumber: `Increment the number on your app's badge icon`
        }

        const Fragment = React.Fragment
        const { device, val, descriptionVal } = this.props

        let view
        let tempView

        const getAlertView = () => {
            switch (val) {
                case 'notificationAlertOptionPushNotification':
                    return <AlertOptionsPushNotification />
                case 'notificationAlertOptionNotificationCenter':
                    return <AlertOptionsNotificationCenter />
                case 'notificationAlertOptionBadgeNumber':
                    return <AlertOptionsBadgeNumber />
                default:
                    return null
            }
        }

        let topView = (
            <PhoneComponent
                viewLockScreen={
                    val === 'notificationAlertOptionPushNotification'
                }
                device={device}
            >
                {getAlertView()}
            </PhoneComponent>
        )

        let bottomView = (
            <div
                style={{
                    paddingTop: device !== 'Mobile' ? 40 : 24,
                    width:
                        val === 'notificationAlertOptionBadgeNumber'
                            ? 200
                            : 151,
                    textAlign: 'center',
                    paddingBottom: device !== 'Mobile' ? 'none' : 24
                }}
            >
                <Text text={matchName[val]} size="large" />
            </div>
        )

        if (device === 'Mobile') {
            tempView = bottomView
            bottomView = topView
            topView = tempView
        }
        view = (
            <Fragment>
                {topView}
                {bottomView}
            </Fragment>
        )

        if (device === 'Desktop') {
            return view
        } else {
            const { deviceInfoSelected } = this.props
            let animationVal = 'close'
            if ((deviceInfoSelected as string).length !== 0) {
                animationVal = deviceInfoSelected === 'close' ? 'close' : 'open'
            }

            return (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        animation: `${animationVal} 500ms ease`,
                        position: 'absolute',
                        zIndex: 1,
                        top: 0,
                        left: 0,
                        overflowY:
                            device === 'Mobile'
                                ? ('hidden' as 'hidden')
                                : ('visible' as 'visible')
                    }}
                >
                    <NavBar
                        buttonLeft="Close"
                        title={descriptionVal}
                        buttonLeftCallback={() =>
                            this.props.handleAlertOptionsModalDisplay('')
                        }
                        style={{
                            buttonLeftStyle: {
                                outerStyle: {
                                    marginLeft: 24
                                }
                            }
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent:
                                device === 'Tablet' ? 'center' : 'flex-start',
                            alignItems: 'center',
                            flexDirection: 'column',
                            width: '100%',
                            height: '100%',
                            background: white
                        }}
                    >
                        {view}
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state: State): StateProps => ({
    deviceInfoSelected: getIsAlertOptionsOpen(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): DispatchProps => {
    return {
        handleAlertOptionsModalDisplay: deviceInfoSelected => {
            dispatch(handleAlertOptionsModalDisplay(deviceInfoSelected))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    AlertOptionsPhonePreview
)
