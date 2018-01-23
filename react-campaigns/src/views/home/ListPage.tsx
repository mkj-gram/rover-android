import * as React from 'react'
import { createCampaign, fetchCampaigns } from '../../actions'
import { getAllCampaigns } from '../../reducers'
import { connect, Dispatch } from 'react-redux'
import { Action } from 'redux'

import { ThunkAction } from 'redux-thunk'
import MediaQuery from 'react-responsive'

import NavBar from './NavBar'
import CampaignsList from './CampaignsList'

export interface OwnProps {
    campaignStatus: CampaignStatus
    campaignType: CampaignType
    pageNumber: number
    keyword: string
}

export interface DispatchProps {
    fetchCampaigns: () => void
    createCampaign: (name: string, campaignType: CampaignType) => void
}

export interface StateProps {
    campaigns: StringMap<Campaign>
}

class ListPage extends React.PureComponent<
    StateProps & DispatchProps & OwnProps,
    {}
> {
    constructor(props: StateProps & DispatchProps & OwnProps) {
        super(props)
        this.handleCreateClick = this.handleCreateClick.bind(this)
    }
    componentDidMount() {
        this.props.fetchCampaigns()
    }
    handleCreateClick() {
        this.props.createCampaign(
            'newCampaign',
            'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION'
        )
    }
    render() {
        return (
            <div>
                {/*Desktop*/}
                <MediaQuery minDeviceWidth={769} minWidth={769}>
                    <div
                        style={{
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <NavBar
                            media="Desktop"
                            onCreate={this.handleCreateClick}
                            style={{ flex: '0 0 auto' }}
                        />
                        <CampaignsList
                            media="Desktop"
                            campaigns={this.props.campaigns}
                            style={{
                                flex: '1 1 auto'
                            }}
                        />
                    </div>
                </MediaQuery>
                {/*Tablet*/}
                <MediaQuery
                    maxDeviceWidth={768}
                    maxWidth={768}
                    minDeviceWidth={376}
                    minWidth={376}
                >
                    <NavBar media="Tablet" onCreate={this.handleCreateClick} />
                    <CampaignsList
                        media="Tablet"
                        campaigns={this.props.campaigns}
                    />
                </MediaQuery>
                {/*Mobile*/}
                <MediaQuery maxDeviceWidth={375} maxWidth={375}>
                    <NavBar media="Mobile" onCreate={this.handleCreateClick} />
                    <CampaignsList
                        media="Mobile"
                        campaigns={this.props.campaigns}
                    />
                </MediaQuery>
                {/* {Object.keys(this.props.campaigns).map((campaignId, index) => (
                    <div key={index}>
                        {JSON.stringify(this.props.campaigns[campaignId])}
                    </div>
                ))} */}
            </div>
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: OwnProps
): DispatchProps => {
    const { campaignStatus, campaignType, pageNumber, keyword } = ownProps
    return {
        createCampaign: (name, cType) => dispatch(createCampaign(name, cType)),
        fetchCampaigns: () =>
            dispatch(
                fetchCampaigns(
                    campaignStatus,
                    campaignType,
                    pageNumber,
                    keyword
                )
            )
    }
}
const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns
})

export default connect(mapStateToProps, mapDispatchToProps)(ListPage)
