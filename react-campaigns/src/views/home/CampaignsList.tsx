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
    campaignType: string
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
            {renderCampaignIcon(campaign, media)}
            <div style={{ flex: '1 1 auto' }}>
                <Text text={name} size="large" />
                {renderCampaignProgressState(campaign, media)}
            </div>
            {media !== 'Mobile' &&
                campaignStatus !== 'DRAFT' &&
                renderStat(19302, 'Delivered')}
            {campaignStatus !== 'DRAFT' &&
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

const renderCampaignProgressState = (campaign: Campaign, media: Media) => {
    if (isScheduledCampaign(campaign)) {
        // tslint:disable-next-line:switch-default
        switch (campaign.scheduledDeliveryStatus) {
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
            case 'SCHEDULED':
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
    pushToOverview: (campaignId: string) => void
) => {
    const { campaignId, campaignStatus } = campaign
    if (campaignStatus === 'DRAFT') {
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
        campaign.scheduledDeliveryStatus !== 'UNKNOWN'
            ? (icon = (
                  <GearIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
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
                  />
              ))
            : (icon = (
                  <BarChartIcon
                      fill={charcoal}
                      height="20"
                      width="20"
                      viewBox="0 0 24 24"
                  />
              ))
    }
    return (
        <div style={{ flex: 'none', width: 48 }}>
            {icon}
            <MoreIcon
                fill={charcoal}
                height="20"
                width="20"
                viewBox="0 0 24 24"
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
    style,
    campaignType
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

    return (
        <div style={baseStyle}>
            {Object.keys(campaigns)
                .slice(0)
                .reverse()
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
                        onClick={() => pushToOverview(campaignId)}
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
