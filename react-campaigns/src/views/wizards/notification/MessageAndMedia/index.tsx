/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import MediaQuery from 'react-responsive'
import { InjectedProps } from '../../../utils/ResponsiveContainer'
import {
    Badge,
    Button,
    EyeIcon,
    green,
    PhoneComponent,
    red,
    RefreshIcon,
    steel,
    Tab,
    TabBar,
    Text,
    TextInput,
    titanium,
    turquoise,
    yellow
} from '@rover/ts-bootstrap/dist/src'
import FormSection from '../../../utils/FormSection'
import MessageAndMediaIcon from './MessageAndMediaIcon'
import MessageAndMediaNotification from './MessageAndMediaNotification'
import PhonePreview from '../../PhonePreview'
import { updateEditableCampaign } from '../../../../actions'
import { getEditableCampaign, getEditableUIState } from '../../../../reducers'

import NotificationAttachmentPicker from './NotificationAttachmentPicker'
import RichMediaSelector from './RichMediaSelector'
import RichMediaUpdateButtons from './RichMediaUpdateButtons'

export interface MessageAndMediaProps extends InjectedProps {
    wizardSection: keyof editableUIState
    isCurrentPage?: boolean
}

export interface MessageAndMediaState {
    editingField: 'body' | 'title' | 'url' | ''
    isShowingRichMediaPopover: boolean
    isShowingPhonePreview: boolean
    phonePreviewAnimation: string
    richMediaAttachmentTab: 'IMAGE' | 'AUDIO' | 'VIDEO'
}

export interface MessageAndMediaDispatchProps {
    updateEditableCampaign: (editedField: object) => void
}

export interface MessageAndMediaStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    editableUIState: editableUIState
}

class MessageAndMedia extends React.Component<
    MessageAndMediaProps &
        MessageAndMediaStateProps &
        MessageAndMediaDispatchProps,
    MessageAndMediaState
