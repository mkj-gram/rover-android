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

class SendTestComponent extends React.Component<
    SendTestPopoverProps & OwnProps & DispatchProps,
    {}
> {
    constructor(props: SendTestPopoverProps & OwnProps & DispatchProps) {
        super(props)

        this.getDeviceText = this.getDeviceText.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
    }

    getDeviceText(listOfTestDevices: StringMap<string>, deviceId: string) {
        return listOfTestDevices[deviceId] === ''
            ? deviceId
            : listOfTestDevices[deviceId]
    }
    handleCheck(deviceId: string) {
        const { updateSelectedTestDevices, selectedTestDevices } = this.props
        let selectedDevices = selectedTestDevices.slice(0)
        const index = selectedTestDevices.indexOf(deviceId)
        if (index !== -1) {
            selectedDevices.splice(index, 1)
        } else {
            selectedDevices.push(deviceId)
        }
        updateSelectedTestDevices(selectedDevices)
    }

    renderDeviceList(device: string) {
        const { listOfTestDevices, selectedTestDevices } = this.props

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
                onClick={
                    device !== 'Desktop'
                        ? () => this.handleCheck(dev)
                        : () => null
                }
            >
                <Text
                    text={this.getDeviceText(listOfTestDevices, dev)}
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
                        onClick={this.handleCheck}
                        value={dev}
                    />
                </div>
            </div>
        ))
    }

    render() {
        const {
            device,
            buttonLeftCallback,
            buttonRightCallback,
            selectedTestDevices,
            sendTestModalDisplay
        } = this.props

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
                        buttonRight={
                            selectedTestDevices.length !== 0 ? 'Send' : ''
                        }
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
                        {this.renderDeviceList(device)}
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
                                {this.renderDeviceList(device)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return ret
    }
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
