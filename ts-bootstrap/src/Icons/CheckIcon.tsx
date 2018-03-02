/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" {...style} onClick={onClick}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M9 15.586L19.293 5.293a1 1 0 0 1 1.414 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L9 15.586z"
                id="a"
            />
        </g>
    </svg>
)
