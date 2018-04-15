/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text } from '@rover/ts-bootstrap/dist/src'

import AdvancedSettingsRowContainer from './AdvancedSettingsRowContainer'
import FormSection from '../../utils/FormSection'

const AdvancedSettingsContainer: React.SFC<InjectedProps> = ({ device }) => {
    const iOSSettings: StringMap<StringMap<string>> = {
        notificationIosSound: {
            displayText: 'Sound',
            description:
                'Add a sound if you want the system to play something other than the default sound when the notification is delivered. The sound file must be in your app’s main bundle or in the Library/Sounds folder.',
            placeholderText: 'Enter path to sound file'
        }
    }

    return (
        <div
            style={{
                padding: device !== 'Mobile' ? '24px 32px' : 24,
                paddingBottom: 0
            }}
        >
            <FormSection>
                <AdvancedSettingsRowContainer
                    device={device}
                    displayText={
                        iOSSettings['notificationIosSound'].displayText
                    }
                    description={
                        iOSSettings['notificationIosSound'].description
                    }
                    field={
                        'notificationIosSound' as
                            | keyof ScheduledCampaign
                            | keyof AutomatedNotificationCampaign
                    }
                    placeholderText={
                        iOSSettings['notificationIosSound'].placeholderText
                    }
                    type="iOS"
                />
            </FormSection>
        </div>
    )
}

export default AdvancedSettingsContainer
