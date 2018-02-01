import * as React from 'react'
import {
    ZapIcon,
    CalendarIcon,
    cloud,
    steel,
    titanium,
    Text
} from '@rover/ts-bootstrap/dist/src'

export interface Props {
    campaigns: StringMap<Campaign>
    media: Media
    style?: React.CSSProperties
}

const getCampaignIcon = (status: CampaignStatus, type: CampaignType) => {
    if (type === 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION') {
        switch (status) {
            case 'CAMPAIGN_STATUS_DRAFT':
                return (
                    <CalendarIcon
                        fill={steel}
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
                        fill={steel}
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

const renderCampaign = (campaign: Campaign) => {
    const { campaignId, name, campaignStatus, campaignType } = campaign
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                width: 960
            }}
        >
            <div
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    background: cloud,
                    marginRight: 16,
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {getCampaignIcon(campaignStatus, campaignType)}
            </div>
            <div style={{ height: 40 }}>
                <Text text={name} size="large" />
                <div>{campaignId}</div>
            </div>
        </div>
    )
}
const CampaignsList: React.SFC<Props> = ({ campaigns, media, style }) => {
    const baseStyle: React.CSSProperties = {
        width: '100%',
        paddingLeft: 32,
        paddingRight: 32,
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
                        borderBottom: `1px solid ${titanium}`
                    }}
                >
                    {renderCampaign(campaigns[campaignId])}
                </div>
            ))}
        </div>
    )
}

export default CampaignsList
