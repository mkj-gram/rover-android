/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    height = '24',
    width = '24',
    style,
    onClick,
    viewBox
}: RoverSVGProps) => (
    <svg
        width={width}
        height={height}
        style={{ ...style }}
        onClick={onClick}
        viewBox={viewBox}
    >
        <path
            // tslint:disable-next-line:max-line-length
            d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5zm0-2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm3.5 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0-2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM5.707 21.707a1 1 0 1 1-1.414-1.414l11-11a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.414L16 11.414 5.707 21.707z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
