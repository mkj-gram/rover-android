import React from 'react'

export default ({ primaryColor, accentColor, amountFilled, amountEmpty }) =>
    <svg width="32px" height="32px" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="5.09295817894" fill="#fff" />
        <circle
            cx="16"
            cy="16"
            r="5.09295817894"
            fill="transparent"
            stroke={primaryColor}
            strokeWidth="3"
        />
        <circle
            cx="16"
            cy="16"
            r="5.09295817894"
            fill="transparent"
            stroke={accentColor}
            strokeWidth="3"
            strokeDasharray={`${amountFilled} ${amountEmpty}`}
            strokeDashoffset="8"
        />
    </svg>
