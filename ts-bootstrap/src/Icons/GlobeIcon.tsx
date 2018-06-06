/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'
export default ({
    fill,
    height = '24',
    width = '24',
    viewBox,
    style
}: RoverSVGProps) => (
    <svg width={width} height={height} viewBox={viewBox} style={{ ...style }}>
        <defs>
            <path
                d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM2 13a1 1 0 0 1 0-2h20a1 1 0 0 1 0 2H2zm7-1.02a14.3 14.3 0 0 0 3 8.47 14.265 14.265 0 0 0 3-8.43 14.3 14.3 0 0 0-3-8.47 14.265 14.265 0 0 0-3 8.43zm3.738-10.654A16.322 16.322 0 0 1 17 12.02a16.3 16.3 0 0 1-4.262 10.653 1 1 0 0 1-1.476 0A16.322 16.322 0 0 1 7 11.98a16.3 16.3 0 0 1 4.262-10.653 1 1 0 0 1 1.476 0z"
                id="globe-icon"
            />
        </defs>
        <g fill="none" fillRule="evenodd">
            <mask id="globe-icon-mask" fill="#fff">
                <use xlinkHref="#globe-icon" />
            </mask>
            <use fill="#000" fillRule="nonzero" xlinkHref="#globe-icon" />
            <g mask="url(#globe-icon-mask)" fill={fill}>
                <path d="M0 0h24v24H0z" />
            </g>
        </g>
    </svg>
)
