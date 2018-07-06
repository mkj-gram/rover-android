/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { parse } from 'qs'
import { Text } from '@rover/ts-bootstrap/dist/src'

import DeviceTransitionContainer from '../utils/DeviceTransitionContainer'
import OverviewModalHeader from '../wizards/overview/OverviewModalHeader'

import FormSection from '../utils/FormSection'
import Row from '../wizards/components/Row'
import InverseLabel from '../wizards/components/InverseLabel'

import {
    getEditableCampaign,
    getCurrentWizard,
    getCampaign
} from '../../reducers'
import {
    createEditableCampaign,
    openWizardModal,
    updateScheduledDeliverySettings,
    updateNotificationSettings,
    openSettingsPagePhonePreview
} from '../../actions'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../utils/getCampaignType'

import DateAndTime from '../wizards/ScheduledDelivery/DateAndTime'
import DateAndTimeLabel from './DateAndTimeLabel'
import EditButton from './EditButton'
import ScheduledSettingsForm from './ScheduledSettingsForm'
import TapBehaviorLabel from './TapBehaviorLabel'
import TapBehaviorContainer from '../wizards/notification/TapBehaviorContainer'

import MessageAndMedia from '../wizards/notification/MessageAndMedia'
import MessageAndMediaLabel from './MessageAndMediaLabel'
import AlertOptionsLabel from './AlertOptionsLabel'
import AlertOptionsContainer from '../wizards/notification/AlertOptionsContainer'
import AudienceLabel from './AudienceLabel'
import Audience from '../wizards/ScheduledDelivery/Audience'
import AdvancedSettingsContainer from '../wizards/notification/AdvancedSettingsContainer'

export interface SettingsContainerStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    currentWizard: UIStateType | formPage
    getCampaign: (campaignId: string) => Campaign
}

export interface SettingsContainerDispatchProps {
    createEditableCampaign: (campaignId: string) => void
    openWizardModal: (stateType: UIStateType | formPage) => void
    updateScheduledDeliverySettings: () => void
    updateNotificationSettings: () => void
    openSettingsPagePhonePreview: () => void
}

export type SettingsContainerProps = RouteComponentProps<Location> &
    SettingsContainerStateProps &
    InjectedProps &
    SettingsContainerDispatchProps

class SettingsContainer extends React.Component<SettingsContainerProps, {}> {
    constructor(props: SettingsContainerProps) {
        super(props)
        this.getWizardSection = this.getWizardSection.bind(this)
        this.openSelectedWizard = this.openSelectedWizard.bind(this)
        this.getSaveAndClose = this.getSaveAndClose.bind(this)
    }

    componentWillMount() {
        const { createEditableCampaign } = this.props
        const { campaignId } = parse(location.search.substring(1))

        createEditableCampaign(campaignId)
    }

    openSelectedWizard(wizard: formPage) {
        const {
            editableCampaign,
            openWizardModal,
            openSettingsPagePhonePreview
        } = this.props
        if (
            !(
                isScheduledCampaign(editableCampaign) &&
                editableCampaign.scheduledDeliveryStatus === 'FINISHED'
            )
        ) {
            openWizardModal(wizard)

            switch (wizard) {
                case 'messageAndMedia':
                case 'alertOptions':
                case 'tapBehavior':
                    openSettingsPagePhonePreview()
                    break
                default:
                    return
            }
        }
    }

    getWizardSection() {
        const { currentWizard, device, getCampaign } = this.props
        const { campaignId } = parse(location.search.substring(1))
        const campaign = getCampaign(campaignId)
        const { Fragment } = React

        switch (currentWizard) {
            case 'dateAndTime':
                return (
                    <DateAndTime device={device} wizardSection="dateAndTime" />
                )

            case 'audience':
                return <Audience device={device} wizardSection="audience" />

            case 'messageAndMedia':
                return (
                    <MessageAndMedia
                        device={device}
                        wizardSection="messageAndMedia"
                        isCurrentPage={true}
                    />
                )

            case 'alertOptions':
                return (
                    <AlertOptionsContainer
                        device={device}
                        wizardSection="alertOptions"
                    />
                )

            case 'tapBehavior':
                return (
                    <Fragment>
                        <TapBehaviorContainer
                            campaign={
                                campaign as
                                    | ScheduledCampaign
                                    | AutomatedNotificationCampaign
                            }
                            device={device}
                            wizardSection="tapBehavior"
                        />
                        {device === 'Desktop' &&
                            ReactDOM.createPortal(
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 96,
                                        left: 24,
                                        textAlign: 'center',
                                        width: 320,
                                        height: 568,
                                        background:
                                            'white linear-gradient(rgba(233,233,233,1.0), rgba(238,238,238,0.5))',
                                        zIndex: 10
                                    }}
                                />,
                                document.getElementById('phone-bezel')
                            )}
                    </Fragment>
                )
            case 'advancedSettings':
                return (
                    <AdvancedSettingsContainer
                        wizardSection="advancedSettings"
                        device={device}
                    />
                )

