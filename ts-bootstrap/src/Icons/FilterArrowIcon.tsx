/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="16" height="16" style={{ ...style }} onClick={onClick}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M8 10l4-4H4z"
                id="a"
            />
        </g>
    </svg>
)
