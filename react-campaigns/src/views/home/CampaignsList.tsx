/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect } from 'react-redux'
import {
    Badge,
    BarChartIcon,
    Button,
    CalendarIcon,
    cloud,
    charcoal,
    GearIcon,
    green,
    ProgressBar,
    red,
    steel,
    titanium,
    turquoise,
    Text,
    yellow,
    ZapIcon,
    ChevronRightIcon,
    silver,
    GlobeIcon
} from '@rover/ts-bootstrap/dist/src'
import {
    getCampaignDisplayTime,
    getCampaignFormatDate,
    getCampaignTotalProgress
} from '../../reducers'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../utils/getCampaignType'

import CampaignsListShowMorePopover from './CampaignsListShowMorePopover'
import getFormattedNumber from '../utils/getFormattedNumber'

export interface Props {
    campaigns: StringMap<Campaign>
    media: Media
    pushToModal: (campaignId: string, route: string) => void
    style?: React.CSSProperties
    campaignType: string
    campaignStatus: QueryParams['campaignStatus']
}

export interface CampaignsListProps {
    getDisplayTime: (campaign: Campaign, timeField: string) => string
    getFormatDate: (campaign: Campaign, dateField: string) => Date
    getTotalProgress: (campaignId: string) => number
}

const getCampaignIcon = (
    status: CampaignStatus,
    type: CampaignType,
    media: Media
) => {
    if (type === 'SCHEDULED_NOTIFICATION') {
        switch (status) {
            case 'DRAFT':
                return (
                    <CalendarIcon
                        fill={titanium}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'PUBLISHED':
                return (
                    <CalendarIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'ARCHIVED':
                return (
                    <CalendarIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            default:
                return (
                    <CalendarIcon
                        fill="red"
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
        }
    } else if (type === 'AUTOMATED_NOTIFICATION') {
        switch (status) {
            case 'DRAFT':
                return (
                    <ZapIcon
                        fill={titanium}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'PUBLISHED':
                return (
                    <ZapIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'ARCHIVED':
                return (
                    <ZapIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            default:
                return (
                    <ZapIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
        }
    }
}

const renderCampaign = (
    campaign: Campaign,
    getDisplayTime: (campaign: Campaign, timeField: string) => string,
    getFormatDate: (campaign: Campaign, dateField: string) => Date,
    getTotalProgress: (campaignId: string) => number,
    media: Media,
    pushToModal: (campaignId: string, route: string) => void
) => {
    const {
        name,
        notificationDeliveredReport,
        notificationOpenedReport,
        scheduledDeliveryStatus
    } = campaign as ScheduledCampaign

    // ToDo: AutomatedNotificationCampaign field to determine UI

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                maxWidth: 1024,
                margin: 'auto',
                paddingLeft: media === 'Desktop' ? 32 : 0,
                paddingRight: media === 'Desktop' ? 32 : 0
            }}
        >
            {renderCampaignIcon(campaign, media)}
            <div style={{ flex: '1 1 auto' }}>
                <Text text={name} size="large" />
                {renderCampaignProgressState(
                    campaign,
                    media,
                    getFormatDate,
                    getDisplayTime,
                    getTotalProgress
                )}
            </div>
            {scheduledDeliveryStatus === 'FINISHED' &&
                media !== 'Mobile' &&
                renderStat(
                    notificationDeliveredReport.uniqueDelivered
                        ? notificationDeliveredReport.uniqueDelivered
                        : 0,
                    'Delivered'
                )}
            {scheduledDeliveryStatus === 'FINISHED' &&
                media === 'Desktop' &&
                renderStat(
                    notificationOpenedReport.unique
                        ? notificationOpenedReport.unique
                        : 0,
                    'Opened'
                )}
            {media === 'Desktop' ? (
                renderListButtons(campaign, pushToModal)
            ) : (
                <ChevronRightIcon fill={titanium} />
            )}
        </div>
    )
}

const renderCampaignIcon = (campaign: Campaign, media: Media) => {
    const { campaignStatus, campaignType } = campaign
    let style: React.CSSProperties = {
        height: 40,
        width: 40,
        borderRadius: 40,
        border: 'none',
        background: cloud,
        marginRight: 16,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
    if (campaignStatus === 'DRAFT') {
        style = {
            ...style,
            background: undefined,
            border: `2px dashed ${titanium}`
        }
    }
    return (
        <div style={style}>
            {getCampaignIcon(campaignStatus, campaignType, media)}
        </div>
    )
}

const renderCampaignProgressState = (
    campaign: Campaign,
    media: Media,
    getFormatDate: (campaign: Campaign, dateField: string) => Date,
    getDisplayTime: (campaign: Campaign, timeField: string) => string,
    getTotalProgress: (campaignId: string) => number
) => {
    if (isScheduledCampaign(campaign)) {
        const { scheduledUseLocalDeviceTime, scheduledTimeZone } = campaign
        const formatDate = getFormatDate(campaign, 'scheduledDate')
        const date = formatDate
            ? formatDate.toLocaleString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
              })
            : null

        const displayTime = getDisplayTime(campaign, 'scheduledTime')

        const displayTimeZone = scheduledUseLocalDeviceTime ? (
            <GlobeIcon
                fill={charcoal}
                height="12"
                width="12"
                viewBox="0 0 24 24"
                style={{ marginLeft: 8 }}
            />
        ) : (
            <Badge
                color={charcoal}
                text={scheduledTimeZone}
                style={{ marginLeft: 8 }}
            />
        )

        const formattedDateTime =
            date && campaign.scheduledType === 'SCHEDULED' ? (
                <React.Fragment>
                    <Text
                        label={true}
                        size="small"
                        text={`${date} at ${displayTime}`}
                        textStyle={{
                            color: steel
                        }}
                    />
                    {media !== 'Mobile' ? displayTimeZone : null}
                </React.Fragment>
            ) : null

        // tslint:disable-next-line:switch-default
        switch (campaign.scheduledDeliveryStatus) {
            case 'UNKNOWN':
                const progress = getTotalProgress(campaign.campaignId)
                return (
                    <div
                        style={{
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <ProgressBar
                            progress={progress}
                            style={{
                                progressStyle: {
                                    backgroundColor: turquoise
                                },
                                barStyle: {
                                    width: media === 'Mobile' ? 156 : 256
                                },
                                containerStyle: {
                                    marginRight: 16
                                }
                            }}
                        />
                        {media !== 'Mobile' && (
                            <Text size="small" text={`${progress}% complete`} />
                        )}
                    </div>
                )
            case 'SCHEDULED':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={yellow}
                            text="SCHEDULED"
                            style={{ marginRight: 8 }}
                        />
                        {formattedDateTime}
                    </div>
                )
            case 'INPROGRESS':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={yellow}
                            text="IN PROGRESS"
                            style={{ marginRight: 8 }}
                        />
                    </div>
                )
            case 'FINISHED':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={green}
                            text="SENT"
                            style={{ marginRight: 8 }}
                        />
                        {formattedDateTime}
                    </div>
                )
        }
    }
    if (isAutomatedNotificationCampaign(campaign)) {
        let activeState: AutomatedActiveStatus
        // tslint:disable-next-line:switch-default
        switch (activeState) {
            default:
            case 'UNKNOWN':
                return (
                    <div
                        style={{
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <ProgressBar
                            progress={50}
                            style={{
                                progressStyle: {
                                    backgroundColor: turquoise
                                },
                                barStyle: {
                                    width: media === 'Mobile' ? 156 : 256
                                },
                                containerStyle: {
                                    marginRight: 16
                                }
                            }}
                        />
                        {media !== 'Mobile' && (
                            <Text size="small" text={`${50}% complete`} />
                        )}
                    </div>
                )
            case 'UPCOMING':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={yellow}
                            text="UPCOMING"
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            label={true}
                            size="small"
                            text="After Jan 8, 2018"
                        />
                    </div>
                )
            case 'ACTIVE':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={green}
                            text="ACTIVE"
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            label={true}
                            size="small"
                            text="Until Jan 8, 2018"
                        />
                    </div>
                )
            case 'EXPIRED':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline'
                        }}
                    >
                        <Badge
                            color={red}
                            text="EXPIRED"
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            label={true}
                            size="small"
                            text="Until Jan 8, 2018"
                        />
                    </div>
                )
        }
    }
}

