/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <path
            // tslint:disable-next-line:max-line-length
            d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm1-5a1 1 0 0 1-2 0v-4a1 1 0 0 1 2 0v4zm-1-8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
