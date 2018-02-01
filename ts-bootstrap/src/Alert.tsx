/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import { AlertInfoIcon, AlertWarnIcon, AlertErrorIcon } from './Icons'
import {
    turquoise,
    yellow,
    red,
    palefoam,
    paleyellow,
    palered
} from '../styles/colors'
import { small, text } from '../styles/typography'

export interface AlertProps {
    message: string
    type: 'info' | 'warn' | 'custom' | 'error'
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
            borderColor: turquoise,
            backgroundColor: palefoam
        }
    }

    if (type === 'warn') {
        messageStyle = {
            ...messageStyle,
            borderColor: yellow,
            backgroundColor: paleyellow
        }
    }

    if (type === 'error') {
        messageStyle = {
            ...messageStyle,
            borderColor: red,
            backgroundColor: palered
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
            case 'error':
                return (
                    <AlertErrorIcon
                        fill={red}
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
