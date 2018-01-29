/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M3 7a1 1 0 1 1 0-2h18a1 1 0 0 1 0 2H3zm15-1a1 1 0 0 1 2 0v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a1 1 0 1 1 2 0v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6zM9 6a1 1 0 1 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2a1 1 0 0 1-2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2z"
                id="a"
            />
        </g>
    </svg>
)
