/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <g fill={fill} fillRule="evenodd">
            <path
                // tslint:disable-next-line:max-line-length
                d="M9.646 4.15a2.752 2.752 0 0 1 4.708 0l7.771 12.975a2.75 2.75 0 0 1-2.36 4.125H4.224a2.75 2.75 0 0 1-2.343-4.138L9.646 4.151zM3.462 18.043a.917.917 0 0 0 .774 1.375h15.518a.917.917 0 0 0 .791-1.363L12.784 5.097a.917.917 0 0 0-1.567-.002L3.462 18.042z"
                fillRule="nonzero"
            />
            <path
                d="M11.083 9.333a.917.917 0 0 1 1.834 0V13a.917.917 0 0 1-1.834 0V9.333z"
                fillRule="nonzero"
            />
            <circle cx="12" cy="16.667" r="1" />
        </g>
    </svg>
)
