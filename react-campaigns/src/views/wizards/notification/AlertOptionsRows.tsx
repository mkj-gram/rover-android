/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    handleAlertOptionsModalDisplay,
    updateEditableCampaign
} from '../../../actions'
import MediaQuery from 'react-responsive'

import AlertOptionsPhonePreview from './AlertOptionsPhonePreview'

import {
    AlertInfoIcon,
    beige,
    mercury,
    silver,
    Switch,
    Text,
    titanium,
    white,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

export interface AlertOptionsRowsProps {
    device?: Media
    handleHover: (hoverField: alertType | '') => void
    field: alertType
    displayText: string
    isHovered: boolean
}

export interface StateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface DispatchProps {
    handleAlertOptionsModalDisplay: (deviceInfoSelected?: string) => void
    updateEditableCampaign: (val: object) => void
}

const AlertOptionsRows: React.SFC<
    AlertOptionsRowsProps & StateProps & DispatchProps
> = ({
    device,
    handleHover,
    field,
    displayText,
    isHovered,
    handleAlertOptionsModalDisplay,
    editableCampaign,
    updateEditableCampaign
}) => {
    const {
        notificationAlertOptionBadgeNumber,
        notificationAlertOptionPushNotification,
        notificationAlertOptionNotificationCenter
    } = editableCampaign

    const handleSwitchChange = () => {
        if (
            !(
                field === 'notificationAlertOptionBadgeNumber' &&
                notificationAlertOptionNotificationCenter === false
            )
        ) {
            let obj = {
                [field]: !editableCampaign[field]
            }
            if (
                field === 'notificationAlertOptionNotificationCenter' &&
                editableCampaign[field] === true
            ) {
                obj = {
                    ...obj,
                    notificationAlertOptionBadgeNumber: false
                }
            }
            updateEditableCampaign(obj)
        }
    }

    const getSwitchValue = () => {
        if (field === 'notificationAlertOptionBadgeNumber') {
            return notificationAlertOptionNotificationCenter === false
                ? false
                : notificationAlertOptionBadgeNumber
        } else {
            return editableCampaign[field as alertType]
        }
    }

    const getSwitchDisableStyle = () => {
        let ret
        if (field === 'notificationAlertOptionBadgeNumber') {
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

    const getTextStyle = () => {
        if (
            field === 'notificationAlertOptionBadgeNumber' &&
            editableCampaign.notificationAlertOptionNotificationCenter === false
        ) {
            return {
                color: silver
            }
        }
    }

    const style = isHovered
        ? {
              marginLeft: -32,
              marginRight: -32,
              paddingRight: 32,
              paddingLeft: 32,
              background: beige
          }
        : {
              marginLeft: -32,
              marginRight: -32,
              paddingRight: 32,
              paddingLeft: 32
          }

    return (
        <div
            style={{
                ...style
            }}
            onMouseEnter={() => handleHover(field)}
            onMouseLeave={() => handleHover('')}
            onClick={() => handleSwitchChange()}
            id={`${field}_alertOptionsRow`}
        >
            <div
                style={{
                    display: 'flex',
                    height: 71,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderBottom: `1px solid ${titanium}`,
                    position: 'relative'
                }}
            >
                <Text
                    text={displayText}
                    size="large"
                    label={true}
                    textStyle={getTextStyle()}
                />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {device !== 'Desktop' && (
                        <div
                            onClick={e => {
                                e.stopPropagation()
                                handleAlertOptionsModalDisplay(field)
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
                        on={getSwitchValue()}
                        style={getSwitchDisableStyle()}
                        onClick={() => handleSwitchChange()}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: state.editableCampaign
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertOptionsRows)
