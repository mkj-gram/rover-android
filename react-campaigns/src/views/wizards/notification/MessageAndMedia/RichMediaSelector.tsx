/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    closePopoverModalForm,
    updateActivePopover,
    updateEditableCampaign
} from '../../../../actions/'
import { getEditableCampaign } from '../../../../reducers/'
import {
    Alert,
    Button,
    Tab,
    TabBar,
    Text,
    TextInput,
    titanium
} from '@rover/ts-bootstrap/dist/src/'

interface RichMediaSelectorProps extends InjectedProps {
    isEditingRichMediaURL: boolean
    richMediaAttachmentTab: 'IMAGE' | 'AUDIO' | 'VIDEO'
    updateRichMediaAttachmentTab: (
        richMediaAttachmentTab: 'IMAGE' | 'AUDIO' | 'VIDEO',
        editingField: '' | 'url'
    ) => void
    updateEditingField: (editingField: string, callback?: () => void) => void
}

interface RichMediaSelectorStateProps {
    editableCampaign: AutomatedNotificationCampaign | ScheduledCampaign
}

interface RichMediaSelectorDispatchProps {
    closePopoverModalForm: () => void
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (editedField: object) => void
}

type RichMediaSelectorProp = RichMediaSelectorProps &
    RichMediaSelectorDispatchProps &
    RichMediaSelectorStateProps

const RichMediaSelector: React.SFC<RichMediaSelectorProp> = ({
    closePopoverModalForm,
    editableCampaign,
    device,
    isEditingRichMediaURL,
    richMediaAttachmentTab,
    updateActivePopover,
    updateEditableCampaign,
    updateEditingField,
    updateRichMediaAttachmentTab
}) => {
    const { notificationAttachment } = editableCampaign
    const type = notificationAttachment ? notificationAttachment.type : 'IMAGE'
    const url = notificationAttachment ? notificationAttachment.url : ''
    const getMediaDescription = (): string => {
        switch (richMediaAttachmentTab) {
            case 'IMAGE':
                return 'Images can be in JPG, GIF or PNG format. Transparent backgrounds are not recommended.'
            case 'AUDIO':
                return 'Audio clips can be in AIFF, WAV, MP3 or M4A format.'
            case 'VIDEO':
            default:
                return 'Video clips can be in MPEG, MPEG2, MP4 or AVI format.'
        }
    }
    const close = () => {
        switch (device) {
            case 'Mobile':
                closePopoverModalForm()
                setTimeout(() => {
                    updateActivePopover('')
                }, 500)
                break
            case 'Desktop':
            case 'Tablet':
            default:
                updateActivePopover('')
                break
        }
    }

    const dividerLine = () => (
        <div
            style={{
                height: 1,
                width: device !== 'Mobile' ? 352 : '100%',
                background: titanium
            }}
        />
    )
    const Fragment = React.Fragment
    return (
        <Fragment>
            {device === 'Mobile' && (
                <div
                    style={{
                        margin: 24,
                        marginBottom: 8
                    }}
                >
                    <Text size="h1" text="Add Attachment" />
                </div>
            )}
            <TabBar>
                <Tab
                    val={'Image'}
                    selected={
                        richMediaAttachmentTab[0] +
                        richMediaAttachmentTab.slice(1).toLowerCase()
                    }
                    onClick={() => updateRichMediaAttachmentTab('IMAGE', '')}
                />
                <Tab
                    val={'Audio'}
                    selected={
                        richMediaAttachmentTab[0] +
                        richMediaAttachmentTab.slice(1).toLowerCase()
                    }
                    onClick={() => updateRichMediaAttachmentTab('AUDIO', '')}
                />
                <Tab
                    val={'Video'}
                    selected={
                        richMediaAttachmentTab[0] +
                        richMediaAttachmentTab.slice(1).toLowerCase()
                    }
                    onClick={() => updateRichMediaAttachmentTab('VIDEO', '')}
                />
            </TabBar>

            <div
                style={{
                    padding:
                        device === 'Mobile'
                            ? '0px 24px 24px 24px'
                            : `16px 16px 0 16px`
                }}
            >
                <Text
                    size={device === 'Mobile' ? 'medium' : 'small'}
                    text={getMediaDescription()}
                    textStyle={{
                        margin:
                            device === 'Mobile'
                                ? '24px 0 23px 0'
                                : '0 0 15px 0',
                        width: device !== 'Mobile' ? 352 : '100%'
                    }}
                />
                {dividerLine()}

                <TextInput
                    id="notification-rich-media-attachment"
                    isRequired={true}
                    deleteText={() =>
                        updateEditableCampaign({
                            notificationAttachment: null
                        })
                    }
                    fieldStyle={{
                        padding:
                            device === 'Mobile' ? '24px 0 23px' : '16px 0 15px',
                        border: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    isEditingText={isEditingRichMediaURL}
                    label=""
                    media={device}
                    placeholder={`Enter ${richMediaAttachmentTab.toLowerCase()} ${
                        richMediaAttachmentTab !== 'IMAGE' ? 'clip' : ''
                    } URL`}
                    startEditingText={() => updateEditingField('url')}
                    text={url && type === richMediaAttachmentTab ? url : ''}
                    // tslint:disable-next-line:no-empty
                    handleBlurChange={() => {}}
                    updateText={(text: string) =>
                        updateEditingField('', () => {
                            close()
                            updateEditableCampaign({
                                notificationAttachment: {
                                    type: richMediaAttachmentTab,
                                    url: text
                                }
                            })
                        })
                    }
                    primaryTextSize={device === 'Mobile' ? 'large' : 'medium'}
                />

                {device === 'Mobile' && richMediaAttachmentTab === 'IMAGE'
                    ? dividerLine()
                    : null}
                {richMediaAttachmentTab !== 'IMAGE' && (
                    <React.Fragment>
                        {dividerLine()}
                        <Alert
                            message={`${richMediaAttachmentTab[0] +
                                richMediaAttachmentTab
                                    .slice(1)
                                    .toLowerCase()} not supported on Android`}
                            style={{
                                margin:
                                    device === 'Mobile' ? '24px 0' : '16px 0'
                            }}
                            type="warn"
                        />
                    </React.Fragment>
                )}
            </div>
        </Fragment>
    )
}

const mapStateToProps = (state: State): RichMediaSelectorStateProps => ({
    editableCampaign: getEditableCampaign(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): RichMediaSelectorDispatchProps => ({
    closePopoverModalForm: () => dispatch(closePopoverModalForm()),
    updateActivePopover: field => dispatch(updateActivePopover(field)),
    updateEditableCampaign: (x: object) => dispatch(updateEditableCampaign(x))
})

export default connect(mapStateToProps, mapDispatchToProps)(RichMediaSelector)
