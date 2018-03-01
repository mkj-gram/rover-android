/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <g fill={fill} fillRule="nonzero">
            <path d="M10.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L10.414 12z" />
        </g>
    </svg>
)
