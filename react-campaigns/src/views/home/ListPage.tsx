/// <reference path="../../../typings/index.d.ts"/>

import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps, match as Match } from 'react-router'
import { Route, Link, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import * as H from 'history'
import { parse, stringify } from 'qs'

import { createCampaign, fetchCampaigns } from '../../actions'
import { getAllCampaigns } from '../../reducers'

import NavBar from './NavBar'
import CampaignsList from './CampaignsList'
import OverviewContainer from '../wizards/overview/OverviewContainer'
import ResponsiveContainer from '../utils/ResponsiveContainer'
import ToolBar from './ToolBar'

export interface RouterProps {
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
    StateProps &
        DispatchProps &
        ResponsiveContainerProps &
        RouteComponentProps<RouterProps>,
    {}
> {
    constructor(
        props: StateProps &
            DispatchProps &
            ResponsiveContainerProps &
            RouteComponentProps<RouterProps>
    ) {
        super(props)
        this.createNewCampaign = this.createNewCampaign.bind(this)
        this.pushToOverview = this.pushToOverview.bind(this)
    }

    componentDidMount() {
        this.props.fetchCampaigns()
    }

    componentDidUpdate(
        nextProps: StateProps &
            DispatchProps &
            ResponsiveContainerProps &
            RouterProps
    ) {
        // tslint:disable-next-line:no-shadowed-variable
        const { fetchCampaigns, location } = this.props
        const nextSearch = nextProps.location.search

        if (location.search !== nextSearch) {
            fetchCampaigns()
        }
    }

    createNewCampaign(name: string, type: CampaignType) {
        this.props.createCampaign(name, type)
    }
    getQueryParams(): QueryParams {
        const { location } = this.props
        return parse(location.search.substring(1))
    }
    setListStatus(nextStatus: string) {
        const { history } = this.props

        const newQuery = stringify({
            ...this.getQueryParams(),
            campaignStatus: nextStatus
        })
        history.replace(`/campaigns/?${newQuery}`)
    }
    setListType(nextType: string) {
        const { history } = this.props

        const newQuery = stringify({
            ...this.getQueryParams(),
            campaignType: nextType
        })

        history.replace(`/campaigns/?${newQuery}`)
    }
    setKeyword(keyword: string) {
        const { history } = this.props

        const newQuery = stringify({
            ...this.getQueryParams(),
            keyword
        })

        history.replace(`/campaigns/?${newQuery}`)
    }
    setPageNumber(direction: string) {
        const { history } = this.props
        const params = this.getQueryParams()
        const { pageNumber = '0' } = params

        let nextPageNumber = parseInt(pageNumber, 10)
        if (direction === 'forward') {
            nextPageNumber += 1
        }
        if (direction === 'backward' && nextPageNumber > 0) {
            nextPageNumber -= 1
        }

        const newQuery = stringify({
            ...params,
            pageNumber: nextPageNumber
        })
        history.replace(`/campaigns/?${newQuery}`)
    }
    pushToOverview(campaignId: string) {
        const { history } = this.props
        const params = this.getQueryParams()

        const newQuery = stringify({
            ...params,
            campaignId
        })

        history.replace(`/campaigns/wizard/?${newQuery}`)
    }
    render() {
        const { Fragment } = React
        const { campaigns, device, history, location } = this.props
        const {
            campaignStatus = 'all',
            campaignType = 'all',
            pageNumber = '0',
            keyword,
            campaignId
        } = this.getQueryParams()
        const shouldShowWizard =
            location.pathname === '/campaigns/wizard/' &&
            Object.keys(campaigns).includes(campaignId)
        return (
            <Route
                path={location.pathname}
                render={() => (
                    <Fragment>
                        {shouldShowWizard && (
                            <OverviewContainer device={device} />
                        )}
                        <div
                            style={{
                                width: '100vw',
                                height: '100vh',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'absolute',
                                top: 0,
                                zIndex: 1
                            }}
                        >
                            <NavBar
                                media={device}
                                onCreate={(name: string, type: CampaignType) =>
                                    this.createNewCampaign(name, type)
                                }
                                style={{ flex: '0 0 auto' }}
                                setListStatus={status =>
                                    this.setListStatus(status)
                                }
                                listStatus={campaignStatus}
                                setListType={type => this.setListType(type)}
                                listType={campaignType}
                                setKeyword={(keyword: string) =>
                                    this.setKeyword(keyword)
                                }
                            />
                            <CampaignsList
                                media={device}
                                campaigns={this.props.campaigns}
                                pushToOverview={this.pushToOverview}
                                style={{
                                    flex: '1 1 auto'
                                }}
                            />
                            <ToolBar
                                currentPage={parseInt(pageNumber, 10)}
                                totalCount={623}
                                media={device}
                                onClick={direction =>
                                    this.setPageNumber(direction)
                                }
                                onCreate={(name: string, type: CampaignType) =>
                                    this.createNewCampaign(name, type)
                                }
                            />
                        </div>
                    </Fragment>
                )}
            />
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: RouterProps
): DispatchProps => {
    const {
        campaignStatus = 'all',
        campaignType = 'all',
        pageNumber,
        keyword
    } = parse(location.search.substring(1))
    let nextStatus: CampaignStatus

    switch (campaignStatus) {
        case 'drafts':
            nextStatus = 'DRAFT'
            break
        case 'published':
            nextStatus = 'PUBLISHED'
            break
        case 'all':
            nextStatus = 'UNKNOWN'
            break
        default:
            nextStatus = null
            break
    }
    let nextType: CampaignType
    switch (campaignType) {
        case 'scheduled':
            nextType = 'SCHEDULED_NOTIFICATION'
            break
        case 'automated':
            nextType = 'AUTOMATED_NOTIFICATION'
            break
        case 'all':
        default:
            nextType = 'UNKNOWN'
            break
    }

    return {
        createCampaign: (name, cType) => {
            dispatch(createCampaign(name, cType)).then(campaignId => {
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
                    nextStatus,
                    nextType,
                    parseInt(pageNumber, 10) || 0,
                    keyword
                )
            )
        }
    }
}
const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns
})

export default ResponsiveContainer()(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(ListPage))
)
