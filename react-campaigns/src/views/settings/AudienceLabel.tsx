/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect } from 'react-redux'
import { getCampaign, getAllSegments } from '../../reducers'
import { Text, Badge, charcoal } from '@rover/ts-bootstrap/dist/src'
import { parse } from 'qs'

export interface AudienceLabelStateProps {
    getCampaign: (campaignId: string) => Campaign
    segments: Array<Segment>
}

const AudienceLabel: React.SFC<AudienceLabelStateProps> = ({
    getCampaign,
    segments
}) => {
    const { campaignId } = parse(location.search.substring(1))
    const campaign = getCampaign(campaignId)
    const { UIState, segmentIds } = campaign as
        | ScheduledCampaign
        | AutomatedNotificationCampaign
    const parsedUIState = JSON.parse(UIState)

    const { audience } = parsedUIState
    const { conditionSelected } = audience
    if (conditionSelected === 'ALL-DEVICES') {
        return (
            <Text
                text="Send notification to all devices"
                size="small"
                textStyle={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            />
        )
    }

    if (segmentIds.length > 0 && segments.length > 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {segmentIds.map((id, index) => (
                    <React.Fragment key={index}>
                        <Text
                            text={
                                segments.filter(s => s.segmentId === id)[0].name
                            }
                            size="small"
                            textStyle={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        />
                        {index !== segmentIds.length - 1 ? (
                            <Badge
                                color={charcoal}
                                text={
                                    conditionSelected === 'ANY' ? 'OR' : 'AND'
                                }
                                style={{
                                    marginLeft: 8,
                                    marginRight: 8
                                }}
                            />
                        ) : null}
                    </React.Fragment>
                ))}
            </div>
        )
    }
    return <div />
}

const mapStateToProps = (state: State): AudienceLabelStateProps => ({
    getCampaign: (campaignId: string) => getCampaign(state, campaignId),
    segments: getAllSegments(state)
})

export default connect(
    mapStateToProps,
    {}
)(AudienceLabel)
