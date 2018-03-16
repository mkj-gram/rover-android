/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    height = '24',
    width = '24',
    viewBox,
    style,
    onClick
}: RoverSVGProps) => (
    <svg
        width={width}
        height={height}
        viewBox={viewBox}
        style={{ ...style }}
        onClick={onClick}
    >
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M19 20a1 1 0 0 1-2 0V10a1 1 0 0 1 2 0v10zm-6 0a1 1 0 0 1-2 0V4a1 1 0 0 1 2 0v16zm-6 0a1 1 0 0 1-2 0v-6a1 1 0 0 1 2 0v6z"
            />
        </g>
    </svg>
)
