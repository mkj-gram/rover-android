/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="368" height="755" style={{ ...style }}>
        <defs>
            <circle id="a" cx="184" cy="708" r="29" />
        </defs>
        <g fill="none" fillRule="evenodd">
            <rect fill="#E9E9E9" width="368" height="755" rx="56" />
            <rect fill={fill} x="9" y="9" width="350" height="737" rx="46" />
            <use fill="#FBFBFB" />
            <circle stroke="#E9E9E9" strokeWidth="4" cx="184" cy="708" r="27" />
            <rect
                fill="#5D5D5D"
                x="21"
                y="93"
                width="326"
                height="574"
                rx="3"
            />
            <rect fill="#D8D8D8" x="151" y="46" width="64" height="6" rx="3" />
            <path fill="#FFF" d="M24 96h320v568H24z" />
        </g>
    </svg>
)
