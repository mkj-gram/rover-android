/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }} onClick={onClick}>
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M20 9V6a1 1 0 0 0-1-1h-2v1a1 1 0 0 1-2 0V5H9v1a1 1 0 1 1-2 0V5H5a1 1 0 0 0-1 1v3h16zm0 2H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zM9 3h6V2a1 1 0 0 1 2 0v1h2a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h2V2a1 1 0 1 1 2 0v1z"
                id="a"
            />
        </g>
    </svg>
)
