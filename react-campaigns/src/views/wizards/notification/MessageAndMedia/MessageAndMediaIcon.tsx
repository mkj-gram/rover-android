import * as React from 'react'

export default () => (
    <svg width="320" height="568">
        <defs>
            <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                id="message-media-icon-gradient"
            >
                <stop stopColor="#E9E9E9" offset="0%" />
                <stop stopColor="#EEE" stopOpacity=".5" offset="100%" />
            </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
            <path
                fill="url(#message-media-icon-gradient)"
                d="M0 0h320v568H0z"
            />
            <rect
                fill="#D8D8D8"
                x="106"
                y="524"
                width="108"
                height="4"
                rx="2"
            />
        </g>
    </svg>
)
