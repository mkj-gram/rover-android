import * as React from 'react'
import { connect } from 'react-redux'
import { getEditableCampaign } from '../../reducers'
import { Text, ExternalLinkIcon, turquoise } from '@rover/ts-bootstrap/dist/src'

export interface TapBehaviorLabelStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const TapBehaviorLabel: React.SFC<TapBehaviorLabelStateProps> = ({
    editableCampaign
}) => {
    const {
        notificationTapBehaviorType,
        notificationTapBehaviorUrl,
        notificationTapPresentationType
    } = editableCampaign
    switch (notificationTapBehaviorType) {
        case 'OPEN_EXPERIENCE':
            return <Text text="Open an Experience" size="small" />
        case 'OPEN_WEBSITE':
            return (
                <div
                    style={{
                        display: 'flex'
                    }}
                >
                    <Text
                        textStyle={{ marginRight: 8 }}
                        text={`Present a website, ${
                            notificationTapPresentationType === 'IN_APP'
                                ? 'within my app'
                                : 'in a browser'
                        }`}
                        size="small"
                    />
                    {notificationTapBehaviorUrl.length !== 0 && (
                        <ExternalLinkIcon
                            fill={turquoise}
                            onClick={e => {
                                e.stopPropagation()
                                window.open(notificationTapBehaviorUrl, 'tab')
                            }}
                        />
                    )}
                </div>
            )
        case 'OPEN_DEEP_LINK':
            return <Text text="Open a deep link" size="small" />
        case 'OPEN_APP':
            return <Text text="Open the app" size="small" />
        default:
            return
    }
}

const mapStateToProps = (state: State): TapBehaviorLabelStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

export default connect(
    mapStateToProps,
    {}
)(TapBehaviorLabel)
