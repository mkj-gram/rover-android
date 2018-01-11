/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import { AlertInfoIcon, AlertWarnIcon } from './Icons'
import { turquoise, yellow } from '../styles/colors'
import { small, text } from '../styles/typography'

interface AlertProps {
    message: string
    type: 'info' | 'warn' | 'custom'
    style?: StringMap<string | number>
}

const Alert: React.SFC<AlertProps> = ({ message, type, style }) => {
    let messageStyle: StringMap<string | number> = {
        ...small,
        ...text,
        width: 924,
        height: 36,
        border: '2px solid',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        ...style
    }

    if (type === 'info') {
        messageStyle = {
            ...messageStyle,
            borderColor: turquoise
        }
    }

    if (type === 'warn') {
        messageStyle = {
            ...messageStyle,
            borderColor: yellow,
            backgroundColor: `${yellow}10`
        }
    }

    const getAlertIcon = (): JSX.Element => {
        switch (type) {
            case 'info':
                return (
                    <AlertInfoIcon
                        fill={turquoise}
                        style={{ marginLeft: 8, marginRight: 8 }}
                    />
                )
            case 'warn':
                return (
                    <AlertWarnIcon
                        fill={yellow}
                        style={{ marginLeft: 8, marginRight: 8 }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div style={messageStyle}>
            {getAlertIcon()}
            {message}
        </div>
    )
}

export default Alert
