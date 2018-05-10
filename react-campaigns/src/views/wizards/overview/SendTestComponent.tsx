/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import {
    NavBar,
    titanium,
    Text,
    CheckBox,
    white,
    graphite
} from '@rover/ts-bootstrap/dist/src'

import AudienceLink from '../components/AudienceLink'

import { updateSelectedTestDevices } from '../../../actions'

import {
    getIsSendTestModalOpen,
    getSelectedTestDevices
} from '../../../reducers'

export interface SendTestPopoverProps {
    device?: string
    buttonLeftCallback?: () => void
    buttonRightCallback?: () => void
    listOfTestDevices?: StringMap<string>
}

export interface OwnProps {
    sendTestModalDisplay?: string
    selectedTestDevices?: string[]
}

export interface DispatchProps {
    updateSelectedTestDevices?: (deviceIds: string[]) => void
}

export type textSize = 'h1' | 'h2' | 'large' | 'medium' | 'small'

const SendTestComponent: React.SFC<
    SendTestPopoverProps & OwnProps & DispatchProps
> = ({
    device,
    buttonLeftCallback,
    buttonRightCallback,
    listOfTestDevices,
    selectedTestDevices,
    sendTestModalDisplay,
    updateSelectedTestDevices
}) => {
    const getDeviceText = (deviceId: string) => {
        return listOfTestDevices[deviceId] === ''
            ? deviceId
            : listOfTestDevices[deviceId]
    }

    const handleCheck = (deviceId: string) => {
        let selectedDevices = selectedTestDevices.slice(0)
        const index = selectedTestDevices.indexOf(deviceId)
        if (index !== -1) {
            selectedDevices.splice(index, 1)
        } else {
            selectedDevices.push(deviceId)
        }
        updateSelectedTestDevices(selectedDevices)
    }

    const renderDeviceList = () => {
        const getRowStyle = () => {
            switch (device) {
                case 'Mobile':
                    return {
                        minHeight: 72,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 24,
                        paddingBottom: 23,
                        borderBottom: `1px solid ${titanium}`
                    }
                case 'Tablet':
                case 'Desktop':
                default:
                    return {
                        display: 'flex',
                        height: 55,
                        marginRight: 16,
                        marginLeft: 16,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `1px solid ${titanium}`
                    }
            }
        }

        return Object.keys(listOfTestDevices).map((dev, index) => (
            <div
                style={getRowStyle() as React.CSSProperties}
                key={index}
                onClick={() => handleCheck(dev)}
            >
                <Text
                    text={getDeviceText(dev)}
                    size={device !== 'Mobile' ? 'medium' : 'large'}
                    textStyle={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                />

                <div style={{ marginLeft: 10 }}>
                    <CheckBox
                        checked={selectedTestDevices.includes(dev)}
                        onClick={handleCheck}
                        value={dev}
                    />
                </div>
            </div>
        ))
    }

    const getDeviceView = () => {
        if (Object.keys(listOfTestDevices).length === 0) {
            const noTestDeviceView = () => {
                const mobileTabletText =
                    'No test devices found. Manage test devices in the Audience App.'

                switch (device) {
                    case 'Desktop':
                        return (
                            <AudienceLink
                                primaryText="No test devices found."
                                secondaryText="Manage Test Devices"
                                style={{
                                    height: '100%',
                                    width: '100%'
                                }}
                            />
                        )
                    case 'Tablet':
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: '100%',
                                    width: '100%'
                                }}
                            >
                                <Text
                                    text={mobileTabletText}
                                    size="large"
                                    textStyle={{
                                        width: 327,
                                        textAlign: 'center'
                                    }}
                                />
                            </div>
                        )
                    case 'Mobile':
                        return (
                            <Text
                                text={mobileTabletText}
                                size="large"
                                textStyle={{
                                    width: 327,
                                    marginTop: 8
                                }}
                            />
                        )
                }
            }

            return noTestDeviceView()
        } else {
            return renderDeviceList()
        }
    }

    let ret
    if (device !== 'Mobile') {
        ret = (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <NavBar
                    buttonLeft="Cancel"
                    buttonRight={selectedTestDevices.length !== 0 ? 'Send' : ''}
                    buttonLeftCallback={buttonLeftCallback}
                    buttonRightCallback={buttonRightCallback}
                    style={{
                        buttonLeftStyle: {
                            outerStyle: {
                                marginLeft: 16,
                                color: graphite
                            }
                        },
                        buttonRightStyle: {
                            outerStyle: {
                                marginRight: 16,
                                color: graphite
                            }
                        }
                    }}
                />
                <div
                    style={{
                        height: 250,
                        overflowY: 'scroll'
                    }}
                >
                    {getDeviceView()}
                </div>
            </div>
        )
    } else {
        ret = (
            <div
                id="sendTestId"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    position: 'absolute',
                    background: white,
                    top: 0,
                    left: 0,
                    animation: `${sendTestModalDisplay} 300ms ease`,
                    overflowY: 'scroll'
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <NavBar
                        buttonLeft="Cancel"
                        buttonRight={
                            selectedTestDevices.length !== 0 ? 'Send' : ''
                        }
                        buttonLeftCallback={buttonLeftCallback}
                        buttonRightCallback={buttonRightCallback}
                        style={{
                            buttonLeftStyle: {
                                outerStyle: {
                                    marginLeft: 24
                                },
                                innerStyle: {
                                    color: graphite
                                }
                            },
                            buttonRightStyle: {
                                outerStyle: {
                                    marginRight: 24
                                },
                                innerStyle: {
                                    color: graphite
                                }
                            },
                            containerStyle: {
                                minHeight: 56
                            }
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 24
                        }}
                    >
                        <Text text="Send a Test" size="h1" />
                        <div style={{ overflowY: 'scroll' }}>
                            {getDeviceView()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return ret
}

const mapStateToProps = (state: State): OwnProps => ({
    sendTestModalDisplay: getIsSendTestModalOpen(state),
    selectedTestDevices: getSelectedTestDevices(state)
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        updateSelectedTestDevices: (deviceIds: string[]) => {
            dispatch(updateSelectedTestDevices(deviceIds))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTestComponent)
