/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'
const { Fragment } = React
import * as moment from 'moment'
import { white, almostWhite, titanium, silver, yellow } from '../styles/colors'
import {
    Phone,
    AlertOptionsBadgeNumber,
    AlertOptionsNotificationCenter,
    AlertOptionsPushNotification
} from './Icons'

export type PhoneComponentProps = {
    children?: React.ReactChild
    notificationType?: string
    device?: 'Mobile' | 'Tablet' | 'Desktop'
    viewLockScreen: boolean
}

const renderLockScreen = (device: 'Mobile' | 'Tablet' | 'Desktop') => {
    const currTime = moment().format('H:mm')

    let leftStyle
    if (currTime.length === 4) {
        if (device !== 'Mobile') {
            leftStyle = 109
        } else {
            leftStyle = 85
        }
    } else {
        if (device !== 'Mobile') {
            leftStyle = 72
        } else {
            leftStyle = 53
        }
    }

    if (device === 'Mobile') {
        return (
            <Fragment>
                <div
                    style={{
                        position: 'absolute',
                        top: 70.55,
                        left: leftStyle,
                        fontFamily: 'HelveticaNeue-Thin, Helvetica Neue',
                        fontSize: 87,
                        fontWeight: 300,
                        color: silver,
                        zIndex: 10
                    }}
                >
                    {currTime}
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: 166.548,
                        fontFamily: 'HelveticaNeue-Thin, Helvetica Neue',
                        fontSize: 22,
                        fontWeight: 200,
                        color: silver,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        zIndex: 10
                    }}
                >
                    {moment().format('dddd, MMMM D')}
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <div
                style={{
                    position: 'absolute',
                    top: 160,
                    left: leftStyle,
                    fontFamily: 'HelveticaNeue-Thin, Helvetica Neue',
                    fontSize: 87,
                    fontWeight: 300,
                    color: silver,
                    zIndex: 10
                }}
            >
                {currTime}
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: 256,
                    fontFamily: 'HelveticaNeue-Thin, Helvetica Neue',
                    fontSize: 22,
                    fontWeight: 200,
                    color: silver,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    zIndex: 10
                }}
            >
                {moment().format('dddd, MMMM D')}
            </div>
        </Fragment>
    )
}

const PhoneComponent: React.SFC<PhoneComponentProps> = ({
    children,
    device,
    viewLockScreen
}: PhoneComponentProps) => {
    if (device === 'Mobile') {
        return (
            <div
                style={{
                    padding: 2,
                    border: `1px solid ${titanium}`,
                    borderRadius: 11,
                    height: 575,
                    width: 326,
                    position: 'relative',
                    marginTop: 24
                }}
            >
                <div
                    style={{
                        borderRadius: 8,
                        border: '1px solid transparent',
                        overflow: 'hidden',
                        height: 568,
                        width: 320
                    }}
                >
                    {children}
                </div>
                {viewLockScreen && renderLockScreen(device)}
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', width: 368, height: 755 }}>
            <Phone fill={device === 'Tablet' ? almostWhite : white} />

            <div
                style={{
                    position: 'absolute',
                    top: 96,
                    left: 24,
                    height: 568
                }}
            >
                {children}
            </div>
            {viewLockScreen && renderLockScreen(device)}
        </div>
    )
}

export default PhoneComponent
