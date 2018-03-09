/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default () => (
    <svg width="320" height="568">
        <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
                <stop stopColor="#E9E9E9" offset="0%" />
                <stop stopColor="#EEE" stopOpacity=".5" offset="100%" />
            </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
            <path fill="#E9E9E9" d="M0 0h320v568H0z" />
            <rect
                fill="#D8D8D8"
                x="106"
                y="524"
                width="108"
                height="4"
                rx="2"
            />
            <rect fill="#FFF" x="16" y="205" width="288" height="128" rx="8" />
            <path
                d="M24 205h272a8 8 0 0 1 8 8v40H16v-40a8 8 0 0 1 8-8z"
                fill="#ACECF4"
                opacity=".8"
            />
            <rect
                stroke="#2AC5D6"
                strokeWidth="3"
                x="33.5"
                y="220.5"
                width="17"
                height="17"
                rx="4"
            />
            <rect
                stroke="#2AC5D6"
                strokeWidth="3"
                x="17.5"
                y="206.5"
                width="285"
                height="125"
                rx="8"
            />
            <rect fill="#2AC5D6" x="32" y="307" width="170" height="4" rx="2" />
            <rect fill="#2AC5D6" x="33" y="291" width="256" height="4" rx="2" />
            <rect fill="#2AC5D6" x="32" y="275" width="256" height="4" rx="2" />
            <rect fill="#2AC5D6" x="268" y="227" width="20" height="4" rx="2" />
        </g>
    </svg>
)
