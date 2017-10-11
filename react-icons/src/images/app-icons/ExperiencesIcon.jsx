import React from 'react'

export default ({ size, style = {} }) => {

    switch (size) {
        case 32:
            return (
                <svg width="32px" height="32px" viewBox="0 0 32 32" style={style}>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g>
                            <g transform="translate(-3.000000, -10.000000)">
                                <rect fill="#35A7F8" x="3" y="10" width="32" height="32" rx="5"></rect>
                                <path d="M13,16.2820321 C13,15.5739853 13.5787849,15 14.2842102,15 L23.7157898,15 C24.4250395,15 25,15.5725904 25,16.2820321 L25,34.7179679 C25,35.4260147 24.4212151,36 23.7157898,36 L14.2842102,36 C13.5749605,36 13,35.4274096 13,34.7179679 L13,16.2820321 Z M14,17 L24,17 L24,32 L14,32 L14,17 Z M18,33.5 C18,33.2238576 18.2157526,33 18.495389,33 L20.504611,33 C20.7782068,33 21,33.2319336 21,33.5 C21,33.7761424 20.7842474,34 20.504611,34 L18.495389,34 C18.2217932,34 18,33.7680664 18,33.5 Z" fill="#FFFFFF"></path>
                                <rect fill="#85CAFA" x="14" y="17" width="10" height="15"></rect>
                                <rect fill="#CEE9FD" x="15" y="18" width="8" height="3"></rect>
                                <rect fill="#CEE9FD" x="15" y="26" width="8" height="5"></rect>
                                <rect fill="#CEE9FD" x="15" y="22" width="4" height="3"></rect>
                                <rect fill="#CEE9FD" x="20" y="22" width="3" height="3"></rect>
                            </g>
                        </g>
                    </g>
                </svg>
            )
        default: 
            return (
                <svg width="48px" height="48px" viewBox="0 0 48 48" style={style}>
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g>
                            <rect fill="#35A7F8" x="0" y="0" width="48" height="48" rx="5"></rect>
                            <path d="M14,9.92967933 C14,8.86394687 14.859375,8 15.9176841,8 L32.0823159,8 C33.1414236,8 34,8.8559227 34,9.92967933 L34,38.0703207 C34,39.1360531 33.140625,40 32.0823159,40 L15.9176841,40 C14.8585764,40 14,39.1440773 14,38.0703207 L14,9.92967933 Z M16,11 L32,11 L32,34 L16,34 L16,11 Z M21,36.9531403 C21,36.4267354 21.4315052,36 21.9640038,36 L26.0359962,36 C26.5684008,36 27,36.4241486 27,36.9531403 L27,37.0468597 C27,37.5732646 26.5684948,38 26.0359962,38 L21.9640038,38 C21.4315992,38 21,37.5758514 21,37.0468597 L21,36.9531403 Z" fill="#FFFFFF"></path>
                            <rect opacity="0.400000006" fill="#FFFFFF" x="16" y="11" width="16" height="23"></rect>
                            <rect opacity="0.6" fill="#FFFFFF" x="18" y="13" width="12" height="5"></rect>
                            <rect opacity="0.6" fill="#FFFFFF" x="18" y="24" width="12" height="8"></rect>
                            <rect opacity="0.6" fill="#FFFFFF" x="18" y="19" width="6" height="4"></rect>
                            <rect opacity="0.6" fill="#FFFFFF" x="25" y="19" width="5" height="4"></rect>
                        </g>
                    </g>
                </svg>
            )
    }    
}