            default:
                return null
        }
    }

    getSaveAndClose() {
        const {
            currentWizard,
            updateScheduledDeliverySettings,
            updateNotificationSettings
        } = this.props

        switch (currentWizard) {
            case 'dateAndTime':
            case 'audience':
                return updateScheduledDeliverySettings
            case 'messageAndMedia':
            case 'alertOptions':
            case 'tapBehavior':
            case 'advancedSettings':
                return updateNotificationSettings
            default:
                return null
        }
    }

    render() {
        const { device, currentWizard, editableCampaign } = this.props

        const { campaignId } = parse(location.search.substring(1))

        return (
            <DeviceTransitionContainer device={device}>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white'
                    }}
                >
                    <OverviewModalHeader
                        campaignId={campaignId}
                        device={device}
                    />

                    <FormSection device={device} style={{ marginTop: 24 }}>
                        <Text
                            text="Delivery"
                            size="h2"
                            textStyle={{ marginBottom: 8 }}
                        />
                        <Row
                            onClick={() =>
                                this.openSelectedWizard('dateAndTime')
                            }
                        >
                            <InverseLabel title="Date and Time">
                                <DateAndTimeLabel />
                            </InverseLabel>
                            <EditButton />
                        </Row>

                        <Row
                            onClick={() => this.openSelectedWizard('audience')}
                        >
                            <InverseLabel title="Audience">
                                <AudienceLabel />
                            </InverseLabel>
                            <EditButton />
                        </Row>
                    </FormSection>

                    <FormSection device={device}>
                        <Text
                            text="Notification"
                            size="h2"
                            textStyle={{ marginBottom: 8 }}
                        />
                        <Row
                            onClick={() =>
                                this.openSelectedWizard('messageAndMedia')
                            }
                        >
                            <InverseLabel title="Message and Media">
                                <MessageAndMediaLabel />
                            </InverseLabel>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {editableCampaign &&
                                    editableCampaign.notificationAttachment &&
                                    editableCampaign.notificationAttachment
                                        .type === 'IMAGE' && (
                                        <img
                                            src={
                                                editableCampaign
                                                    .notificationAttachment.url
                                            }
                                            style={{
                                                height: 48,
                                                width: 48,
                                                borderRadius: 4,
                                                flex: 'none',
                                                marginRight:
                                                    device !== 'Mobile'
                                                        ? 16
                                                        : null
                                            }}
                                        />
                                    )}
                                <EditButton />
                            </div>
                        </Row>

                        <Row
                            onClick={() =>
                                this.openSelectedWizard('alertOptions')
                            }
                        >
                            <InverseLabel title="Alert Options">
                                <AlertOptionsLabel />
                            </InverseLabel>
                            <EditButton />
                        </Row>

                        <Row
                            onClick={() =>
                                this.openSelectedWizard('tapBehavior')
                            }
                        >
                            <InverseLabel title="Tap Behavior">
                                <TapBehaviorLabel />
                            </InverseLabel>
                            <EditButton />
                        </Row>

                        <Row
                            onClick={() =>
                                this.openSelectedWizard('advancedSettings')
                            }
                        >
                            <InverseLabel title="Advanced Settings" />
                            <EditButton />
                        </Row>
                    </FormSection>

                    {currentWizard &&
                        ReactDOM.createPortal(
                            <ScheduledSettingsForm
                                device={device}
                                campaignId={campaignId}
                                saveAndClose={this.getSaveAndClose()}
                            >
                                {this.getWizardSection()}
                            </ScheduledSettingsForm>,
                            document.getElementById('mainModalLeft')
                        )}
                </div>
            </DeviceTransitionContainer>
        )
    }
}

const mapStateToProps = (state: State): SettingsContainerStateProps => ({
    editableCampaign: getEditableCampaign(state),
    currentWizard: getCurrentWizard(state),
    getCampaign: (campaignId: string) => getCampaign(state, campaignId)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): SettingsContainerDispatchProps => {
    return {
        createEditableCampaign: campaignId => {
            dispatch(createEditableCampaign(campaignId))
        },
        openWizardModal: stateType => dispatch(openWizardModal(stateType)),
        updateScheduledDeliverySettings: () =>
            dispatch(updateScheduledDeliverySettings()),
        updateNotificationSettings: () =>
            dispatch(updateNotificationSettings()),
        openSettingsPagePhonePreview: () => {
            dispatch(openSettingsPagePhonePreview())
        }
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SettingsContainer)
)
