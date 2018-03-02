/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import {
    Badge,
    BarChartIcon,
    Button,
    CalendarIcon,
    cloud,
    charcoal,
    GearIcon,
    green,
    MoreIcon,
    ProgressBar,
    red,
    steel,
    titanium,
    turquoise,
    Text,
    yellow,
    ZapIcon,
    ChevronRightIcon
} from '@rover/ts-bootstrap/dist/src'

export interface Props {
    campaigns: StringMap<Campaign>
    media: Media
    pushToOverview: (campaignId: string) => void
    style?: React.CSSProperties
}

const isScheduledCampaign = (
    campaign: Campaign
): campaign is ScheduledCampaign => {
    return (campaign as ScheduledCampaign).scheduledDeliveryStatus !== undefined
}

const isAutomatedNotificationCampaign = (
    campaign: Campaign
): campaign is AutomatedNotificationCampaign => {
    return (
        (campaign as AutomatedNotificationCampaign).automatedMonday !==
        undefined
    )
}

const getCampaignIcon = (status: CampaignStatus, type: CampaignType) => {
    if (type === 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION') {
        switch (status) {
            case 'CAMPAIGN_STATUS_DRAFT':
                return (
                    <CalendarIcon
                        fill={titanium}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            case 'CAMPAIGN_STATUS_PUBLISHED':
                return (
                    <CalendarIcon
                        fill={steel}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            case 'CAMPAIGN_STATUS_ARCHIVED':
                return (
                    <CalendarIcon
                        fill={steel}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            default:
                return (
                    <CalendarIcon
                        fill="red"
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
        }
    } else if (type === 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION') {
        switch (status) {
            case 'CAMPAIGN_STATUS_DRAFT':
                return (
                    <ZapIcon
                        fill={titanium}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            case 'CAMPAIGN_STATUS_PUBLISHED':
                return (
                    <ZapIcon
                        fill={steel}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            case 'CAMPAIGN_STATUS_ARCHIVED':
                return (
                    <ZapIcon
                        fill={steel}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
            default:
                return (
                    <ZapIcon
                        fill={steel}
                        style={{ transform: `scale(${5 / 6})` }}
                    />
                )
        }
    }
}

const renderCampaign = (
    campaign: Campaign,
    media: Media,
    pushToOverview: (campaignId: string) => void
) => {
    const { campaignId, name, campaignStatus, campaignType } = campaign
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
            {renderCampaignIcon(campaign)}
            <div style={{ flex: '1 1 auto' }}>
                <Text text={name} size="large" />
                {renderCampaignProgressState(campaign, media)}
            </div>
            {media !== 'Mobile' &&
                campaignStatus !== 'CAMPAIGN_STATUS_DRAFT' &&
                renderStat(19302, 'Delivered')}
            {media !== 'Mobile' &&
                campaignStatus !== 'CAMPAIGN_STATUS_DRAFT' &&
                media === 'Desktop' &&
                renderStat(1277, 'Opened')}
            {media === 'Desktop' ? (
                renderListButtons(campaign, pushToOverview)
            ) : (
                <ChevronRightIcon fill={titanium} />
            )}
        </div>
    )
}

const renderCampaignIcon = (campaign: Campaign) => {
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
    if (campaignStatus === 'CAMPAIGN_STATUS_DRAFT') {
        style = {
            ...style,
            background: undefined,
            border: `2px dashed ${titanium}`
        }
    }
    return (
        <div style={style}>{getCampaignIcon(campaignStatus, campaignType)}</div>
    )
}

const renderCampaignProgressState = (campaign: Campaign, media: Media) => {
    if (isScheduledCampaign(campaign)) {
        // tslint:disable-next-line:switch-default
        switch (campaign.scheduledDeliveryStatus) {
            case 'SCHEDULED_DELIVERY_STATUS_UNKNOWN':
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
            case 'SCHEDULED_DELIVERY_STATUS_SCHEDULED':
            case 'SCHEDULED_DELIVERY_STATUS_INPROGRESS':
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
                        <Text
                            label={true}
                            size="small"
                            text="Jan 8, 2018 at 11:00 AM"
                        />
                    </div>
                )
            case 'SCHEDULED_DELIVERY_STATUS_FINISHED':
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
                        <Text
                            label={true}
                            size="small"
                            text="Jan 8, 2018 at 11:00 AM"
                        />
                        <Badge
                            color={charcoal}
                            text="America/Toronto"
                            style={{ marginLeft: 8 }}
                        />
                    </div>
                )
        }
    }
    if (isAutomatedNotificationCampaign(campaign)) {
        let activeState: AutomatedActiveStatus
        // tslint:disable-next-line:switch-default
        switch (activeState) {
            default:
            case 'AUTOMATED_ACTIVE_STATUS_UNKNOWN':
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
            case 'AUTOMATED_ACTIVE_STATUS_UPCOMING':
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
            case 'AUTOMATED_ACTIVE_STATUS_ACTIVE':
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
            case 'AUTOMATED_ACTIVE_STATUS_EXPIRED':
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
    pushToOverview: (campaignId: string) => void
) => {
    const { campaignId, campaignStatus } = campaign
    if (campaignStatus === 'CAMPAIGN_STATUS_DRAFT') {
        return (
            <Button
                text="Edit"
                size="small"
                type="primary"
                onClick={() => pushToOverview(campaignId)}
            />
        )
    }
    let icon
    if (isScheduledCampaign(campaign)) {
        campaign.scheduledDeliveryStatus !== 'SCHEDULED_DELIVERY_STATUS_UNKNOWN'
            ? (icon = (
                  <GearIcon
                      fill={charcoal}
                      style={{ transform: `scale(${5 / 6})` }}
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      style={{ transform: `scale(${5 / 6})` }}
                  />
              ))
    }

    if (isAutomatedNotificationCampaign(campaign)) {
        campaign.automatedMonday
            ? (icon = (
                  <GearIcon
                      fill={charcoal}
                      style={{ transform: `scale(${5 / 6})` }}
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      style={{ transform: `scale(${5 / 6})` }}
                  />
              ))
    }
    return (
        <div style={{ flex: 'none', width: 48 }}>
            {icon}
            <MoreIcon
                fill={charcoal}
                style={{ transform: `scale(${5 / 6})` }}
            />
        </div>
    )
}

const renderStat = (value: number, description: string) => (
    <div
        style={{
            width: 144,
            flex: 'none',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <Text size="large" text={value.toString()} />
        <Text size="small" label={true} text={description} />
    </div>
)

const CampaignsList: React.SFC<Props> = ({
    campaigns,
    media,
    pushToOverview,
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
    return (
        <div style={baseStyle}>
            {Object.keys(campaigns).map((campaignId, index) => (
                <div
                    key={index}
                    style={{
                        width: '100%',
                        height: 95,
                        backgroundColor: 'white',
                        flex: '0 0 auto',
                        borderBottom:
                            index === Object.keys(campaigns).length - 1
                                ? 'none'
                                : `1px solid ${titanium}`
                    }}
                    onClick={() =>
                        media === 'Desktop' ? null : pushToOverview(campaignId)
                    }
                >
                    {renderCampaign(
                        campaigns[campaignId],
                        media,
                        pushToOverview
                    )}
                </div>
            ))}
        </div>
    )
}

export default CampaignsList
