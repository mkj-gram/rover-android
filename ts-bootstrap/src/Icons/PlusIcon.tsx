/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    height = '24',
    style,
    onClick,
    width = '24',
    viewBox
}: RoverSVGProps) => (
    <svg
        width={width}
        viewBox={viewBox}
        height={height}
        style={{ ...style }}
        onClick={onClick}
    >
        <path
            // tslint:disable-next-line:max-line-length
            d="M13 11h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 2 0v6z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
