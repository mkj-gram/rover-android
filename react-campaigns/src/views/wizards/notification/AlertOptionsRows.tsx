/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    handleAlertOptionsModalDisplay,
    updateEditableCampaign,
    setHoverOption
} from '../../../actions'
import MediaQuery from 'react-responsive'

import AlertOptionsPhonePreview from './AlertOptionsPhonePreview'

import {
    AlertInfoIcon,
    AlertOptionsBadgeNumber,
    AlertOptionsNotificationCenter,
    AlertOptionsPushNotification,
    almostWhite,
    beige,
    cloud,
    mercury,
    silver,
    Switch,
    Text,
    titanium,
    white
} from '@rover/ts-bootstrap/dist/src'
import { turquoise } from '@rover/ts-bootstrap/dist/styles/colors'

import {
    getAlertOptionHoverValue,
    getIsAlertOptionsOpen
} from '../../../reducers'

export interface AlertOptionsRowsProps {
    device?: Media
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface StateProps {
    deviceInfoSelected: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    hoverValue?: string
}

export interface DispatchProps {
    handleAlertOptionsModalDisplay: (deviceInfoSelected?: string) => void
    updateEditableCampaign: (val: object) => void
    setHoverOption: (val: string) => void
}

type alertType =
    | 'notificationAlertOptionBadgeNumber'
    | 'notificationAlertOptionPushNotification'
    | 'notificationAlertOptionNotificationCenter'

const AlertOptionsRows: React.SFC<
    AlertOptionsRowsProps & StateProps & DispatchProps
> = ({
    campaign,
    device,
    deviceInfoSelected,
    editableCampaign,
    handleAlertOptionsModalDisplay,
    hoverValue,
    setHoverOption,
    updateEditableCampaign
}) => {
    const {
        notificationAlertOptionBadgeNumber,
        notificationAlertOptionPushNotification,
        notificationAlertOptionNotificationCenter
    } = editableCampaign

    const handleSwitchChange = (val: string) => {
        if (
            !(
                val === 'notificationAlertOptionBadgeNumber' &&
                notificationAlertOptionNotificationCenter === false
            )
        ) {
            let obj = {
                [val]: !editableCampaign[val as alertType]
            }
            if (
                val === 'notificationAlertOptionNotificationCenter' &&
                editableCampaign[val as alertType] === false
            ) {
                obj = {
                    ...obj,
                    notificationAlertOptionBadgeNumber: false
                }
            }
            updateEditableCampaign(obj)
        }
    }

    const handleRowClick = (val: string) => handleSwitchChange(val)

    const handleMouseOver = (val: string) => {
        if (device === 'Desktop' && window.innerWidth >= 1140) {
            const onHoverOption = val === hoverValue ? '' : val
            setHoverOption(onHoverOption)
        }
    }

    const getCaretAndPreviewPortals = (
        val?: string,
        matchName?: StringMap<string>
    ) => {
        const Fragment = React.Fragment

        let ret
        if (device === 'Desktop') {
            ret = (
                <Fragment>
                    {ReactDOM.createPortal(
                        getAlertIcon(matchName[val] as alertType),
                        document.getElementById('phone-bezel')
                    )}
                </Fragment>
            )
        } else {
            ret = (
                <Fragment>
                    {ReactDOM.createPortal(
                        <AlertOptionsPhonePreview
                            device={device}
                            val={matchName[val]}
                            descriptionVal={val}
                        />,
                        document.getElementById('notificationContainer')
                    )}
                </Fragment>
            )
        }
        return ret
    }

    const getAlertIcon = (type: alertType) => {
        const style: React.CSSProperties = {
            position: 'absolute',
            top: 96,
            left: 24,
            textAlign: 'center',
            width: 320
        }
        switch (type) {
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

    const getSwitchValue = (val: string) => {
        if (val === 'notificationAlertOptionBadgeNumber') {
            return notificationAlertOptionNotificationCenter === false
                ? false
                : notificationAlertOptionBadgeNumber
        } else {
            return editableCampaign[val as alertType]
        }
    }

    const getSwitchDisableStyle = (val: string) => {
        let ret
        if (val === 'notificationAlertOptionBadgeNumber') {
            if (
                editableCampaign.notificationAlertOptionNotificationCenter ===
                false
            ) {
                ret = {
                    outerStyle: {
                        background: mercury
                    }
                }
            } else {
                ret = {
                    outerStyle: {
                        background: editableCampaign.notificationAlertOptionBadgeNumber
                            ? turquoise
                            : titanium
                    }
                }
            }
        }
        return ret
    }

    const getTextStyle = (val: string) => {
        if (
            val === 'notificationAlertOptionBadgeNumber' &&
            editableCampaign.notificationAlertOptionNotificationCenter === false
        ) {
            return {
                color: silver
            }
        }
    }

    const matchName: StringMap<string> = {
        'Push Notification': 'notificationAlertOptionPushNotification',
        'Notification Center': 'notificationAlertOptionNotificationCenter',
        'Badge Number': 'notificationAlertOptionBadgeNumber'
    }
    const Fragment = React.Fragment
    return (
        <Fragment>
            {Object.keys(matchName).map((elem, id) => (
                <div
                    key={id}
                    style={{
                        position: 'relative',
                        padding: device !== 'Mobile' ? '0 32px' : '0 24px',
                        background: elem === hoverValue ? beige : 'none'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            height: 71,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            overflow: 'hidden'
                        }}
                        id={matchName[elem]}
                        onMouseEnter={() => handleMouseOver(elem)}
                        onMouseLeave={() => handleMouseOver(elem)}
                        onClick={() => handleRowClick(matchName[elem])}
                    >
                        <Text
                            text={elem}
                            size="large"
                            label={true}
                            textStyle={getTextStyle(matchName[elem])}
                        />

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {device !== 'Desktop' && (
                                <div
                                    onClick={e => {
                                        e.stopPropagation()
                                        handleAlertOptionsModalDisplay(elem)
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <AlertInfoIcon
                                        fill={turquoise}
                                        style={{ marginRight: 16 }}
                                    />
                                </div>
                            )}

                            <Switch
                                on={getSwitchValue(matchName[elem]) as boolean}
                                style={getSwitchDisableStyle(matchName[elem])}
                                onClick={() =>
                                    handleSwitchChange(matchName[elem])
                                }
                            />
                        </div>
                        {hoverValue.length !== 0 &&
                            hoverValue === elem &&
                            device === 'Desktop' && (
                                <MediaQuery minWidth={1140}>
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: 'calc(50%) -10px',
                                            left: 759,
                                            height: 20,
                                            width: 20,
                                            transform: 'rotate(45deg)',
                                            background: beige,
                                            border: `1px solid ${titanium}`,
                                            borderBottom: 'none',
                                            borderLeft: 'none',
                                            borderRadius: '0 5px 0 0'
                                        }}
                                    />
                                </MediaQuery>
                            )}
                    </div>
                    <div
                        style={{
                            height: 1,
                            background: titanium
                        }}
                    />

                    {(deviceInfoSelected as string).length !== 0 &&
                        (deviceInfoSelected === elem ||
                            deviceInfoSelected === 'close') &&
                        device !== 'Desktop' &&
                        getCaretAndPreviewPortals(
                            deviceInfoSelected,
                            matchName
                        )}
                </div>
            ))}
            {device === 'Desktop' && (
                <MediaQuery minWidth={1140}>
                    {getCaretAndPreviewPortals(hoverValue, matchName)}
                </MediaQuery>
            )}
        </Fragment>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    deviceInfoSelected: getIsAlertOptionsOpen(state),
    editableCampaign: state.editableCampaign,
    hoverValue: getAlertOptionHoverValue(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): DispatchProps => {
    return {
        handleAlertOptionsModalDisplay: deviceInfoSelected => {
            dispatch(handleAlertOptionsModalDisplay(deviceInfoSelected))
        },
        updateEditableCampaign: val => {
            dispatch(updateEditableCampaign(val))
        },
        setHoverOption: val => {
            dispatch(setHoverOption(val))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertOptionsRows)
