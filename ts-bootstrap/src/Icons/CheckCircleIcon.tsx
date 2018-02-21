/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M21 11.086a1 1 0 1 1 2 0v.92a11 11 0 1 1-6.523-10.053 1 1 0 1 1-.814 1.827A9 9 0 1 0 21 12.006v-.92zm.293-7.786a1 1 0 1 1 1.415 1.413l-10 10.01a1 1 0 0 1-1.415 0l-3-3a1 1 0 0 1 1.414-1.414L12 12.602 21.293 3.3z"
                id="a"
            />
        </g>
    </svg>
)
