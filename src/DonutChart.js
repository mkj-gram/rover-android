import React from 'react'

export default ({ primaryColor, accentColor, amountFilled, amountEmpty }) =>
    <svg width="40px" height="40px" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="9" fill="#fff" />
        <circle
            cx="20"
            cy="20"
            r="15"
            fill="transparent"
            stroke={primaryColor}
            strokeWidth="10"
        />
        <circle
            cx="20"
            cy="20"
            r="15"
            fill="transparent"
            stroke={accentColor}
            strokeWidth="10"
            strokeDasharray={`${amountFilled} ${amountEmpty}`}
            strokeDashoffset="10"
        />
    </svg>
