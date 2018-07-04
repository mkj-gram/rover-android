import * as React from 'react'
import { connect } from 'react-redux'
import { getEditableCampaign } from '../../reducers'
import { Text } from '@rover/ts-bootstrap/dist/src'

export interface MessageAndMediaLabelStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

const MessageAndMediaLabel: React.SFC<MessageAndMediaLabelStateProps> = ({
    editableCampaign
}) => {
    const { notificationBody } = editableCampaign
    return (
        <Text
            text={notificationBody}
            size="small"
            textStyle={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        />
    )
}

const mapStateToProps = (state: State): MessageAndMediaLabelStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

export default connect(
    mapStateToProps,
    {}
)(MessageAndMediaLabel)
