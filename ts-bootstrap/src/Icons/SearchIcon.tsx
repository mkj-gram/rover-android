/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ ...style }}
        onClick={onClick}
    >
        <defs>
            <path
                d="M21.707 20.293a1 1 0 0 1-1.414 1.414l-4.35-4.35a1 1 0 0 1 1.414-1.414l4.35 4.35zM11 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                id="search"
            />
        </defs>
        <use fill={fill} fillRule="nonzero" xlinkHref="#search" />
    </svg>
)
