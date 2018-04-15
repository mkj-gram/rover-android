/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect } from 'react-redux'
import {
    NavBar,
    titanium,
    Text,
    CheckBox,
    white,
    graphite
} from '@rover/ts-bootstrap/dist/src'

import { getIsSendTestModalOpen } from '../../../reducers'

export interface SendTestPopoverProps {
    device?: string
    buttonLeftCallback?: () => void
    buttonRightCallback?: () => void
    selectedTestDevices?: string[]
    listOfTestDevices?: StringMap<string>
    handleCheck?: (val: string) => void
}

export interface OwnProps {
    sendTestModalDisplay?: string
}

export type textSize = 'h1' | 'h2' | 'large' | 'medium' | 'small'

class SendTestComponent extends React.Component<
    SendTestPopoverProps & OwnProps,
    {}
> {
    constructor(props: SendTestPopoverProps & OwnProps) {
        super(props)
        this.getDeviceText = this.getDeviceText.bind(this)
    }

    getDeviceText(listOfTestDevices: StringMap<string>, deviceId: string) {
        return listOfTestDevices[deviceId] === ''
            ? deviceId
            : listOfTestDevices[deviceId]
    }

    renderDeviceList(device: string) {
        const {
            listOfTestDevices,
            selectedTestDevices,
            handleCheck
        } = this.props

        const getRowStyle = () => {
            switch (device) {
                case 'Mobile':
                    return {
                        height: 72,
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
                    device !== 'Desktop' ? () => handleCheck(dev) : () => null
                }
            >
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Text
                        text={this.getDeviceText(listOfTestDevices, dev)}
                        size={device !== 'Mobile' ? 'medium' : 'large'}
                    />
                </div>
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
                        height: 256,
                        overflowY: 'scroll'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
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
                            {this.renderDeviceList(device)}
                        </div>
                    </div>
                </div>
            )
        }
        return ret
    }
}

const mapStateToProps = (state: State): OwnProps => ({
    sendTestModalDisplay: getIsSendTestModalOpen(state)
})

export default connect(mapStateToProps, {})(SendTestComponent)
