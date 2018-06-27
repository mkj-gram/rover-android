/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { withRouter, RouteComponentProps, Redirect } from 'react-router'
import {
    renameCampaign,
    duplicateCampaign,
    archiveCampaign,
    createEditableCampaign
} from '../../../actions'
import { getCampaign, getDuplicateCampaignName } from '../../../reducers'
import { handleCloseOverviewModalDisplay } from '../../../actions'

import * as H from 'history'

import {
    turquoise,
    white,
    CloseIcon,
    MoreIcon,
    Text,
    PopoverContainer
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
    name: string
}

export interface RouterProps {
    history: H.History
    location: H.Location
}

export interface DispatchProps {
    renameCampaign: (name: string, campaignId: number) => void
    duplicateCampaign: (name: string, campaignId: number) => void
    archiveCampaign: (campaignId: number) => void
    handleCloseOverviewModalDisplay: (history: H.History, path: string) => void
}

export type StateProps = {
    campaignName: string
    campaignType: string
    getDuplicateCampaignName: () => string
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
        const { campaignName } = this.props
        this.state = {
            showPopover: false,
            rename: false,
            name: campaignName
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
            campaignId,
            archiveCampaign,
            duplicateCampaign,
            getDuplicateCampaignName
        } = this.props

        if (val === 'Rename') {
            this.setState({
                rename: true,
                showPopover: false
            })
        } else if (val === 'Duplicate') {
            const newCampaignName = getDuplicateCampaignName()

            this.setState(
                {
                    showPopover: false
                },
                () => {
                    duplicateCampaign(newCampaignName, parseInt(campaignId, 10))
                    setTimeout(
                        () => this.setState({ name: newCampaignName }),
                        250
                    )
                }
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
        const { campaignId, renameCampaign } = this.props

        renameCampaign(name, parseInt(campaignId, 10))
        this.setState({ rename: false, name })
    }

    handleClose() {
        const { location, history, campaignId } = this.props
        const campaignIdRegEx = new RegExp(`[\\&-]?campaignId=${campaignId}`)
        const search = location.search.replace(campaignIdRegEx, '')

        this.props.handleCloseOverviewModalDisplay(
            history,
            `/campaigns/${search}`
        )
    }

    getTextStyle() {
        const { rename } = this.state

        let textStyle: React.CSSProperties = {
            color: white,
            display: 'block'
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
        const { campaignType, device } = this.props

        const { name, rename, showPopover } = this.state

        const popoverProps = {
            placement: 'bottom-end'
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
                            showPopover={showPopover}
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
                            whiteSpace: 'nowrap'
                        }}
                        onClick={() => this.setState({ rename: true })}
                    >
                        <Text
                            text={name}
                            size="h1"
                            textStyle={this.getTextStyle()}
                            contentEditable={rename}
                            handleChange={this.handleRename}
                            handleBlurChange={this.handleRename}
                            onBlurChange={true}
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
            dispatch(duplicateCampaign(name, campaignId)).then(id => {
                let params = location.search.replace(
                    `campaignId=${campaignId}`,
                    `campaignId=${id}`
                )

                dispatch(createEditableCampaign(`${id}`))
                history.push(`${location.pathname}${params}`)
            })
        },
        archiveCampaign: campaignId => {
            dispatch(archiveCampaign(campaignId)).then(complete => {
                if (complete) {
                    const campaignIdRegEx = new RegExp(
                        `[\\&-]?campaignId=${campaignId}`
                    )

                    const search = location.search.replace(campaignIdRegEx, '')

                    history.push(`/campaigns/${search}`)
                }
            })
        },
        handleCloseOverviewModalDisplay: (_, path) => {
            dispatch(handleCloseOverviewModalDisplay(history, path))
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
        campaignType: campaign.campaignType,
        getDuplicateCampaignName: () => getDuplicateCampaignName(campaign)
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(OverviewModalHeader)
)
