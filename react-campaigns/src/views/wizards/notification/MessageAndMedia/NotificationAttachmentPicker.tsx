/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    getActivePopover,
    getEditableCampaign,
    getIsPopoverModalFormOpen
} from '../../../../reducers'

import {
    PopoverContainer,
    steel,
    Text,
    titanium
} from '@rover/ts-bootstrap/dist/src'
import NotificationAttachmentURL from './NotificationAttachmentURL'
import RichMediaUpdateButtons from './'
import MobilePopover from '../../components/MobilePopover'
import {
    closePopoverModalForm,
    openPopoverModalForm,
    updateActivePopover
} from '../../../../actions/'

interface NotificationAttachmentPickerStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    isPopoverOpen: string
}

interface NotificationAttachmentPickerProps {
    children: JSX.Element[]
    device: Media
    updateEditingField: () => void
}

interface NotificationAttachmentPickerDispatchProps {
    closePopoverModalForm: () => void
    openPopoverModalForm: () => void
    updateActivePopover: (field: string) => void
}

const NotificationAttachmentPicker: React.SFC<
    NotificationAttachmentPickerStateProps &
        NotificationAttachmentPickerProps &
        NotificationAttachmentPickerDispatchProps
> = ({
    activePopover,
    children,
    closePopoverModalForm,
    device,
    editableCampaign,
    isPopoverOpen,
    openPopoverModalForm,
    updateActivePopover,
    updateEditingField
}) => {
    const { notificationAttachment } = editableCampaign
    const popoverProps = {
        placement: 'left',
        device: device
    }
    const open = () => {
        updateActivePopover('notification-attachment-picker')
        openPopoverModalForm()
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
                updateEditingField()
                updateActivePopover('')
                break
        }
    }
    return (
        <div
            style={{
                height: notificationAttachment ? 96 : 72,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${titanium}`
            }}
            onClick={() =>
                activePopover !== 'notification-attachment-picker' && open()
            }
        >
            {notificationAttachment ? (
                <NotificationAttachmentURL
                    notificationAttachment={notificationAttachment}
                />
            ) : (
                <Text
                    text="Rich Media Attachment"
                    size="large"
                    textStyle={{ flex: '1 1 auto', color: steel }}
                />
            )}
            {notificationAttachment &&
                notificationAttachment.type === 'IMAGE' && (
                    <img
                        src={notificationAttachment.url}
                        style={{
                            height: 48,
                            width: 48,
                            borderRadius: 4,
                            flex: 'none'
                        }}
                    />
                )}
            <div style={{ flex: '0 0 auto', marginLeft: 16 }}>
                {device !== 'Mobile' && (
                    <PopoverContainer
                        id="rich-media-attachment-popover"
                        popoverProps={popoverProps}
                        targetParent={
                            device === 'Desktop'
                                ? 'mainModalView'
                                : 'mainModalLeft'
                        }
                        onClick={
                            activePopover !== 'notification-attachment-picker'
                                ? open
                                : close
                        }
                        showPopover={
                            activePopover === 'notification-attachment-picker'
                        }
                    >
                        {children}
                    </PopoverContainer>
                )}
                {device === 'Mobile' &&
                    activePopover !== 'notification-attachment-picker' &&
                    children[0]}
            </div>
            {device === 'Mobile' &&
                activePopover === 'notification-attachment-picker' &&
                ReactDOM.createPortal(
                    <MobilePopover
                        child={children[1]}
                        animation={isPopoverOpen}
                        navbarProps={{
                            buttonLeftCallback: () => close(),
                            style: {
                                containerStyle: {
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2
                                }
                            }
                        }}
                    />,
                    document.getElementById('mainModalLeft')
                )}
        </div>
    )
}

const mapStateToProps = (
    state: State
): NotificationAttachmentPickerStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state),
    isPopoverOpen: getIsPopoverModalFormOpen(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): NotificationAttachmentPickerDispatchProps => {
    return {
        openPopoverModalForm: () => {
            dispatch(openPopoverModalForm())
        },

        closePopoverModalForm: () => {
            dispatch(closePopoverModalForm())
        },
        updateActivePopover: field => {
            dispatch(updateActivePopover(field))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    NotificationAttachmentPicker
)
