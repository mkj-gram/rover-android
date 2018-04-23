/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { InjectedProps } from '../../utils/ResponsiveContainer'
import { Text } from '@rover/ts-bootstrap/dist/src'
import AlertOptionsRows from './AlertOptionsRows'
import FormSection from '../../utils/FormSection'

export interface AlertsOptionsProps extends InjectedProps {
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
    wizardSection: keyof editableUIState
}

class AlertOptionsContainer extends React.Component<AlertsOptionsProps, {}> {
    constructor(props: AlertsOptionsProps) {
        super(props)
    }

    render() {
        const { device, campaign } = this.props

        return (
            <FormSection
                device={device}
                style={{ paddingLeft: 0, paddingRight: 0 }}
            >
                <div
                    style={{
                        padding:
                            device !== 'Mobile'
                                ? '24px 32px 8px 32px'
                                : '24px 32px 8px 24px'
                    }}
                >
                    <Text text="Alert Options" size="h1" />
                </div>
                <div
                    style={{
                        padding:
                            device !== 'Mobile'
                                ? '0px 32px 24px 32px'
                                : '0px 24px 24px 24px'
                    }}
                >
                    <Text
                        text="How should the user be alerted when the notification is delivered?"
                        size="medium"
                    />
                </div>
                <AlertOptionsRows device={device} campaign={campaign} />
            </FormSection>
        )
    }
}

export default AlertOptionsContainer
