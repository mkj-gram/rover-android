/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }} onClick={onClick}>
        <path
            // tslint:disable-next-line:max-line-length
            d="M22 8.998v-5a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1h-6a1 1 0 1 1 0-2h5zm-20 6v5a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H2zm2.453-5.666a1 1 0 0 1-1.886-.668 10 10 0 0 1 7.22-6.417 9.985 9.985 0 0 1 9.258 2.662l4.64 4.36a1 1 0 1 1-1.37 1.458l-4.662-4.382a8 8 0 0 0-13.2 2.987zM.315 14.727a1 1 0 0 1 1.37-1.458l4.662 4.382a8 8 0 0 0 13.2-2.987 1 1 0 0 1 1.886.668 10 10 0 0 1-7.22 6.417 9.985 9.985 0 0 1-9.258-2.662l-4.64-4.36z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
