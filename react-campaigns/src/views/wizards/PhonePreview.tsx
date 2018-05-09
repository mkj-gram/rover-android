/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
const { Fragment } = React
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    NavBar,
    PhoneComponent,
    Text,
    white
} from '@rover/ts-bootstrap/dist/src'

import ResponsiveContainer from '../utils/ResponsiveContainer'

export interface PhonePreviewProps extends ResponsiveContainerProps {
    animation?: string
    buttonLeft?: string
    buttonLeftCallback?: () => void
    buttonRight?: string
    buttonRightCallback?: () => void
    children?: React.ReactChild
    description?: string
    device: Media
    previewTitle?: string
}

const renderPreviewDescription = (description: string, media: Media) => {
    if (description) {
        return (
            <Text
                text={description}
                size="large"
                textStyle={{
                    width: 200,
                    height: 48,
                    display: 'block',
                    margin: `${media === 'Mobile' ? '24px' : '40px'} auto`
                }}
            />
        )
    }
}

const renderFullScreenPreview = (args: PhonePreviewProps) => {
    const {
        animation,
        buttonLeft,
        buttonLeftCallback,
        buttonRight,
        buttonRightCallback,
        children,
        description,
        device,
        previewTitle
    } = args

    const buttonLeftStyle: React.CSSProperties = {
        marginLeft: device === 'Mobile' ? 24 : 32
    }

    const mobileStyle: React.CSSProperties = {
        margin: '0 auto',
        marginTop: 56,
        width: 326,
        animation: 'open ease-out 400ms'
    }

    const style: React.CSSProperties = {
        height: '100%',
        width: '100%',
        animation: animation,
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        overflow: 'hidden'
    }

    const tabletStyle: React.CSSProperties = {
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 64,
        animation: 'open ease-out 600ms',
        flexDirection: 'column'
    }

    return (
        <div style={style}>
            <NavBar
                buttonLeft={buttonLeft}
                buttonLeftCallback={buttonLeftCallback}
                buttonRight={buttonRight}
                buttonRightCallback={buttonRightCallback}
                style={{
                    buttonLeftStyle: { outerStyle: { ...buttonLeftStyle } }
                }}
                title={previewTitle}
            />
            <div style={device === 'Mobile' ? mobileStyle : tabletStyle}>
                {device === 'Mobile' &&
                    renderPreviewDescription(description, device)}
                <PhoneComponent device={device} viewLockScreen={true}>
                    {children}
                </PhoneComponent>
                {device === 'Tablet' &&
                    renderPreviewDescription(description, device)}
            </div>
        </div>
    )
}

const PhonePreview: React.SFC<PhonePreviewProps> = props => {
    const { children, description, device } = props
    if (device === 'Mobile' || device === 'Tablet') {
        return renderFullScreenPreview(props)
    }
    if (device === 'Desktop') {
        return (
            <Fragment>
                <PhoneComponent device={device} viewLockScreen={true}>
                    {children}
                </PhoneComponent>
                {renderPreviewDescription(description, device)}
            </Fragment>
        )
    }
}

export default PhonePreview
