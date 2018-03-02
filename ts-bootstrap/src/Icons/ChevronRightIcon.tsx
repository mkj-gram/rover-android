/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }} onClick={onClick}>
        <path
            // tslint:disable-next-line:max-line-length
            d="M13.586 12L8.293 6.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L13.586 12z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
