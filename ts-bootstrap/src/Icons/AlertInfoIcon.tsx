/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="22px" height="22px" viewBox="0 0 22 22" style={{ ...style }}>
        <defs>
            <path
                // tslint:disable-next-line:max-line-length
                d="M12,23 C5.92486775,23 1,18.0751322 1,12 C1,5.92486775 5.92486775,1 12,1 C18.0751322,1 23,5.92486775 23,12 C23,18.0751322 18.0751322,23 12,23 Z M12,21 C16.9705627,21 21,16.9705627 21,12 C21,7.02943725 16.9705627,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 Z M13,16 C13,16.5522847 12.5522847,17 12,17 C11.4477153,17 11,16.5522847 11,16 L11,12 C11,11.4477153 11.4477153,11 12,11 C12.5522847,11 13,11.4477153 13,12 L13,16 Z M12,8 C12.5522847,8 13,7.55228475 13,7 C13,6.44771525 12.5522847,6 12,6 C11.4477153,6 11,6.44771525 11,7 C11,7.55228475 11.4477153,8 12,8 Z"
                id="path-1"
            />
        </defs>
        <g
            id="Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="Icon-/-Info" transform="translate(-1.000000, -1.000000)">
                <mask id="mask-2" fill="white">
                    <use xlinkHref="#path-1" />
                </mask>
                <use
                    id="Oval"
                    fill={fill}
                    fillRule="nonzero"
                    xlinkHref="#path-1"
                />
            </g>
        </g>
    </svg>
)
