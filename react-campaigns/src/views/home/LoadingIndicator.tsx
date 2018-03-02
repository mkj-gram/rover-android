import * as React from 'react'
import { cloud, titanium } from '@rover/ts-bootstrap/dist/src'

export default () => (
    <div>
        <style media="screen">
            {`#loading-indicator rect:nth-child(1) {
                animation: pulse 1200ms ease-out infinite;
            }

            #loading-indicator rect:nth-child(2) {
                animation: pulse 1200ms ease-in-out 400ms infinite;
            }

            #loading-indicator rect:nth-child(3) {
                animation: pulse 1200ms ease-in-out 800ms infinite;
            }

            @keyframes pulse {
                11%, 44% {
                    fill: ${titanium};
                }

                22%, 33% {
                    fill: ${cloud};
                }
            }`}
        </style>
        <svg
            id="loading-indicator"
            width="48"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g fill="none" fillRule="evenodd">
                <rect
                    fill={titanium}
                    x="3"
                    y="7"
                    width="10"
                    height="10"
                    rx="2"
                />
                <rect
                    fill={titanium}
                    x="19"
                    y="7"
                    width="10"
                    height="10"
                    rx="2"
                />
                <rect
                    fill={titanium}
                    x="35"
                    y="7"
                    width="10"
                    height="10"
                    rx="2"
                />
            </g>
        </svg>
    </div>
)
