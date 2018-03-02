/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style, onClick }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }} onClick={onClick}>
        <path
            // tslint:disable-next-line:max-line-length
            d="M8.274 3L3 8.274v7.452L8.274 21h7.452L21 15.726V8.274L15.726 3H8.274zM7.86 1h8.28a1 1 0 0 1 .707.293l5.86 5.86A1 1 0 0 1 23 7.86v8.28a1 1 0 0 1-.293.707l-5.86 5.86a1 1 0 0 1-.707.293H7.86a1 1 0 0 1-.707-.293l-5.86-5.86A1 1 0 0 1 1 16.14V7.86a1 1 0 0 1 .293-.707l5.86-5.86A1 1 0 0 1 7.86 1zM11 8a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V8zm1 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
            fill={fill}
            fillRule="nonzero"
        />
    </svg>
)
