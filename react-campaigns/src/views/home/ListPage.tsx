/// <reference path="../../../typings/index.d.ts"/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps, match as Match } from 'react-router'
import { Route, Link, Switch } from 'react-router-dom'
import * as H from 'history'
import { parse, stringify } from 'qs'

import { Alert } from '@rover/ts-bootstrap/dist/src'

import {
    closeCampaignTypeSelector,
    createCampaign,
    fetchCampaign,
    fetchCampaigns,
    fetchExperiences,
    fetchSegments,
    fetchTestDevices,
    handleOpenOverviewModalDisplay
} from '../../actions'
import { getAllCampaigns, getIsError } from '../../reducers'

import NavBar from './NavBar'
import CampaignsList from './CampaignsList'
import OverviewContainer from '../wizards/overview/OverviewContainer'
import ResponsiveContainer from '../utils/ResponsiveContainer'
import ToolBar from './ToolBar'
import { getCampaign } from '../../reducers/campaigns'

export interface RouterProps {
    history: H.History
    location: H.Location
}

export interface DispatchProps {
    closeCampaignTypeSelector: () => void
    createCampaign: (name: string, campaignType: CampaignType) => void
    fetchCampaign: (campaignId: number) => void
    fetchCampaigns: () => void
    fetchExperiences: () => void
    fetchSegments: () => void
    fetchTestDevices: () => void
    handleOpenOverviewModalDisplay: () => void
}

export interface StateProps {
    campaigns: StringMap<Campaign>
    isError: StringMap<boolean | string>
}

export interface ListPageState {}

export type ListPageProps = StateProps &
    DispatchProps &
    ResponsiveContainerProps &
    RouteComponentProps<RouterProps>

class ListPage extends React.PureComponent<ListPageProps, {}> {
    constructor(props: ListPageProps) {
        super(props)
        this.createNewCampaign = this.createNewCampaign.bind(this)
        this.pushToOverview = this.pushToOverview.bind(this)
    }

    componentWillMount() {
        const {
            fetchCampaigns,
            fetchExperiences,
            fetchSegments,
            fetchTestDevices
        } = this.props
        fetchCampaigns()
        fetchExperiences()
        fetchSegments()
        fetchTestDevices()
    }

    componentDidUpdate(
        nextProps: StateProps &
            DispatchProps &
            ResponsiveContainerProps &
            RouterProps
    ) {
        // tslint:disable-next-line:no-shadowed-variable
        const {
            fetchCampaigns,
            location,
            campaigns,
            fetchCampaign
        } = this.props
        const nextSearch = nextProps.location.search

        if (location.search !== nextSearch) {
            fetchCampaigns()
        }

        const { campaignId } = this.getQueryParams()

        if (campaignId && getCampaign(campaigns, campaignId) === null) {
            fetchCampaign(parseInt(campaignId, 10))
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
        const { closeCampaignTypeSelector, history } = this.props

        const newQuery = stringify({
            ...this.getQueryParams(),
            campaignType: nextType
        })

        closeCampaignTypeSelector()
        history.replace(`/campaigns/?${newQuery}`)
    }
    setKeyword(keyword: string) {
        const { history } = this.props

        const newQuery = stringify({
            ...this.getQueryParams(),
            keyword: keyword !== '' ? keyword : undefined
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
        this.props.handleOpenOverviewModalDisplay()
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
                                height: '100%',
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
                                campaignType={campaignType}
                                campaignStatus={campaignStatus}
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
                        {this.props.isError.error &&
                            ReactDOM.createPortal(
                                <div
                                    style={{
                                        zIndex: 20,
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        width: 300,
                                        top: 5,
                                        left: 'calc(50% - 150px)',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Alert
                                        message="Oops! Something went wrong."
                                        type="error"
                                    />
                                </div>,
                                document.getElementById('root')
                            )}
                    </Fragment>
                )}
            />
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: RouterProps & ResponsiveContainerProps
): DispatchProps => {
    const { device } = ownProps
    const { campaignStatus, campaignType, pageNumber, keyword } = parse(
        location.search.substring(1)
    )
    let nextStatus: CampaignStatus

    switch (campaignStatus) {
        case 'drafts':
            nextStatus = 'DRAFT'
            break
        case 'published':
            nextStatus = 'PUBLISHED'
            break
        case 'all':
        default:
            nextStatus = 'UNKNOWN'
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
        closeCampaignTypeSelector: () => {
            if (device === 'Mobile') {
                dispatch({ type: 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR' })
                setTimeout(() => dispatch(closeCampaignTypeSelector()), 295)
            } else {
                dispatch(closeCampaignTypeSelector())
            }
        },
        createCampaign: (name, cType) => {
            dispatch(createCampaign(name, cType)).then(campaignId => {
                let path
                if (campaignId === undefined) {
                    path = ownProps.location.pathname
                } else {
                    if (!ownProps.location.search.includes('?')) {
                        path = `${ownProps.location.pathname}wizard/${
                            ownProps.location.search
                        }?campaignId=${campaignId}`
                    } else {
                        path = `${ownProps.location.pathname}wizard/${
                            ownProps.location.search
                        }&campaignId=${campaignId}`
                    }
                }

                ownProps.history.push(path)
                dispatch(handleOpenOverviewModalDisplay())
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
        },
        fetchCampaign: campaignId => {
            dispatch(fetchCampaign(campaignId)).then(
                () => undefined,
                () => {
                    ownProps.history.replace('/campaigns/')
                }
            )
        },
        fetchExperiences: () => dispatch(fetchExperiences()),
        fetchSegments: () => dispatch(fetchSegments()),
        fetchTestDevices: () => dispatch(fetchTestDevices()),
        handleOpenOverviewModalDisplay: () =>
            dispatch(handleOpenOverviewModalDisplay())
    }
}
const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns,
    isError: getIsError(state)
})

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )((props: ListPageProps) => ResponsiveContainer(props)(ListPage))
)
