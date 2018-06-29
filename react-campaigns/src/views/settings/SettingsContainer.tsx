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

import { getEditableCampaign, getCurrentWizard } from '../../reducers'
import {
    createEditableCampaign,
    openWizardModal,
    updateScheduledDeliverySettings,
    updateNotificationSettings
} from '../../actions'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../utils/getCampaignType'

import DateAndTime from '../wizards/ScheduledDelivery/DateAndTime'
import DateAndTimeLabel from './DateAndTimeLabel'
import EditButton from './EditButton'
import ScheduledSettingsForm from './ScheduledSettingsForm'

export interface SettingsContainerStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    currentWizard: UIStateType
}

export interface SettingsContainerDispatchProps {
    createEditableCampaign: (campaignId: string) => void
    openWizardModal: (stateType: UIStateType) => void
    updateScheduledDeliverySettings: () => void
    updateNotificationSettings: () => void
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

    openSelectedWizard(wizard: UIStateType) {
        const { editableCampaign, openWizardModal } = this.props
        if (
            !(
                isScheduledCampaign(editableCampaign) &&
                editableCampaign.scheduledDeliveryStatus === 'FINISHED'
            )
        ) {
            openWizardModal(wizard)
        }
    }

    getWizardSection() {
        const { currentWizard, device } = this.props
        switch (currentWizard) {
            case 'Date and Time':
                return (
                    <DateAndTime device={device} wizardSection="dateAndTime" />
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
            case 'Date and Time':
                return updateScheduledDeliverySettings
            default:
                return null
        }
    }

    render() {
        const { device, currentWizard } = this.props

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
                                this.openSelectedWizard(
                                    'Date and Time' as UIStateType
                                )
                            }
                        >
                            <InverseLabel title="Date and Time">
                                <DateAndTimeLabel />
                            </InverseLabel>
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
    currentWizard: getCurrentWizard(state)
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (
    dispatch: Dispatch<any>
): SettingsContainerDispatchProps => {
    return {
        createEditableCampaign: campaignId => {
            dispatch(createEditableCampaign(campaignId))
        },
        openWizardModal: stateType => dispatch(openWizardModal(stateType)),
        updateScheduledDeliverySettings: () =>
            dispatch(updateScheduledDeliverySettings()),
        updateNotificationSettings: () => dispatch(updateNotificationSettings())
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SettingsContainer)
)
