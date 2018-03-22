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
            d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm2.293-12.707a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 1 1-1.414-1.414l6-6zm-6 1.414a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1-1.414 1.414l-6-6z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
