/// <reference path="../../typings/index.d.ts"/>
import * as React from 'react'

export default ({ fill, style }: RoverSVGProps) => (
    <svg width="24" height="24" style={{ ...style }}>
        <g fill={fill} fillRule="nonzero">
            // tslint:disable-next-line:max-line-length
            <path d="M2.85 16c-.47 0-.85-.448-.85-1s.38-1 .85-1h15.3c.47 0 .85.448.85 1s-.38 1-.85 1H2.85zm3.95-6c-.442 0-.8-.448-.8-1s.358-1 .8-1h14.4c.442 0 .8.448.8 1s-.358 1-.8 1H6.8z" />
        </g>
    </svg>
)
