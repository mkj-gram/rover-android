/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { parse } from 'qs'

import { turquoise, white } from '@rover/ts-bootstrap/dist/src'

import OverviewModalHeader from './OverviewModalHeader'
import OverviewModalFooter from './OverviewModalFooter'
import OverviewModalBodyContainer from './OverviewModalBodyContainer'
import ResponsiveContainer from '../../utils/ResponsiveContainer'

import { getCampaign } from '../../../reducers/campaigns'
import { shouldCreateEditableCampaign } from '../../../reducers'

import { createEditableCampaign } from '../../../actions'

export interface OwnProps {
    deliveryComplete?: number
}

export interface StateProps {
    campaigns: StringMap<Campaign>
    shouldCreateEditableCampaign: boolean
}

export interface DispatchProps {
    createEditableCampaign: (campaign: Campaign) => void
}

export type OverviewComponentProps = OwnProps & StateProps & DispatchProps

export interface OverviewComponentState {
    campaign: Campaign
    notificationComplete: number
    deliveryComplete: number
    showExperience: boolean
}

class OverviewComponent extends React.Component<
    OverviewComponentProps & RouteComponentProps<any>,
    OverviewComponentState
> {
    constructor(props: OverviewComponentProps & RouteComponentProps<any>) {
        super(props)
        this.state = {
            campaign: null,
            notificationComplete: 0,
            deliveryComplete: 0,
            showExperience: false
        }
        this.getNotificationComplete = this.getNotificationComplete.bind(this)
        this.getShowExperience = this.getShowExperience.bind(this)
        this.updateCampaignStatus = this.updateCampaignStatus.bind(this)
    }

    componentDidMount() {
        const { campaigns, shouldCreateEditableCampaign } = this.props
        this.updateCampaignStatus(campaigns, shouldCreateEditableCampaign)
    }

    componentWillReceiveProps(nextProps: OverviewComponentProps) {
        const { campaigns, shouldCreateEditableCampaign } = nextProps
        this.updateCampaignStatus(campaigns, shouldCreateEditableCampaign)
    }

    updateCampaignStatus(
        campaigns: StringMap<Campaign>,
        shouldCreateEditableCampaign: boolean
    ) {
        const { createEditableCampaign, location } = this.props
        if (Object.keys(campaigns).length !== 0) {
            const campaignId = parse(location.search.substring(1)).campaignId

            const campaign = getCampaign(campaigns, campaignId)

            createEditableCampaign(campaign)
            const notificationComplete = this.getNotificationComplete(
                campaign.UIState
            )
            const showExperience = this.getShowExperience(campaign.UIState)

            this.setState({
                campaign,
                notificationComplete,
                deliveryComplete: 25,
                showExperience
            })
        }
    }

    getNotificationComplete(uiState: string) {
        if (
            uiState.length === 0 ||
            JSON.parse(uiState).notification === undefined
        ) {
            return 0
        } else {
            let parsedState = JSON.parse(uiState)
            const denominator: number = Object.keys(parsedState.notification)
                .length
            const numerator: number = Object.values(
                parsedState.notification
                // tslint:disable-next-line:no-any
            ).filter((v: any) => v).length
            return Math.round(numerator / denominator * 100)
        }
    }

    getShowExperience(uiState: string) {
        if (
            uiState.length === 0 ||
            JSON.parse(uiState).showExperience === undefined
        ) {
            return false
        } else {
            return JSON.parse(uiState).showExperience
        }
    }

    render() {
        const {
            notificationComplete,
            deliveryComplete,
            showExperience,
            campaign
        } = this.state

        const OverviewModalFooterComponent = ResponsiveContainer({
            // sendTest: notificationComplete === 100,
            sendTest: true,
            publish: deliveryComplete === 100
        })(OverviewModalFooter)

        if (campaign !== null) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: white,
                        position: 'relative',
                        minHeight: '100%'
                    }}
                    id="overviewComponentRoot"
                >
                    <OverviewModalHeader campaignId={campaign.campaignId} />
                    <OverviewModalBodyContainer
                        showExperience={showExperience}
                        notificationComplete={notificationComplete}
                        deliveryComplete={deliveryComplete}
                    />

                    <OverviewModalFooterComponent />
                </div>
            )
        } else {
            return <div>Campaign Not Found</div>
        }
    }
}

const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns,
    shouldCreateEditableCampaign: shouldCreateEditableCampaign(state)
})

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        createEditableCampaign: campaign => {
            dispatch(
                createEditableCampaign(campaign as
                    | ScheduledCampaign
                    | AutomatedNotificationCampaign)
            )
        }
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OverviewComponent)
)
