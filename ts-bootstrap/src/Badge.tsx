import * as React from 'react'

import { bold, text as typographyText } from '../styles/typography'

interface BadgeProps {
    color: string
    text: string
    style?: React.CSSProperties
}

const Badge: React.SFC<BadgeProps> = ({ color, style, text }) => {
    let container: React.CSSProperties = {
        ...bold,
        ...typographyText,
        lineHeight: '16px',
        fontSize: 13,
        display: 'inline-block',
        color: color,
        textTransform: 'uppercase',
        ...style
    }

    return <div style={container}>{text}</div>
}

export default Badge
