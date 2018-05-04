/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import {
    AudioIcon,
    steel,
    Text,
    titanium,
    turquoise,
    VideoIcon
} from '@rover/ts-bootstrap/dist/src'

export interface MessageAndMediaNotificationProps {
    notificationAttachment?: NotificationAttachment
    notificationBody?: string
    notificationTitle?: string
    children?: JSX.Element
}

const MessageAndMediaNotification: React.SFC<
    MessageAndMediaNotificationProps
> = ({
    children,
    notificationAttachment,
    notificationBody,
    notificationTitle
}) => {
    const renderAttachmentIcon = () => {
        switch (notificationAttachment.type) {
            case 'IMAGE':
                return (
                    <img
                        src={notificationAttachment.url}
                        style={{
                            height: 32,
                            width: 32,
                            padding: 0,
                            borderRadius: 4,
                            backgroundColor: titanium,
                            alignSelf: 'flex-end'
                        }}
                    />
                )
            case 'AUDIO':
                return (
                    <div
                        style={{
                            height: 32,
                            width: 32,
                            padding: 6,
                            borderRadius: 4,
                            backgroundColor: titanium,
                            alignSelf: 'flex-end'
                        }}
                    >
                        <AudioIcon
                            fill={steel}
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
                        />
                    </div>
                )
            case 'VIDEO':
            default:
                return (
                    <div
                        style={{
                            height: 32,
                            width: 32,
                            padding: 6,
                            borderRadius: 4,
                            backgroundColor: titanium,
                            alignSelf: 'flex-end'
                        }}
                    >
                        <VideoIcon
                            fill={steel}
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
                        />
                    </div>
                )
        }
    }
    return (
        <div
            style={{
                position: 'absolute',
                top: 205,
                left: 16
            }}
        >
            <div
                style={{
                    width: 288,
                    minHeight: 128,
                    backgroundColor: 'white',
                    border: `3px solid ${turquoise}`,
                    borderRadius: 8,
                    paddingBottom: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'initial',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#acecf4',
                        height: 45,
                        width: '100%',
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0px 13px'
                    }}
                >
                    <div
                        style={{
                            height: 20,
                            width: 20,
                            border: `3px solid ${turquoise}`,
                            borderRadius: 5
                        }}
                    />
                    <div
                        style={{
                            height: 4,
                            width: 20,
                            borderRadius: 4,
                            backgroundColor: turquoise
                        }}
                    />
                </div>
                <Text
                    size="small"
                    textStyle={{
                        marginTop: 20,
                        marginLeft: 12,
                        fontWeight: 'bold',
                        width: '100%',
                        flex: 'none'
                    }}
                    text={notificationTitle}
                />
                <div
                    style={{
                        width: '100%',
                        flex: '1 1 auto',
                        padding: '0px 12px',
                        maxHeight: 72,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text
                        size="small"
                        text={notificationBody}
                        textStyle={{
                            maxWidth: 216,
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    />
                    {notificationAttachment && renderAttachmentIcon()}
                </div>
            </div>
            {children}
        </div>
    )
}

export default MessageAndMediaNotification
