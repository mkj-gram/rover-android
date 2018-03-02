/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" {...style} onClick={onClick}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M15 8a1 1 0 0 1 0-2h3a6 6 0 0 1 0 12h-3a1 1 0 0 1 0-2h3a4 4 0 1 0 0-8h-3zm-6 8a1 1 0 0 1 0 2H6A6 6 0 1 1 6 6h3a1 1 0 1 1 0 2H6a4 4 0 1 0 0 8h3zm-1-3a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H8z"
                id="a"
            />
        </g>
    </svg>
)
