/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '../styles/colors'

type ProgressBarProps = {
    children?: JSX.Element
    progress: number
    style: {
        barStyle?: React.CSSProperties
        progressStyle?: React.CSSProperties
    }
}

const ProgressBar: React.SFC<ProgressBarProps> = ({
    progress,
    style,
    children
}: ProgressBarProps) => {
    const barStyle = {
        overflow: 'hidden' as 'hidden',
        width: 240,
        height: 8,
        backgroundColor: cloud,
        borderRadius: 4,
        ...style.barStyle
    }
    const progressStyle = {
        backgroundColor: 'tomato',
        width: progress > 3 ? `${progress}%` : barStyle.height,
        height: '100%',
        borderRadius: 8,
        ...style.progressStyle
    }
    return (
        <div style={barStyle}>
            <div style={progressStyle}>{children}</div>
        </div>
    )
}

export default ProgressBar