const renderListButtons = (
    campaign: Campaign,
    pushToModal: (campaignId: string, route: string) => void
) => {
    const { campaignId, campaignStatus } = campaign

    if (campaignStatus === 'DRAFT') {
        return (
            <Button
                text="Edit"
                size="small"
                type="primary"
                onClick={() => pushToModal(campaignId, 'wizard')}
            />
        )
    }
    let icon
    if (isScheduledCampaign(campaign)) {
        campaign.scheduledDeliveryStatus === 'SCHEDULED'
            ? (icon = (
                  <GearIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                      style={{
                          marginRight: 8
                      }}
                      onClick={e => {
                          e.stopPropagation()
                          pushToModal(campaignId, 'settings')
                      }}
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                      style={{
                          marginRight: 8
                      }}
                      onClick={e => {
                          e.stopPropagation()
                          pushToModal(campaignId, 'report')
                      }}
                  />
              ))
    }

    if (isAutomatedNotificationCampaign(campaign)) {
        campaign.automatedMonday
            ? (icon = (
                  <GearIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                      style={{
                          marginRight: 8
                      }}
                      onClick={e => {
                          e.stopPropagation()
                          pushToModal(campaignId, 'settings')
                      }}
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                      style={{
                          marginRight: 8
                      }}
                      onClick={e => {
                          e.stopPropagation()
                          pushToModal(campaignId, 'report')
                      }}
                  />
              ))
    }
    return (
        <div style={{ flex: 'none', width: 48 }}>
            {icon}
            <CampaignsListShowMorePopover
                campaign={campaign}
                device="Desktop"
                pushToModal={pushToModal}
            />
        </div>
    )
}

