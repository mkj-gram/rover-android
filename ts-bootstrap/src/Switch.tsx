/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import { titanium, turquoise, white, steel } from '../styles/colors'

import { text as typographyText, bold } from '../styles/typography'

type propStyle = {
    innerStyle?: StringMap<string | number>
    outerStyle?: StringMap<string | number>
    textStyle?: StringMap<string | number>
}

interface SwitchProps {
    on?: boolean
    text?: string
    style?: propStyle
    forceOn?: boolean
    onClick?: () => void
}

const Switch: React.SFC<SwitchProps> = ({
    on,
    text,
    style,
    forceOn,
    onClick
}) => {
    let outerStyle: StringMap<string | number> = {
        display: 'inline-block',
        fontSize: 0 /* clear whitespace*/,
        height: '100%',
        borderRadius: 11
    }

    let innerStyle: StringMap<string | number> = {
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: white
    }

    let textStyle: StringMap<string | number> = {
        ...typographyText,
        ...bold,
        fontSize: 13,
        color: white
    }

    if (on === true) {
        outerStyle = {
            ...outerStyle,
            backgroundColor: turquoise
        }
        innerStyle = {
            ...innerStyle,
            float: 'right',
            margin: text === undefined ? '3px 3px 3px 13px' : '3px 3px 3px 3px'
        }
        textStyle = {
            ...textStyle,
            float: 'left',
            margin: '3px 3px 3px 7px'
        }
    } else if (on === false) {
        outerStyle = {
            ...outerStyle,
            backgroundColor: titanium
        }
        innerStyle = {
            ...innerStyle,
            float: 'left',
            margin: text === undefined ? '3px 13px 3px 3px' : '3px 3px 3px 3px'
        }
        textStyle = {
            ...textStyle,
            float: 'right',
            margin: '3px 7px 3px 3px'
        }
    }

    if (forceOn) {
        outerStyle = {
            ...outerStyle,
            border: `2px solid ${steel}`
        }
        innerStyle = {
            ...innerStyle,
            float: 'right',
            margin: '2px 2px 2px 12px',
            backgroundColor: steel,
            height: 14,
            width: 14,
            borderRadius: 8
        }
        textStyle = {
            ...textStyle,
            float: 'left',
            margin: '3px 3px 3px 7px'
        }
    }

    outerStyle = {
        ...outerStyle,
        ...style.outerStyle
    }

    innerStyle = {
        ...innerStyle,
        ...style.innerStyle
    }

    textStyle = {
        ...textStyle,
        ...style.textStyle
    }

    return (
        <div style={outerStyle} onClick={forceOn ? () => null : onClick}>
            <style type="text/css">
                {`
                    .slide {
                        transition: .2s ease-in-out;
                    }
                `}
            </style>
            <div className="slide" style={innerStyle} />
            <div className="slide" style={textStyle}>
                {text}
            </div>
        </div>
    )
}

Switch.defaultProps = {
    forceOn: false,
    style: {
        outerStyle: {},
        innerStyle: {},
        textStyle: {}
    }
}

export default Switch
