/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Text, aquamarine } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

import { getActivePopover } from '../../../reducers'

import AdvancedSettingsRowContainer from './AdvancedSettingsRowContainer'
import FormSection from '../../utils/FormSection'
import FormSwitch from '../components/FormSwitch'

export interface StateProps {
    activePopover: string
}

export interface AdvancedSettingsContainerProps {
    wizardSection: keyof editableUIState
}

const AdvancedSettingsContainer: React.SFC<
    InjectedProps & StateProps & AdvancedSettingsContainerProps
> = ({ activePopover, device }) => {
    const Fragment = React.Fragment

    const hyperlinkWrapper = (linkText: string, href: string) => {
        return (
            <Fragment>
                {' '}
                <a
                    style={{
                        color: aquamarine
                    }}
                    target="_blank"
                    href={href}
                >
                    {linkText}
                </a>{' '}
            </Fragment>
        )
    }

    return (
        <Fragment>
            <FormSection device={device} style={{ marginTop: 24 }}>
                <Text text="Advanced Settings" size="h1" />
            </FormSection>

            {/* iOS Settings*/}
            <FormSection device={device}>
                <Text text="iOS" size="h2" />
                <FormSwitch
                    device={device}
                    field="notificationIosContentAvailable"
                    displayText="Content Available"
                    hoverable={device === 'Desktop'}
                    description={
                        <Fragment>
                            Notifies the app to perform a background update,
                            most commonly used to fetch new data. For more
                            information read
                            {hyperlinkWrapper(
                                'Configuring a Background Update Notification',
                                // tslint:disable-next-line:max-line-length
                                'https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW8'
                            )}
                            from Apple's documentation.
                        </Fragment>
                    }
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Sound"
                    description={
                        <Fragment>
                            Add a sound if you want the system to play something
                            other than the default sound when the notification
                            is delivered. The sound file must be in your app’s
                            main bundle or in the Library/Sounds folder.
                        </Fragment>
                    }
                    field="notificationIosSound"
                    placeholderText="Enter path to sound file"
                    type="iOS"
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Category Identifier"
                    description={
                        <Fragment>
                            The category key used to display custom actions with
                            a remote notification. For more information read
                            {hyperlinkWrapper(
                                'Assigning Custom Actions to a Remote Notification',
                                // tslint:disable-next-line:max-line-length
                                'https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW4'
                            )}
                            from Apple's documentation.
                        </Fragment>
                    }
                    field="notificationIosCategoryIdentifier"
                    placeholderText="Category Identifier Placeholder"
                    type="iOS"
                />

                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Thread Identifier"
                    description={
                        <Fragment>
                            Provide this key with a string value that represents
                            the app-specific identifier for grouping
                            notifications. For more information read
                            {hyperlinkWrapper(
                                'Payload Key Reference',
                                // tslint:disable-next-line:max-line-length
                                'https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html'
                            )}
                            from Apple's documentation.
                        </Fragment>
                    }
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
                    description={
                        <Fragment>
                            Android allows applications to{hyperlinkWrapper(
                                'separate their notifications into categories',
                                'https://developer.android.com/training/notify-user/channels'
                            )}that the user can control individually. Android
                            8.0 (API 26) and later normally require such a
                            channel to be set. Note that such channels must be
                            created and registered manually code-side within
                            your app. <br />
                            <br /> However, if you elect not to set one, Rover
                            will register and use a default, generic channel ID
                            for you instead.
                        </Fragment>
                    }
                    field="notificationAndroidChannelId"
                    placeholderText="Channel ID Placeholder"
                    type="Android"
                />
                <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Sound"
                    description={
                        <Fragment>
                            Add a sound if you want the system to play something
                            other than the default sound when the notification
                            is delivered. The sound file must be in your app's
                            /res/raw/ folder.
                        </Fragment>
                    }
                    field="notificationAndroidSound"
                    placeholderText="Tag Placeholder"
                    type="Android"
                />

                {/* <AdvancedSettingsRowContainer
                    device={device}
                    displayText="Tag"
                    description={<Fragment />}
                    field="notificationAndroidTag"
                    placeholderText="Tag Placeholder"
                    type="Android"
                /> */}
            </FormSection>
        </Fragment>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    activePopover: getActivePopover(state)
})

export default connect(mapStateToProps, {})(AdvancedSettingsContainer)
