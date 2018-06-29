import * as React from 'react'

import { connect } from 'react-redux'
import {
    getCampaignDisplayTime,
    getCampaignFormatDate,
    getEditableCampaign
} from '../../reducers'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../utils/getCampaignType'

import {
    GlobeIcon,
    Badge,
    charcoal,
    Text,
    yellow,
    green
} from '@rover/ts-bootstrap/dist/src'

export interface DateAndTimeLabelStateProps {
    getDisplayTime: (campaign: Campaign, timeField: string) => string
    getFormatDate: (campaign: Campaign, dateField: string) => Date
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const DateAndTimeLabel: React.SFC<DateAndTimeLabelStateProps> = ({
    getDisplayTime,
    getFormatDate,
    editableCampaign
}) => {
    if (isScheduledCampaign(editableCampaign)) {
        const {
            scheduledUseLocalDeviceTime,
            scheduledTimeZone
        } = editableCampaign
        const formatDate = getFormatDate(editableCampaign, 'scheduledDate')
        const date = formatDate
            ? formatDate.toLocaleString('en-us', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
              })
            : null

        const displayTime = getDisplayTime(editableCampaign, 'scheduledTime')

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
                style={{
                    marginLeft: 8,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            />
        )
        const formattedDateTime =
            date && editableCampaign.scheduledType === 'SCHEDULED' ? (
                <React.Fragment>
                    <Text size="small" text={`${date} at ${displayTime}`} />
                    {displayTimeZone}
                </React.Fragment>
            ) : null

        switch (editableCampaign.scheduledDeliveryStatus) {
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
            default:
                return <div />
        }
    }

    if (isAutomatedNotificationCampaign(editableCampaign)) {
        // ToDo
    }
}

const mapStateToProps = (state: State): DateAndTimeLabelStateProps => ({
    editableCampaign: getEditableCampaign(state),
    getDisplayTime: (campaign: Campaign, timeField: string) =>
        getCampaignDisplayTime(campaign, timeField),
    getFormatDate: (campaign: Campaign, dateField: string) =>
        getCampaignFormatDate(campaign, dateField)
})

export default connect(
    mapStateToProps,
    {}
)(DateAndTimeLabel)
