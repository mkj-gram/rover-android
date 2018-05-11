/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'

import {
    Text,
    AlertOptionsBadgeNumber,
    AlertOptionsNotificationCenter,
    AlertOptionsPushNotification,
    beige,
    titanium
} from '@rover/ts-bootstrap/dist/src'
import AlertOptionsRows from './AlertOptionsRows'
import AlertOptionsPhonePreview from './AlertOptionsPhonePreview'
import FormSection from '../../utils/FormSection'
import { getIsAlertOptionsOpen } from '../../../reducers'

export interface StateProps {
    deviceInfoSelected: string
}

export interface AlertsOptionsProps extends InjectedProps {
    wizardSection: keyof editableUIState
}

export interface AlertOptionsState {
    hoverField: alertType | ''
}

class AlertOptionsContainer extends React.Component<
    AlertsOptionsProps & StateProps,
    AlertOptionsState
> {
    constructor(props: AlertsOptionsProps & StateProps) {
        super(props)
        this.state = {
            hoverField: ''
        }
        this.handleHover = this.handleHover.bind(this)
    }

    componentDidUpdate() {
        const { hoverField } = this.state
        const hoverArrowId = `${hoverField}_hoverArrow`
        const hoverRow = document.getElementById(
            `${hoverField}_alertOptionsRow`
        )
        const hoverArrow = document.getElementById(hoverArrowId)

        if (hoverRow && hoverArrow) {
            hoverArrow.style.top = `${hoverRow.getBoundingClientRect().top -
                (hoverArrow.getBoundingClientRect().height -
                    hoverRow.getBoundingClientRect().height) /
                    2}px`
        }
    }

    handleHover(hoverField: alertType | '') {
        const { device } = this.props
        if (device === 'Desktop' && window.innerWidth >= 1140) {
            this.setState({
                hoverField
            })
        }
    }

    getHoverArrow() {
        const { hoverField } = this.state
        const hoverArrowId = `${hoverField}_hoverArrow`
        return ReactDOM.createPortal(
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 758,
                    height: 20,
                    width: 20,
                    transform: 'rotate(45deg)',
                    background: beige,
                    border: `1px solid ${titanium}`,
                    borderBottom: 'none',
                    borderLeft: 'none',
                    borderRadius: '0 5px 0 0'
                }}
                id={hoverArrowId}
            />,
            document.getElementById('mainModalRight')
        )
    }

    getCaretAndPreviewPortals() {
        const { device } = this.props
        const { hoverField } = this.state

        const getAlertIcon = () => {
            const style: React.CSSProperties = {
                position: 'absolute',
                top: 96,
                left: 24,
                textAlign: 'center',
                width: 320
            }

            switch (hoverField) {
                case 'notificationAlertOptionBadgeNumber':
                    return (
                        <div style={{ ...style, zIndex: 10 }}>
                            <AlertOptionsBadgeNumber />
                            <Text
                                text="Increment the number on your app's badge icon"
                                size="large"
                                textStyle={{
                                    margin: '131px auto',
                                    width: 200
                                }}
                            />
                        </div>
                    )
                case 'notificationAlertOptionNotificationCenter':
                    return (
                        <div
                            style={{
                                ...style,
                                backgroundColor: 'white',
                                height: 568,
                                zIndex: 10
                            }}
                        >
                            <AlertOptionsNotificationCenter />
                            <Text
                                text="Add to your app’s Notification Center"
                                size="large"
                                textStyle={{
                                    margin: '131px auto',
                                    width: 200
                                }}
                            />
                        </div>
                    )
                case 'notificationAlertOptionPushNotification':
                    return (
                        <div style={style}>
                            <AlertOptionsPushNotification />
                            <Text
                                text="Alert users with a system notification"
                                size="large"
                                textStyle={{
                                    margin: '131px auto',
                                    width: 151
                                }}
                            />
                        </div>
                    )
                default:
                    return (
                        <div
                            style={{
                                ...style,
                                height: 568,
                                width: 320,
                                background:
                                    'white linear-gradient(rgba(233,233,233,1.0), rgba(238,238,238,0.5))',
                                zIndex: 10
                            }}
                        />
                    )
            }
        }

        return ReactDOM.createPortal(
            getAlertIcon(),
            document.getElementById('phone-bezel')
        )
    }

    render() {
        const { device, deviceInfoSelected } = this.props
        const { hoverField } = this.state
        const { Fragment } = React

        return (
            <FormSection device={device}>
                <div
                    style={{
                        paddingTop: 24,
                        paddingBottom: 8
                    }}
                >
                    <Text text="Alert Options" size="h1" />
                </div>
                <div
                    style={{
                        paddingBottom: 24
                    }}
                >
                    <Text
                        text="How should the user be alerted when the notification is delivered?"
                        size="medium"
                    />
                </div>

                <AlertOptionsRows
                    handleHover={this.handleHover}
                    device={device}
                    field="notificationAlertOptionPushNotification"
                    displayText="Push Notification"
                    isHovered={
                        hoverField === 'notificationAlertOptionPushNotification'
                    }
                />
                <AlertOptionsRows
                    handleHover={this.handleHover}
                    device={device}
                    field="notificationAlertOptionNotificationCenter"
                    displayText="Notification Center"
                    isHovered={
                        hoverField ===
                        'notificationAlertOptionNotificationCenter'
                    }
                />
                <AlertOptionsRows
                    handleHover={this.handleHover}
                    device={device}
                    field="notificationAlertOptionBadgeNumber"
                    displayText="Badge Number"
                    isHovered={
                        hoverField === 'notificationAlertOptionBadgeNumber'
                    }
                />

                {device === 'Desktop' && (
                    <MediaQuery minWidth={1140}>
                        {this.getCaretAndPreviewPortals()}
                        {hoverField !== '' && this.getHoverArrow()}
                    </MediaQuery>
                )}
                {(deviceInfoSelected as string).length !== 0 &&
                    ReactDOM.createPortal(
                        <AlertOptionsPhonePreview
                            device={device}
                            val={deviceInfoSelected}
                        />,
                        document.getElementById('notificationContainer')
                    )}
            </FormSection>
        )
    }
}

const mapStateToProps = (state: State): StateProps => ({
    deviceInfoSelected: getIsAlertOptionsOpen(state)
})

export default connect(mapStateToProps, {})(AlertOptionsContainer)
