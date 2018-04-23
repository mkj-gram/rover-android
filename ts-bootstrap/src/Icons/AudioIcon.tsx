/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    style,
    onClick,
    viewBox,
    height,
    width
}: RoverSVGProps) => (
    <svg
        width={height}
        height={height}
        viewBox={viewBox}
        style={{ ...style }}
        onClick={onClick}
    >
        <path
            // tslint:disable-next-line:max-line-length
            d="M5.65 8.07l4.725-3.78A1 1 0 0 1 12 5.07v14a1 1 0 0 1-1.625.78L5.65 16.07H2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h3.65zM10 7.15l-3.375 2.7a1 1 0 0 1-.625.22H3v4h3a1 1 0 0 1 .625.22L10 16.99V7.15zm8.363-1.443a1 1 0 1 1 1.414-1.414c4.294 4.295 4.294 11.259 0 15.554a1 1 0 1 1-1.414-1.414 9 9 0 0 0 0-12.726zm-3.53 3.53a1 1 0 1 1 1.414-1.414 6 6 0 0 1 0 8.484 1 1 0 1 1-1.414-1.414 4 4 0 0 0 0-5.656z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
