/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect } from 'react-redux'
import { white, Button } from '@rover/ts-bootstrap/dist/src'
import { getCampaign } from '../../../reducers/campaigns'

import AlertOptionsContainer from './AlertOptionsContainer'
import TapBehaviorContainer from './TapBehaviorContainer'
import AdvancedSettingsContainer from './AdvancedSettingsContainer'

import FormComponent from '../../utils/FormComponent'
import { getIsNotificationDeliveryModalOpen } from '../../../reducers'

import TempMediaAndQuery from './TempMediaAndQuery'

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
                    <TempMediaAndQuery
                        campaign={
                            campaign as
                                | ScheduledCampaign
                                | AutomatedNotificationCampaign
                        }
                        device={device}
                    />
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
                <TapBehaviorContainer
                    campaign={
                        campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign
                    }
                    device={device}
                />
            ),
            advancedSettings: <AdvancedSettingsContainer device={device} />
        }

        const type: UIStateType = 'notification'

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
                    type={type}
                    jsxPages={pages}
                    isNotificationDeliveryModalOpen={
                        isNotificationDeliveryModalOpen
                    }
                    device={device}
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
