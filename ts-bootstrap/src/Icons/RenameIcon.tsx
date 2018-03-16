/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    height = '24',
    width = '24',
    viewBox,
    onClick,
    style
}: RoverSVGProps) => (
    <svg
        width={width}
        height={height}
        viewBox={viewBox}
        onClick={onClick}
        style={{ ...style }}
    >
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M14 3.414l-10 10V16h2.586l10-10L14 3.414zm.707-2.121l4 4a1 1 0 0 1 0 1.414l-11 11A1 1 0 0 1 7 18H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l11-11a1 1 0 0 1 1.414 0zM3 23a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2H3z"
                id="a"
            />
        </g>
    </svg>
)
