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
        <path
            // tslint:disable-next-line:max-line-length
            d="M22.419 6.186A1 1 0 0 1 24 7v10a1 1 0 0 1-1.581.814l-7-5a1 1 0 0 1 0-1.628l7-5zM22 8.943L17.72 12 22 15.057V8.943zM3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3zm0-2h11a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
