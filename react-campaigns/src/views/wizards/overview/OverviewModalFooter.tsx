/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
    fetchTestDevices,
    handleSendTestModalDisplay,
    sendTest
} from '../../../actions'

import { connect, Dispatch } from 'react-redux'
import {
    Button,
    white,
    titanium,
    PopoverContainer,
    cloud,
    graphite,
    Dialog
} from '@rover/ts-bootstrap/dist/src'
import { InjectedProps } from '../../utils/ResponsiveContainer'
import DeviceTransitionContainer from '../../utils/DeviceTransitionContainer'

import SendTestComponent from './SendTestComponent'

export interface OverviewModalFooterProps extends InjectedProps {
    sendTest?: boolean
    publish?: boolean
    sendTestClick?: () => void
    publishClick?: () => void
    campaignId?: number
}

export interface OverviewModalFooterState {
    toggleSendTest: boolean
    sendTestPrompt: boolean
    selectedTestDevices?: string[]
}

export interface DispatchProps {
    fetchTestDevices: () => void
    handleSendTestModalDisplay: (on?: boolean) => void
    sendTestNotification: (campaignId: number, deviceIds: string[]) => void
}

export interface TestDeviceStateProps {
    testDevices: StringMap<string>
}

class OverviewModalFooter extends React.Component<
    TestDeviceStateProps & OverviewModalFooterProps & DispatchProps,
    OverviewModalFooterState
> {
    constructor(
        props: TestDeviceStateProps & OverviewModalFooterProps & DispatchProps
    ) {
        super(props)
        this.state = {
            toggleSendTest: false,
            sendTestPrompt: false,
            selectedTestDevices: []
        }
        this.handleSendTestToggle = this.handleSendTestToggle.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleSendTestPrompt = this.handleSendTestPrompt.bind(this)
    }

    componentDidMount() {
        this.props.fetchTestDevices()
    }

    handleSendTestToggle(device?: string, on?: boolean) {
        if (this.props.sendTest) {
            if (device !== 'Mobile') {
                this.setState({
                    toggleSendTest: !this.state.toggleSendTest
                })
            } else {
                this.props.handleSendTestModalDisplay(on)
                if (on) {
                    this.setState({
                        toggleSendTest: !this.state.toggleSendTest
                    })
                } else {
                    setTimeout(() => {
                        this.setState({
                            toggleSendTest: !this.state.toggleSendTest
                        })
                    }, 300)
                }
            }
        }
    }

    handleSendTestPrompt() {
        this.setState({
            toggleSendTest: false,
            sendTestPrompt: !this.state.sendTestPrompt
        })
    }

    handleCheck(val: string) {
        let selectedDevices = this.state.selectedTestDevices.slice(0)
        const index = this.state.selectedTestDevices.indexOf(val)
        if (index !== -1) {
            selectedDevices.splice(index, 1)
        } else {
            selectedDevices.push(val)
        }
        this.setState({
            selectedTestDevices: selectedDevices
        })
    }

    render() {
        const { sendTest, publish, device, publishClick } = this.props

        const {
            toggleSendTest,
            selectedTestDevices,

            sendTestPrompt
        } = this.state

        const popoverProps = {
            placement: 'bottom',
            containerStyle: {
                height: 312,
                width: 384,
                background: white,
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${titanium}`
            },
            navBarProperties: {
                buttonLeft: 'Cancel',
                buttonRight: selectedTestDevices.length !== 0 ? 'Send' : '',
                id: 'navBarId',
                style: {
                    containerStyle: {
                        borderRadius: '3px 3px 0px 0px'
                    }
                },
                buttonLeftCallback: this.handleSendTestToggle,
                buttonRightCallback: this.handleSendTestPrompt
            },
            arrowColors: {
                primary: cloud,
                secondary: white,
                border: titanium
            }
        }

        const handleSendTest = () => {
            if (device !== 'Mobile') {
                return (
                    <PopoverContainer
                        id="sendTest"
                        popoverProps={popoverProps}
                        targetParent="root"
                        onClick={this.handleSendTestToggle}
                        showPopover={this.state.toggleSendTest}
                    >
                        {[
                            <Button
                                text="Send a Test"
                                size="large"
                                type={sendTest ? 'secondary' : 'disabled'}
                                overrideWidth={114}
                                style={{ outerStyle: { marginRight: 16 } }}
                                onClick={this.handleSendTestToggle}
                                key="sendTest1"
                            />,
                            <SendTestComponent
                                key="sendTest2"
                                device={device}
                                selectedTestDevices={selectedTestDevices}
                                listOfTestDevices={this.props.testDevices}
                                handleCheck={this.handleCheck}
                            />
                        ]}
                    </PopoverContainer>
                )
            } else {
                const Fragment = React.Fragment
                let node = (
                    <SendTestComponent
                        key="sendTest2"
                        device={device}
                        buttonLeftCallback={() =>
                            this.handleSendTestToggle('Mobile', false)
                        }
                        selectedTestDevices={selectedTestDevices}
                        listOfTestDevices={this.props.testDevices}
                        handleCheck={this.handleCheck}
                        buttonRightCallback={this.handleSendTestPrompt}
                    />
                )

                return (
                    <Fragment>
                        <Button
                            text="Send a Test"
                            size="large"
                            type={sendTest ? 'secondary' : 'disabled'}
                            overrideWidth={114}
                            style={{ outerStyle: { marginRight: 16 } }}
                            key="sendTest1"
                            onClick={() =>
                                this.handleSendTestToggle('Mobile', true)
                            }
                        />
                        {toggleSendTest &&
                            ReactDOM.createPortal(
                                node,
                                document.getElementById('overviewComponentRoot')
                            )}
                    </Fragment>
                )
            }
        }
        const promptStr = `You’re about to send a test version of this campaign to ${
            selectedTestDevices.length
        } ${selectedTestDevices.length > 1 ? 'devices' : 'device'}. Continue?`

        return (
            <div
                style={{
                    height: 80,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: `1px solid ${titanium}`,
                    flex: 'none',
                    background: white,
                    position: 'absolute',
                    bottom: 0
                }}
            >
                <div
                    style={{
                        margin: '16px 32px 16px',
                        display: 'flex'
                    }}
                >
                    {handleSendTest()}
                    {sendTestPrompt && (
                        <Dialog
                            buttonPrimaryText="Cancel"
                            buttonSecondaryText="Send Test"
                            primaryOnClick={this.handleSendTestPrompt}
                            secondaryOnClick={() => {
                                this.props.sendTestNotification(
                                    this.props.campaignId,
                                    selectedTestDevices
                                )
                                this.handleSendTestPrompt()
                            }}
                            isOpen={sendTestPrompt}
                            targetParent="overviewComponentRoot"
                            dialogText={promptStr}
                            childStyle={{
                                marginBottom: 32
                            }}
                        />
                    )}
                    <Button
                        text="Publish"
                        size="large"
                        type={publish ? 'primary' : 'disabled'}
                        overrideWidth={114}
                        onClick={publishClick}
                    />
                </div>
            </div>
        )
    }
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        fetchTestDevices: () => {
            dispatch(fetchTestDevices())
        },
        handleSendTestModalDisplay: on => {
            dispatch(handleSendTestModalDisplay(on))
        },
        sendTestNotification: (campaignId, deviceIds) => {
            dispatch(sendTest(campaignId, deviceIds))
        }
    }
}

const mapStatetoProps = (state: State): TestDeviceStateProps => ({
    testDevices: state.testDevices
})

export default connect(mapStatetoProps, mapDispatchToProps)(OverviewModalFooter)
