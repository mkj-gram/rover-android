import * as React from 'react'
import { createCampaign, fetchCampaigns } from '../../actions'
import { getAllCampaigns } from '../../reducers'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Route, Link, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { ThunkAction } from 'redux-thunk'
import MediaQuery from 'react-responsive'
import * as H from 'history'

import NavBar from './NavBar'
import CampaignsList from './CampaignsList'
import OverviewContainer from '../wizards/overview/OverviewContainer'
import ResponsiveContainer from '../utils/ResponsiveContainer'

export interface OwnProps {
    campaignStatus: CampaignStatus
    campaignType: CampaignType
    pageNumber: number
    keyword: string
}

export interface routerProps {
    history: H.History
    location: H.Location
}

export interface DispatchProps {
    fetchCampaigns: () => void
    createCampaign: (name: string, campaignType: CampaignType) => void
}

export interface StateProps {
    campaigns: StringMap<Campaign>
}

export interface ListPageState {}

class ListPage extends React.PureComponent<
    StateProps & DispatchProps & OwnProps & RouteComponentProps<any>,
    ListPageState
> {
    constructor(
        props: StateProps & DispatchProps & OwnProps & RouteComponentProps<any>
    ) {
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
        const Fragment = React.Fragment
        const { match, location } = this.props

        const Overview = ResponsiveContainer()(OverviewContainer)
        return (
            <Fragment>
                <TransitionGroup>
                    <CSSTransition
                        key={location.pathname}
                        classNames="fade"
                        timeout={300}
                    >
                        <Switch location={location}>
                            <Route
                                exact
                                path={`${match.url}/wizard/`}
                                component={Overview}
                            />
                            <Route
                                exact
                                path={match.url}
                                render={() => (
                                    <div>
                                        {/*Desktop*/}
                                        <MediaQuery
                                            minDeviceWidth={769}
                                            minWidth={769}
                                        >
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
                                                    onCreate={
                                                        this.handleCreateClick
                                                    }
                                                    style={{ flex: '0 0 auto' }}
                                                />
                                                <CampaignsList
                                                    media="Desktop"
                                                    campaigns={
                                                        this.props.campaigns
                                                    }
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
                                            <NavBar
                                                media="Tablet"
                                                onCreate={
                                                    this.handleCreateClick
                                                }
                                            />
                                            <CampaignsList
                                                media="Tablet"
                                                campaigns={this.props.campaigns}
                                            />
                                        </MediaQuery>
                                        {/*Mobile*/}
                                        <MediaQuery
                                            maxDeviceWidth={375}
                                            maxWidth={375}
                                        >
                                            <NavBar
                                                media="Mobile"
                                                onCreate={
                                                    this.handleCreateClick
                                                }
                                            />
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
                                )}
                            />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: OwnProps & routerProps
): DispatchProps => {
    const { campaignStatus, campaignType, pageNumber, keyword } = ownProps
    return {
        createCampaign: (name, cType) => {
            dispatch(createCampaign(name, cType)).then(campaignId => {
                // Temp workaround for location.search not having any values
                // ?campaignStatus=all&campaignType=all&pageNumber=1&keyword=test
                let path
                if (!ownProps.location.search.includes('?')) {
                    path = `${ownProps.location.pathname}wizard/${
                        ownProps.location.search
                    }?campaignId=${campaignId}`
                } else {
                    path = `${ownProps.location.pathname}wizard/${
                        ownProps.location.search
                    }&campaignId=${campaignId}`
                }

                ownProps.history.push(path)
            })
        },
        fetchCampaigns: () => {
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
}
const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ListPage)
)
