/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import {
    AudioIcon,
    charcoal,
    ImageIcon,
    steel,
    Text,
    VideoIcon
} from '@rover/ts-bootstrap/dist/src'

interface NotificationAttachmentURLProps {
    notificationAttachment: NotificationAttachment
}

const NotificationAttachmentURL: React.SFC<NotificationAttachmentURLProps> = ({
    notificationAttachment
}) => {
    const { type, url } = notificationAttachment
    const getIcon = () => {
        const iconStyle = { flex: 'none' }
        switch (type) {
            case 'IMAGE':
                return (
                    <ImageIcon
                        fill={charcoal}
                        height="20"
                        style={iconStyle}
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'AUDIO':
                return (
                    <AudioIcon
                        fill={charcoal}
                        style={iconStyle}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'VIDEO':
                return (
                    <VideoIcon
                        fill={charcoal}
                        style={iconStyle}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            default:
                return null
        }
    }

    return (
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <Text
                text="Rich Media Attachment"
                size="small"
                label={true}
                textStyle={{ color: steel }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {getIcon()}
                <Text
                    size="large"
                    text={url}
                    textStyle={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: 8,
                        marginRight: 16
                    }}
                />
            </div>
        </div>
    )
}

export default NotificationAttachmentURL