const renderStat = (value: number, description: string) => {
    const color = value === 0 ? silver : charcoal

    return (
        <div
            style={{
                width: 144,
                flex: 'none',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Text
                size="large"
                text={getFormattedNumber(value)}
                textStyle={{ color }}
            />
            <Text
                size="small"
                label={true}
                text={description}
                textStyle={{ color }}
            />
        </div>
    )
}

const handleRowClick = (
    campaign: Campaign,
    pushToModal: (campaignId: string, report: string) => void
) => {
    const { campaignId, campaignStatus } = campaign
    if (isScheduledCampaign(campaign)) {
        if (campaignStatus === 'PUBLISHED') {
            pushToModal(campaignId, 'settings')
            return
        }
    }
    pushToModal(campaignId, 'wizard')
}

const CampaignsList: React.SFC<Props & CampaignsListProps> = ({
    campaigns,
    campaignStatus,
    campaignType,
    getDisplayTime,
    getFormatDate,
    getTotalProgress,
    media,
    pushToModal,
    style
}) => {
    const baseStyle: React.CSSProperties = {
        width: '100%',
        paddingLeft: media === 'Mobile' ? 24 : 32,
        paddingRight: media === 'Mobile' ? 24 : 32,
        overflowY: 'scroll',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
    }

    const typeMap: StringMap<CampaignType> = {
        scheduled: 'SCHEDULED_NOTIFICATION',
        automated: 'AUTOMATED_NOTIFICATION',
        interstitial: 'INTERSTITIAL',
        web: 'WEB'
    }

    const statusMap: StringMap<CampaignStatus> = {
        drafts: 'DRAFT',
        published: 'PUBLISHED',
        archived: 'ARCHIVED'
    }

    return (
        <div style={baseStyle}>
            {Object.keys(campaigns)
                .reverse()
                .filter(
                    campaignId =>
                        campaigns[campaignId].campaignStatus ===
                            statusMap[campaignStatus] ||
                        (campaignStatus === 'all' &&
                            campaigns[campaignId].campaignStatus !== 'ARCHIVED')
                )
                .filter(
                    campaignId =>
                        campaigns[campaignId].campaignType ===
                            typeMap[campaignType] || campaignType === 'all'
                )
                .map((campaignId, index) => (
                    <div
                        key={index}
                        style={{
                            width: '100%',
                            height: 95,
                            backgroundColor: 'white',
                            flex: '0 0 auto',
                            borderBottom: `1px solid ${titanium}`
                        }}
                        onClick={() =>
                            handleRowClick(campaigns[campaignId], pushToModal)
                        }
                    >
                        {renderCampaign(
                            campaigns[campaignId],
                            getDisplayTime,
                            getFormatDate,
                            getTotalProgress,
                            media,
                            pushToModal
                        )}
                    </div>
                ))}
        </div>
    )
}

const mapStateToProps = (state: State): CampaignsListProps => ({
    getDisplayTime: (campaign: Campaign, timeField: string) =>
        getCampaignDisplayTime(campaign, timeField),
    getFormatDate: (campaign: Campaign, dateField: string) =>
        getCampaignFormatDate(campaign, dateField),
    getTotalProgress: (campaignId: string) =>
        getCampaignTotalProgress(state, campaignId)
})

export default connect(
    mapStateToProps,
    {}
)(CampaignsList)
