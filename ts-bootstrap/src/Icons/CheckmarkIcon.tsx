/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="16" height="16" style={{ ...style }}>
        <g fill={fill} fillRule="nonzero">
            <path d="M10.684 4.55l1.414 1.414-5.489 5.489-2.719-2.72L5.304 7.32 6.61 8.625z" />
        </g>
    </svg>
)
