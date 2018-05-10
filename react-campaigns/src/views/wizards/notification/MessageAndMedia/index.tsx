/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
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

import MediaQuery from 'react-responsive'
import NotificationAttachmentPicker from './NotificationAttachmentPicker'
import RichMediaSelector from './RichMediaSelector'
import RichMediaUpdateButtons from './RichMediaUpdateButtons'

export interface MessageAndMediaProps extends InjectedProps {
    wizardSection: keyof editableUIState
    isCurrentPage?: boolean
}

export interface MessageAndMediaState {
    bodyPreview: string
    editingField: 'body' | 'title' | 'url' | ''
    isShowingRichMediaPopover: boolean
    isShowingPhonePreview: boolean
    phonePreviewAnimation: string
    richMediaAttachmentTab: 'IMAGE' | 'AUDIO' | 'VIDEO'
    titlePreview: string
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
        const { notificationBody, notificationTitle } = editableCampaign
        this.state = {
            bodyPreview: notificationBody,
            editingField: '',
            isShowingRichMediaPopover: false,
            isShowingPhonePreview: false,
            phonePreviewAnimation: 'open',
            richMediaAttachmentTab: 'IMAGE',
            titlePreview: notificationTitle
        }

        this.setState = this.setState.bind(this)
    }

    renderBodyLengthBadge(length: number): JSX.Element | null {
        const style = {
            textAlign: 'right',
            marginRight: 16,
            marginTop: 8
        }
        if (length === 0) {
            return
        }
        if (length < 90) {
            return (
                <div style={style}>
                    <Badge color={green} text={`${length} CHARACTERS`} />
                </div>
            )
        }
        if (length >= 90 && length < 148) {
            return (
                <div style={style}>
                    <Badge color={yellow} text={`${length} CHARACTERS`} />
                </div>
            )
        }
        if (length >= 148) {
            return (
                <div style={style}>
                    <Badge color={red} text={`${length} CHARACTERS`} />
                </div>
            )
        }
    }

    renderPreview() {
        const { device, editableCampaign } = this.props
        const {
            bodyPreview,
            isShowingPhonePreview,
            phonePreviewAnimation,
            titlePreview
        } = this.state
        const { notificationAttachment, notificationBody } = editableCampaign

        const Fragment = React.Fragment
        if (device === 'Desktop') {
            return (
                <MediaQuery minWidth={1140}>
                    {ReactDOM.createPortal(
                        <div
                            style={{ position: 'absolute', top: 96, left: 24 }}
                        >
                            <MessageAndMediaIcon />
                            <MessageAndMediaNotification
                                notificationAttachment={notificationAttachment}
                                notificationBody={bodyPreview}
                                notificationTitle={titlePreview}
                            >
                                {this.renderBodyLengthBadge(bodyPreview.length)}
                            </MessageAndMediaNotification>
                        </div>,
                        document.getElementById('phone-bezel')
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
                    buttonLeft="Close"
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
                            notificationBody={bodyPreview}
                            notificationTitle={titlePreview}
                        >
                            {this.renderBodyLengthBadge(bodyPreview.length)}
                        </MessageAndMediaNotification>
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
        const {
            bodyPreview,
            editingField,
            richMediaAttachmentTab,
            titlePreview
        } = this.state
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
                    onInputChange={(bodyPreview: string) =>
                        this.setState({ bodyPreview })
                    }
                    placeholder="Enter the main notification copy"
                    startEditingText={() =>
                        this.setState({
                            editingField: 'body'
                        })
                    }
                    text={bodyPreview}
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
                />

                {/* Title */}
                <TextInput
                    id="notification-title-text"
                    deleteText={() => {
                        this.setState({ titlePreview: '' })
                        updateEditableCampaign({ notificationTitle: '' })
                    }}
                    isEditingText={editingField === 'title'}
                    label="Title"
                    media={device}
                    onInputChange={(titlePreview: string) =>
                        this.setState({ titlePreview })
                    }
                    startEditingText={() =>
                        this.setState({ editingField: 'title' })
                    }
                    text={titlePreview}
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
                <NotificationAttachmentPicker
                    device={device}
                    updateEditingField={() =>
                        this.setState({
                            editingField: ''
                        })
                    }
                >
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
