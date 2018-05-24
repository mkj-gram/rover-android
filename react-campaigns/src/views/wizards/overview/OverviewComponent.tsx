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
import {
    getCampaign,
    getEditableCampaign,
    getEditableUIState
} from '../../../reducers'

import { createEditableCampaign } from '../../../actions'
import editableUIState from '../../../reducers/editableUIState'

export interface OwnProps {
    deliveryComplete?: number
    device: Media
}

export interface StateProps {
    campaign: Campaign
    editableCampaign: Campaign
    editableUIState: editableUIState
}

export interface DispatchProps {
    createEditableCampaign: (campaignId: string) => void
}

export type OverviewComponentProps = OwnProps & StateProps & DispatchProps

class OverviewComponent extends React.Component<
    OverviewComponentProps & RouteComponentProps<Location>,
    {}
> {
    constructor(props: OverviewComponentProps & RouteComponentProps<Location>) {
        super(props)
    }

    componentWillMount() {
        const { campaign, createEditableCampaign } = this.props
        createEditableCampaign(campaign.campaignId)
    }

    render() {
        const { campaign, device, editableUIState } = this.props

        if (campaign !== null) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: white,
                        position: 'relative',
                        minHeight: '100%',
                        width: '100%'
                    }}
                    id="overviewComponentRoot"
                >
                    <OverviewModalHeader
                        campaignId={campaign.campaignId}
                        device={device}
                    />
                    <OverviewModalBodyContainer device={device} />

                    <OverviewModalFooter
                        device={device}
                        campaignId={parseInt(campaign.campaignId, 10)}
                    />
                </div>
            )
        } else {
            return <div>Campaign Not Found</div>
        }
    }
}

const mapStateToProps = (
    state: State,
    ownProps: RouteComponentProps<Location>
): StateProps => {
    const { location } = ownProps
    const { campaignId } = parse(location.search.substring(1))

    return {
        campaign: getCampaign(state, campaignId),
        editableCampaign: getEditableCampaign(state),
        editableUIState: getEditableUIState(state)
    }
}

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        createEditableCampaign: campaignId => {
            dispatch(createEditableCampaign(campaignId))
        }
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OverviewComponent)
)
