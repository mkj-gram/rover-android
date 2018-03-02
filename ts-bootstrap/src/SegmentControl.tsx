import * as React from 'react'
import { turquoise } from '../styles/colors'

export interface SegmentControlProps {
    children: JSX.Element[]
    style?: React.CSSProperties
}

const SegmentControl: React.SFC<SegmentControlProps> = ({
    children,
    style
}) => {
    const segmentStyle: React.CSSProperties = {
        alignItems: 'center',
        border: `2px solid ${turquoise}`,
        borderRadius: 4,
        display: 'flex',
        height: 24,
        ...style
    }
    return <div style={segmentStyle}>{children}</div>
}

export default SegmentControl
