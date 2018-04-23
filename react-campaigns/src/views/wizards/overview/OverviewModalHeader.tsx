/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps, Redirect } from 'react-router'
import {
    renameCampaign,
    duplicateCampaign,
    archiveCampaign
} from '../../../actions/campaigns'
import { getCampaign } from '../../../reducers'
import { handleOverviewModalDisplay } from '../../../actions'
import { Link } from 'react-router-dom'
import * as H from 'history'

import {
    turquoise,
    white,
    CloseIcon,
    MoreIcon,
    Text,
    PopoverContainer,
    titanium
} from '@rover/ts-bootstrap/dist/src'

import ShowMorePopoverChildren from '../../utils/ShowMorePopoverChildren'

export interface OverviewModalHeaderProps extends InjectedProps {
    onExit?: () => void
    onMore?: () => void
    campaignId?: string
}

export type OverviewModalHeaderState = {
    showPopover: boolean
    rename: boolean
}

export interface RouterProps {
    history: H.History
    location: H.Location
}

export interface DispatchProps {
    renameCampaign: (name: string, campaignId: number) => void
    duplicateCampaign: (name: string, campaignId: number) => void
    archiveCampaign: (campaignId: number) => void
    handleOverviewModalDisplay: (history: H.History, open: boolean) => void
}

export type StateProps = {
    campaignName: string
    campaignType: string
}

class OverviewModalHeader extends React.Component<
    OverviewModalHeaderProps &
        DispatchProps &
        StateProps &
        RouterProps &
        // tslint:disable-next-line:no-any
        RouteComponentProps<any>,
    OverviewModalHeaderState
> {
    constructor(
        props: OverviewModalHeaderProps &
            DispatchProps &
            StateProps &
            RouterProps &
            // tslint:disable-next-line:no-any
            RouteComponentProps<any>
    ) {
        super(props)
        this.state = {
            showPopover: false,
            rename: false
        }
        this.handleShowMore = this.handleShowMore.bind(this)
        this.getCampaignType = this.getCampaignType.bind(this)
        this.handleShowMoreSelection = this.handleShowMoreSelection.bind(this)
        this.handleRename = this.handleRename.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.getTextStyle = this.getTextStyle.bind(this)
    }

    handleShowMore() {
        this.setState({
            showPopover: !this.state.showPopover
        })
    }

    getCampaignType(val: string) {
        switch (val) {
            case 'SCHEDULED_NOTIFICATION': {
                return 'Scheduled Notification Campaign'
            }
            case 'AUTOMATED_NOTIFICATION': {
                return 'Automated Notification Campaign'
            }
            default: {
                return 'ERROR'
            }
        }
    }

    handleShowMoreSelection(val: string) {
        const {
            campaignName,
            campaignId,
            archiveCampaign,
            duplicateCampaign
        } = this.props

        if (val === 'Rename') {
            this.setState({
                rename: true,
                showPopover: false
            })
        } else if (val === 'Duplicate') {
            this.setState(
                {
                    showPopover: false
                },
                () =>
                    duplicateCampaign(
                        `${campaignName}- Copy`,
                        parseInt(campaignId, 10)
                    )
            )
        } else if (val === 'Archive') {
            this.setState(
                {
                    showPopover: false
                },
                () => archiveCampaign(parseInt(campaignId, 10))
            )
        }
    }

    handleRename(name: string) {
        this.props.renameCampaign(name, parseInt(this.props.campaignId, 10))
        this.setState({
            rename: false
        })
    }

    handleClose() {
        this.props.handleOverviewModalDisplay(this.props.history, false)
    }

    getTextStyle() {
        const { rename } = this.state

        let textStyle: React.CSSProperties = {
            color: white
        }

        if (!rename) {
            textStyle = {
                ...textStyle,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
            }
        }
        return textStyle
    }

    render() {
        const {
            campaignName,
            campaignType,
            onExit,
            onMore,
            device
        } = this.props

        const popoverProps = {
            placement: 'top-end'
        }

        return (
            <div
                style={{
                    height: 152,
                    width: '100%',
                    background: turquoise,
                    flex: 'none'
                }}
            >
                <div
                    style={{
                        margin:
                            device !== 'Mobile'
                                ? '16px 32px 32px 32px'
                                : '16px 24px 32px 24px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div onClick={this.handleClose}>
                            <CloseIcon fill={white} />
                        </div>

                        <PopoverContainer
                            id="moreIcon"
                            popoverProps={popoverProps}
                            targetParent="root"
                            onClick={this.handleShowMore}
                            showPopover={this.state.showPopover}
                        >
                            {[
                                <MoreIcon fill={white} key="moreIcon1" />,
                                <div
                                    style={{
                                        width: 320
                                    }}
                                    key="moreIcon2"
                                >
                                    <ShowMorePopoverChildren
                                        names={[
                                            'Rename',
                                            'Duplicate',
                                            'Archive'
                                        ]}
                                        onClick={this.handleShowMoreSelection}
                                    />
                                </div>
                            ]}
                        </PopoverContainer>
                    </div>
                    <div
                        style={{
                            marginTop: 16,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            height: 40
                        }}
                    >
                        <Text
                            text={campaignName}
                            size="h1"
                            textStyle={this.getTextStyle()}
                            contentEditable={this.state.rename}
                            handleChange={this.handleRename}
                            id="renameCampaign"
                        />
                    </div>
                    <div>
                        <Text
                            text={this.getCampaignType(campaignType)}
                            size="medium"
                            textStyle={{ color: white }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    props: RouterProps & OverviewModalHeaderProps
): DispatchProps => {
    const { location, history } = props
    return {
        renameCampaign: (name, campaignId) => {
            dispatch(renameCampaign(name, campaignId))
        },
        duplicateCampaign: (name, campaignId) => {
            dispatch({
                type: 'CLOSE_OVERVIEW_MODAL'
            })
            setTimeout(() => {
                dispatch(duplicateCampaign(name, campaignId)).then(id => {
                    dispatch({
                        type: 'OPEN_OVERVIEW_MODAL'
                    })
                    let params = location.search.replace(
                        `campaignId=${campaignId}`,
                        `campaignId=${id}`
                    )

                    history.push(`${location.pathname}${params}`)
                })
                // tslint:disable-next-line:align
            }, 500)
        },
        archiveCampaign: campaignId => {
            dispatch({
                type: 'CLOSE_OVERVIEW_MODAL'
            })
            setTimeout(() => {
                dispatch(archiveCampaign(campaignId)).then(complete => {
                    dispatch({
                        type: 'OPEN_OVERVIEW_MODAL'
                    })
                    if (complete) {
                        history.push(`/campaigns/`)
                    }
                })
                // tslint:disable-next-line:align
            }, 500)
        },
        handleOverviewModalDisplay: (_, open) => {
            dispatch(handleOverviewModalDisplay(history, open))
        }
    }
}

const mapStateToProps = (
    state: State,
    ownProps: OverviewModalHeaderProps
): StateProps => {
    const campaign = getCampaign(state, ownProps.campaignId)

    return {
        campaignName: campaign.name,
        campaignType: campaign.campaignType
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OverviewModalHeader)
)
