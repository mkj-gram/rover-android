/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    handleAlertOptionsModalDisplay,
    updateEditableCampaign,
    setHoverOption
} from '../../../actions'

import AlertOptionsPhonePreview from './AlertOptionsPhonePreview'

import {
    Text,
    Switch,
    titanium,
    beige,
    white,
    silver,
    mercury,
    almostWhite,
    cloud,
    AlertInfoIcon
} from '@rover/ts-bootstrap/dist/src'
import { turquoise } from '@rover/ts-bootstrap/dist/styles/colors'

import { getAlertOptionHoverValue } from '../../../reducers'

export interface AlertOptionsRowsProps {
    device?: string
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface StateProps {
    alertOptionModal?: StringMap<string | boolean>
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
    alertOptionModal,
    editableCampaign,
    hoverValue,
    device,
    campaign,
    handleAlertOptionsModalDisplay,
    updateEditableCampaign,
    setHoverOption
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

    const handleRowClick = (val: string) => {
        if (device !== 'Desktop') {
            handleSwitchChange(val)
        }
    }

    const handleMouseOver = (val: string) => {
        if (device === 'Desktop') {
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
                        <AlertOptionsPhonePreview
                            device={device}
                            val={matchName[val]}
                        />,

                        document.getElementById('mainModalRight')
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
        const marginRight = device !== 'Mobile' ? 32 : 24
        let ret: StringMap<StringMap<string | number>> = {
            outerStyle: {
                marginRight
            }
        }
        if (val === 'notificationAlertOptionBadgeNumber') {
            if (
                editableCampaign.notificationAlertOptionNotificationCenter ===
                false
            ) {
                ret = {
                    outerStyle: {
                        background: mercury,
                        marginRight
                    }
                }
            } else {
                ret = {
                    outerStyle: {
                        background: editableCampaign.notificationAlertOptionBadgeNumber
                            ? turquoise
                            : titanium,
                        marginRight
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

    const { deviceInfoSelected } = alertOptionModal

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
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(50%) -10px',
                                        right: -11,
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
                            )}
                    </div>
                    <div
                        style={{
                            height: 1,
                            background: titanium
                        }}
                    />
                    {hoverValue.length !== 0 &&
                        hoverValue === elem &&
                        device === 'Desktop' &&
                        getCaretAndPreviewPortals(hoverValue, matchName)}
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
        </Fragment>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    alertOptionModal: state.modal,
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
