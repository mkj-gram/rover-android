/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, onClick }: RoverSVGProps) => (
    <svg width="20" height="20" viewBox="0 0 24 24" onClick={onClick}>
        <defs>
            <path
                d="M19.5857864,4 L16,4 C15.4477153,4 15,3.55228475 15,3 C15,2.44771525 15.4477153,2 16,2 L22,2 C22.5522847,2 23,2.44771525 23,3 L23,9 C23,9.55228475 22.5522847,10 22,10 C21.4477153,10 21,9.55228475 21,9 L21,5.41421356 L11.7071068,14.7071068 C11.3165825,15.0976311 10.6834175,15.0976311 10.2928932,14.7071068 C9.90236893,14.3165825 9.90236893,13.6834175 10.2928932,13.2928932 L19.5857864,4 Z M18,13 C18,12.4477153 18.4477153,12 19,12 C19.5522847,12 20,12.4477153 20,13 L20,19 C20,20.6568542 18.6568542,22 17,22 L6,22 C4.34314575,22 3,20.6568542 3,19 L3,8 C3,6.34314575 4.34314575,5 6,5 L12,5 C12.5522847,5 13,5.44771525 13,6 C13,6.55228475 12.5522847,7 12,7 L6,7 C5.44771525,7 5,7.44771525 5,8 L5,19 C5,19.5522847 5.44771525,20 6,20 L17,20 C17.5522847,20 18,19.5522847 18,19 L18,13 Z"
                id="external-link-icon-path-1"
            />
        </defs>
        <g
            id="Icon-/-External-Link"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <mask id="external-link-icon-mask-2" fill="white">
                <use xlinkHref="#external-link-icon-path-1" />
            </mask>
            <use
                fill={fill}
                fillRule="nonzero"
                xlinkHref="#external-link-icon-path-1"
            />
        </g>
    </svg>
)
