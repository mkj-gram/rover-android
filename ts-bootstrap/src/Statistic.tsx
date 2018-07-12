import * as React from 'react'

import {
    almostWhite,
    charcoal,
    green,
    red,
    steel,
    titanium,
    yellow
} from '../styles/colors'
import { semibold } from '../styles/typography'

import Text from './Text'

export type valueStatus = 'good' | 'bad' | 'ok' | 'N/A'

export interface StatisticProps {
    label: string
    onClick?: () => void
    status?: valueStatus
    style?: React.CSSProperties
    value: string
}

const getOnClickAccent = () => (
    <svg
        style={{ position: 'absolute', top: 5, right: 5 }}
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
    >
        <g
            id="Report-/-Scheduled"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g
                id="Stats"
                transform="translate(-683.000000, -61.000000)"
                fill="#D8D8D8"
            >
                <polygon
                    id="Triangle-2"
                    transform="translate(691.000000, 69.000000) rotate(-180.000000) translate(-691.000000, -69.000000) "
                    points="683 61 699 77 683 77"
                />
            </g>
        </g>
    </svg>
)

const getStyle = (style: object) => ({
    backgroundColor: almostWhite,
    border: `1px solid ${titanium}`,
    height: 128,
    padding: '32px 0',
    textAlign: 'center',
    width: 224,
    ...style
})

const getValueStyle = (status: valueStatus) => {
    switch (status) {
        case 'good':
            return green
        case 'bad':
            return red
        case 'ok':
            return yellow
        case 'N/A':
            return steel
        default:
            return charcoal
    }
}

const Statistic: React.SFC<StatisticProps> = ({
    label,
    onClick,
    status,
    style,
    value
}) => (
    <div onClick={onClick} style={{ position: 'relative', ...getStyle(style) }}>
        {onClick && getOnClickAccent()}
        <Text
            size="h1"
            text={value}
            textStyle={{ color: getValueStyle(status), display: 'block' }}
        />
        <Text size="small" text={label} label={true} />
    </div>
)

export default Statistic
