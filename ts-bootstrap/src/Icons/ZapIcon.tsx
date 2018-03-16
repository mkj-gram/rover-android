/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({
    fill,
    height = '24',
    width = '24',
    viewBox,
    style,
    onClick
}: RoverSVGProps) => (
    <svg
        width={width}
        height={height}
        viewBox={viewBox}
        style={{ ...style }}
        onClick={onClick}
    >
        <g fill={fill} fillRule="nonzero">
            <path
                // tslint:disable-next-line:max-line-length
                d="M10.87 15.003H3.001a1 1 0 0 1-.768-1.64l10-12c.639-.767 1.884-.227 1.76.764l-.86 6.876h7.868a1 1 0 0 1 .768 1.64l-10 12c-.64.768-1.884.227-1.76-.764l.86-6.876zm.717-9.74l-6.45 7.74h6.865a1 1 0 0 1 .992 1.124l-.577 4.616 6.45-7.74h-6.865a1 1 0 0 1-.992-1.124l.577-4.615z"
                id="a"
            />
        </g>
    </svg>
)
