/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { fetchTestDevices, handleSendTestModalDisplay } from '../../../actions'

import { getTypeProgress, getTestDevices } from '../../../reducers'

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
import SendTestConfirmationDialog from './SendTestConfirmationDialog'
import PublishCampaignConfirmationDialog from './PublishCampaignConfirmationDialog'

export interface OverviewModalFooterProps extends InjectedProps {
    sendTestClick?: () => void
    publishClick?: () => void
    campaignId: number
}

export interface OverviewModalFooterState {
    toggleSendTest: boolean
    sendTestPrompt: boolean
    showPublishCampaignDialog: boolean
}

export interface DispatchProps {
    handleSendTestModalDisplay: (on?: boolean) => void
}

export interface TestDeviceStateProps {
    scheduledDeliveryProgress: number
    notificationProgress: number
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
            showPublishCampaignDialog: false
        }
        this.handleSendTestToggle = this.handleSendTestToggle.bind(this)
        this.handleSendTestPrompt = this.handleSendTestPrompt.bind(this)
        this.handlePublishCampaignPrompt = this.handlePublishCampaignPrompt.bind(
            this
        )
    }

    handleSendTestToggle(on?: boolean) {
        const { device } = this.props
        const { notificationProgress } = this.props

        if (notificationProgress === 100) {
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

    handlePublishCampaignPrompt() {
        this.setState({
            showPublishCampaignDialog: !this.state.showPublishCampaignDialog
        })
    }

    render() {
        const {
            scheduledDeliveryProgress,
            notificationProgress,
            device,
            publishClick,
            testDevices,
            campaignId
        } = this.props

        const {
            toggleSendTest,
            sendTestPrompt,
            showPublishCampaignDialog
        } = this.state

        const getPopoverTrigger = () => {
            const popoverProps = {
                placement: 'top'
            }
            const node = (
                <div
                    style={{
                        height: 312,
                        width: 384
                    }}
                    key="sendTest2"
                >
                    <SendTestComponent
                        device={device}
                        buttonLeftCallback={() =>
                            this.handleSendTestToggle(false)
                        }
                        listOfTestDevices={testDevices}
                        buttonRightCallback={this.handleSendTestPrompt}
                    />
                </div>
            )

            const trigger = (
                <Button
                    text="Send a Test"
                    size="large"
                    type={
                        notificationProgress === 100 ? 'secondary' : 'disabled'
                    }
                    overrideWidth={114}
                    style={{ outerStyle: { marginRight: 16 } }}
                    key="sendTest1"
                    onClick={() => {
                        if (device !== 'Desktop') {
                            this.handleSendTestToggle(true)
                        }
                    }}
                />
            )

            if (device !== 'Mobile') {
                return (
                    <PopoverContainer
                        id="sendTest"
                        popoverProps={popoverProps}
                        targetParent="root"
                        onClick={this.handleSendTestToggle}
                        showPopover={this.state.toggleSendTest}
                    >
                        {[trigger, node]}
                    </PopoverContainer>
                )
            } else {
                const Fragment = React.Fragment

                return (
                    <Fragment>
                        {trigger}
                        {toggleSendTest &&
                            ReactDOM.createPortal(
                                node,
                                document.getElementById('overviewComponentRoot')
                            )}
                    </Fragment>
                )
            }
        }

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
                    {getPopoverTrigger()}

                    {sendTestPrompt && (
                        <SendTestConfirmationDialog
                            handleSendTestPrompt={this.handleSendTestPrompt}
                            campaignId={campaignId}
                            device={device}
                        />
                    )}

                    <Button
                        text="Publish"
                        size="large"
                        type={
                            notificationProgress === 100 &&
                            scheduledDeliveryProgress === 100
                                ? 'primary'
                                : 'disabled'
                        }
                        overrideWidth={114}
                        onClick={this.handlePublishCampaignPrompt}
                    />
                    {showPublishCampaignDialog && (
                        <PublishCampaignConfirmationDialog
                            campaignId={campaignId}
                            device={device}
                            handlePublishCampaignPrompt={
                                this.handlePublishCampaignPrompt
                            }
                        />
                    )}
                </div>
            </div>
        )
    }
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        handleSendTestModalDisplay: on => {
            dispatch(handleSendTestModalDisplay(on))
        }
    }
}

const mapStatetoProps = (state: State): TestDeviceStateProps => ({
    scheduledDeliveryProgress: getTypeProgress(
        state.editableCampaign,
        state.editableUIState,
        'scheduleddelivery'
    ),
    notificationProgress: getTypeProgress(
        state.editableCampaign,
        state.editableUIState,
        'notification'
    ),
    testDevices: getTestDevices(state)
})

export default connect(
    mapStatetoProps,
    mapDispatchToProps
)(OverviewModalFooter)
