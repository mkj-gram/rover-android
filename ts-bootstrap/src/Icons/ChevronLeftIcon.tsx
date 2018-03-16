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
            d="M10.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L10.414 12z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
