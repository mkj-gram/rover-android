/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect } from 'react-redux'
import { white, Button } from '@rover/ts-bootstrap/dist/src'
import { getCampaign } from '../../../reducers/campaigns'
import AlertOptionsContainer from './AlertOptionsContainer'

import FormComponent from '../../utils/FormComponent'
import { getIsNotificationDeliveryModalOpen } from '../../../reducers'

export interface NotificationContainerProps extends InjectedProps {
    campaigns: StringMap<Campaign>
    isNotificationDeliveryModalOpen: string
}

class NotificationContainer extends React.Component<
    NotificationContainerProps,
    {}
> {
    constructor(props: NotificationContainerProps) {
        super(props)
    }

    render() {
        const campaignId = parse(location.search.substring(1)).campaignId
        const campaign = getCampaign(this.props.campaigns, campaignId)

        const { isNotificationDeliveryModalOpen, device } = this.props
        let animate =
            isNotificationDeliveryModalOpen === 'closing' ? 'close' : 'open'

        const pages: StringMap<JSX.Element> = {
            messageAndMedia: (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Message And Media things
                </div>
            ),
            alertOptions: (
                <AlertOptionsContainer
                    campaign={
                        campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign
                    }
                    device={device}
                />
            ),
            tapBehavior: (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Tap Behavior Page
                </div>
            ),
            advancedSettings: (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Advanced Settings things
                </div>
            )
        }

        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    background: white,
                    animation: `${animate} 500ms ease`
                }}
                id="notificationContainer"
            >
                <FormComponent
                    type="notification"
                    jsxPages={pages}
                    isNotificationDeliveryModalOpen={
                        isNotificationDeliveryModalOpen
                    }
                />
            </div>
        )
    }
}

const mapStateToProps = (state: State): NotificationContainerProps => ({
    campaigns: state.campaigns,
    isNotificationDeliveryModalOpen: getIsNotificationDeliveryModalOpen(state)
})

export default connect(mapStateToProps, {})(NotificationContainer)
