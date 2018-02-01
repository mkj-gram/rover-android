/// <reference path="../typings/index.d.ts"/>
import * as React from 'react'
import { cloud, turquoise } from '../styles/colors'

export type ProgressBarThinProps = {
    progress: number
    barPropStyle?: React.CSSProperties
    progressPropStyle?: React.CSSProperties
}

const ProgressBarThin: React.SFC<ProgressBarThinProps> = ({
    progress,
    barPropStyle,
    progressPropStyle
}) => {
    const barStyle: React.CSSProperties = {
        height: 2,
        width: 240,
        overflow: 'hidden' as 'hidden',
        backgroundColor: cloud,
        ...barPropStyle
    }

    const progressStyle: React.CSSProperties = {
        backgroundColor: turquoise,
        width: progress > 3 ? `${progress}%` : 8,
        height: '100%',
        ...progressPropStyle
    }

    return (
        <div style={barStyle}>
            <div style={progressStyle} />
        </div>
    )
}

export default ProgressBarThin
