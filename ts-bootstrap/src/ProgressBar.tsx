/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '../styles/colors'

type ProgressBarProps = {
    children?: JSX.Element
    progress: number
    style: {
        barStyle?: React.CSSProperties
        containerStyle?: React.CSSProperties
        progressStyle?: React.CSSProperties
    }
}

const ProgressBar: React.SFC<ProgressBarProps> = ({
    progress,
    style,
    children
}: ProgressBarProps) => {
    const containerStyle: React.CSSProperties = {
        height: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style.containerStyle
    }
    const barStyle: React.CSSProperties = {
        overflow: 'hidden' as 'hidden',
        width: 240,
        height: 12,
        backgroundColor: cloud,
        borderRadius: 12,
        ...style.barStyle
    }
    const progressStyle: React.CSSProperties = {
        backgroundColor: 'tomato',
        width: progress > 3 ? `${progress}%` : barStyle.height,
        height: '100%',
        borderRadius: 12,
        ...style.progressStyle
    }
    return (
        <div style={containerStyle}>
            <div style={barStyle}>
                <div style={progressStyle}>{children}</div>
            </div>
        </div>
    )
}

export default ProgressBar
