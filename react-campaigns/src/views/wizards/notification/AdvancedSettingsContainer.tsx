/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

import { getActivePopover } from '../../../reducers'

import AdvancedSettingsRowContainer from './AdvancedSettingsRowContainer'
import FormSection from '../../utils/FormSection'
import FormSwitch from '../components/FormSwitch'

export interface StateProps {
    activePopover: string
}

export interface advancedSettingsContainerProps {
    wizardSection: keyof editableUIState
}

const AdvancedSettingsContainer: React.SFC<
    InjectedProps & StateProps & advancedSettingsContainerProps
> = ({ activePopover, device }) => {
    const Fragment = React.Fragment

    return (
        <Fragment>
            <FormSection device={device} style={{ marginTop: 24 }}>
                <Text text="Advanced Settings" size="h1" />
            </FormSection>

            {/* iOS Settings*/}
            <FormSection device={device}>
                <Text text="iOS" size="h2" />
                <FormSwitch
                    field="notificationIosContentAvailable"
                    displayText="Content Available"
                    hoverable={device === 'Desktop'}
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Sound"
                    description="Add a sound if you want the system to play something other than the default sound when the notification is delivered. The sound file must be in your app’s main bundle or in the Library/Sounds folder."
                    field="notificationIosSound"
                    placeholderText="Enter path to sound file"
                    type="iOS"
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Category Identifier"
                    description=""
                    field="notificationIosCategoryIdentifier"
                    placeholderText="Category Identifier Placeholder"
                    type="iOS"
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Thread Identifier"
                    description=""
                    field="notificationIosThreadIdentifier"
                    placeholderText="Thread Identifier Placeholder"
                    type="iOS"
                />
            </FormSection>

            {/* Android Settings */}
            <FormSection device={device}>
                <Text text="Android" size="h2" />
                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Channel ID"
                    description=""
                    field="notificationAndroidChannelId"
                    placeholderText="Channel ID Placeholder"
                    type="Android"
                />
                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Sound"
                    description=""
                    field="notificationAndroidSound"
                    placeholderText="Tag Placeholder"
                    type="Android"
                />
                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Tag"
                    description=""
                    field="notificationAndroidTag"
                    placeholderText="Tag Placeholder"
                    type="Android"
                />
            </FormSection>
        </Fragment>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    activePopover: getActivePopover(state)
})

export default connect(mapStateToProps, {})(AdvancedSettingsContainer)
