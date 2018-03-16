/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    width = '24',
    height = '24',
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
                d="M12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            />
        </g>
    </svg>
)
