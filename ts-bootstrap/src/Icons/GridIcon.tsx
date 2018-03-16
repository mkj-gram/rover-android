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
                d="M3 2h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v5h5V4H4zM14 2h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v5h5V4h-5zM14 13h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm1 2v5h5v-5h-5zM3 13h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zm1 2v5h5v-5H4z"
            />
        </g>
    </svg>
)
