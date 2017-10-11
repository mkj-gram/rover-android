import React from 'react'

export default props =>
    <svg {...props} width="20px" height="16px" viewBox="0 0 20 16" >
        <defs>
            <rect id="path-1" x="6" y="1" width="2" height="15"></rect>
            <rect id="path-2" x="12" y="1" width="2" height="15"></rect>
        </defs>
        <g id="Audiences" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.900000036">
            <g id="Customers" transform="translate(-876.000000, -86.000000)">
                <g id="geofence" transform="translate(868.000000, 79.000000)">
                    <g id="Group-6" transform="translate(8.000000, 7.000000)">
                        <rect id="Rectangle-12" stroke={props.fill} strokeWidth="2" x="1" y="1" width="18" height="14" rx="1"></rect>
                        <g id="Rectangle">
                            <use fill={props.fill} fillRule="evenodd" xlinkHref="#path-1"></use>
                            <rect x="6" y="1" width="2" height="15"></rect>
                        </g>
                        <g id="Rectangle">
                            <use fill={props.fill} fillRule="evenodd" xlinkHref="#path-2"></use>
                            <rect x="12" y="1" width="2" height="15"></rect>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