> {
    constructor(
        props: MessageAndMediaProps &
            MessageAndMediaStateProps &
            MessageAndMediaDispatchProps
    ) {
        super(props)

        const { editableCampaign } = this.props
        this.state = {
            editingField: '',
            isShowingRichMediaPopover: false,
            isShowingPhonePreview: false,
            phonePreviewAnimation: 'open',
            richMediaAttachmentTab: 'IMAGE'
        }

        this.setState = this.setState.bind(this)
    }

    renderBodyLengthBadge(length: number): JSX.Element | null {
        if (length === 0) {
            return
        }
        if (length < 90) {
            return (
                <div>
                    <Badge color={green} text={`${length} CHAR`} />
                    <Text
                        label={true}
                        size="small"
                        text="should fully display on most devices"
                        textStyle={{ color: steel, marginLeft: 8 }}
                    />
                </div>
            )
        }
        if (length >= 90 && length < 148) {
            return (
                <div>
                    <Badge color={yellow} text={`${length} CHAR`} />
                    <Text
                        label={true}
                        size="small"
                        text="may not display on some devices"
                        textStyle={{ color: steel, marginLeft: 8 }}
                    />
                </div>
            )
        }
        if (length >= 148) {
            return (
                <div>
                    <Badge color={red} text={`${length} CHAR`} />
                    <Text
                        label={true}
                        size="small"
                        text="will not fully display on most devices"
                        textStyle={{ color: steel, marginLeft: 8 }}
                    />
                </div>
            )
        }
    }

    renderPreview() {
        const { device, editableCampaign } = this.props
        const { isShowingPhonePreview, phonePreviewAnimation } = this.state
        const {
            notificationAttachment,
            notificationBody,
            notificationTitle
        } = editableCampaign

        const Fragment = React.Fragment
        if (device === 'Desktop') {
            return (
                <MediaQuery minWidth={1140}>
                    {ReactDOM.createPortal(
                        <PhoneComponent device={device} viewLockScreen={true}>
                            <Fragment>
                                <MessageAndMediaIcon />
                                <MessageAndMediaNotification
                                    notificationAttachment={
                                        notificationAttachment
                                    }
                                    notificationBody={notificationBody}
                                    notificationTitle={notificationTitle}
                                />
                            </Fragment>
                        </PhoneComponent>,
                        document.getElementById('mainModalRight')
                    )}
                    {ReactDOM.createPortal(
                        <RefreshIcon
                            fill={steel}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 32
                            }}
                        />,
                        document.getElementById('mainModalRight')
                    )}
                </MediaQuery>
            )
        }

        return (
            isShowingPhonePreview &&
            ReactDOM.createPortal(
                <PhonePreview
                    animation={`${phonePreviewAnimation} ease-out 400ms`}
                    device={device}
                    buttonLeft="Cancel"
                    buttonLeftCallback={() =>
                        this.setState({ phonePreviewAnimation: 'close' }, () =>
                            setTimeout(
                                () =>
                                    this.setState({
                                        isShowingPhonePreview: false
                                    }),
                                400
                            )
                        )
                    }
                    previewTitle="Preview"
                >
                    <Fragment>
                        <MessageAndMediaIcon />
                        <MessageAndMediaNotification
                            notificationAttachment={notificationAttachment}
                            notificationBody={notificationBody}
                            notificationTitle={notificationTitle}
                        />
                    </Fragment>
                </PhonePreview>,
                document.getElementById('mainModalLeft')
            )
        )
    }

    render() {
        const {
            device,
            editableCampaign,
            isCurrentPage,
            updateEditableCampaign
        } = this.props
        const { editingField, richMediaAttachmentTab } = this.state
        const { notificationBody, notificationTitle } = editableCampaign
        return (
            <FormSection device={device} style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text text="Message and Media" size="h1" />

                    {device !== 'Desktop' && (
                        <EyeIcon
                            fill={turquoise}
                            onClick={() =>
                                this.setState({
                                    phonePreviewAnimation: 'open',
                                    isShowingPhonePreview: true
                                })
                            }
                            style={{ marginLeft: 8, marginBottom: 24 }}
                        />
                    )}
                </div>
                {/* Body Text */}
                <TextInput
                    id="notification-body-text"
                    isRequired={true}
                    deleteText={() =>
                        updateEditableCampaign({ notificationBody: '' })
                    }
                    isEditingText={editingField === 'body'}
                    label="Body"
                    media={device}
                    placeholder="Enter the main notification copy"
                    startEditingText={() =>
                        this.setState({
                            editingField: 'body'
                        })
                    }
                    text={notificationBody}
                    updateText={(text: string) =>
                        this.setState(
                            {
                                editingField: ''
                            },
                            () =>
                                updateEditableCampaign({
                                    notificationBody: text
                                })
                        )
                    }
                >
                    {this.renderBodyLengthBadge(notificationBody.length)}
                </TextInput>

                {/* Title */}
                <TextInput
                    id="notification-title-text"
                    deleteText={() =>
                        updateEditableCampaign({ notificationTitle: '' })
                    }
                    isEditingText={editingField === 'title'}
                    label="Title"
                    media={device}
                    startEditingText={() =>
                        this.setState({ editingField: 'title' })
                    }
                    text={notificationTitle}
                    updateText={(text: string) =>
                        this.setState(
                            {
                                editingField: ''
                            },
                            () =>
                                updateEditableCampaign({
                                    notificationTitle: text
                                })
                        )
                    }
                />
                {/* Rich Media Attachments */}
                <NotificationAttachmentPicker device={device}>
                    <RichMediaUpdateButtons device={device} />
                    <RichMediaSelector
                        device={device}
                        isEditingRichMediaURL={editingField === 'url'}
                        richMediaAttachmentTab={richMediaAttachmentTab}
                        updateRichMediaAttachmentTab={(
                            richMediaAttachmentTab,
                            editingField
                        ) =>
                            this.setState({
                                richMediaAttachmentTab,
                                editingField
                            })
                        }
                        updateEditingField={(
                            editingField: 'body' | 'title' | 'url' | '',
                            callback
                        ) => this.setState({ editingField }, callback)}
                    />
                </NotificationAttachmentPicker>
                {isCurrentPage && this.renderPreview()}
            </FormSection>
        )
    }
}

const mapStateToProps = (state: State): MessageAndMediaStateProps => ({
    editableCampaign: getEditableCampaign(state),
    editableUIState: getEditableUIState(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): MessageAndMediaDispatchProps => ({
    updateEditableCampaign: (x: object) => dispatch(updateEditableCampaign(x))
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageAndMedia)
