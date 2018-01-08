/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import { text as typographyText, semibold, regular } from '../styles/typography'

import { silver, graphite, charcoal } from '../styles/colors'

import ContentEditable from '../components/ContentEditable'

interface TextProps {
    text: string
    size: 'h1' | 'h2' | 'large' | 'medium' | 'small'
    position?: 'left' | 'center'
    contentEditable?: boolean
    placeholder?: boolean
    label?: boolean
    handleChange?: (evt: string) => void
}

const Text: React.SFC<TextProps> = ({
    text,
    size,
    position,
    placeholder,
    label,
    contentEditable,
    handleChange
}) => {
    let style: StringMap<string | number> = {
        ...typographyText,
        ...regular,
        color: charcoal,
        width: 500,
        height: 24
    }

    switch (size) {
        case 'h1':
            style = {
                ...style,
                ...semibold,
                height: 40,
                fontSize: 32
            }
            break
        case 'h2':
            style = {
                ...style,
                ...semibold,
                height: 32,
                fontSize: 25
            }
            break
        case 'large':
            style = {
                ...style,
                fontSize: 19
            }
            break
        case 'medium':
            style = {
                ...style,
                fontSize: 17
            }
            break
        case 'small':
            style = {
                ...style,
                fontSize: 15
            }
            break
    }

    if (placeholder === true) {
        style = {
            ...style,
            color: silver
        }
    } else if (position === 'center') {
        style = {
            ...style,
            textAlign: 'center'
        }
    }

    if (label === true) {
        style = {
            ...style,
            color: graphite
        }
    }

    let ret
    if (contentEditable === false) {
        ret = <div style={style}>{text}</div>
    } else {
        const html = `${text}`
        ret = (
            <ContentEditable
                placeholder={placeholder}
                html={html}
                onChange={handleChange}
                style={style}
            />
        )
    }
    return ret
}

Text.defaultProps = {
    text: '',
    size: 'medium',
    position: 'left',
    placeholder: false,
    contentEditable: false,
    handleChange: () => null,
    label: false
}

export default Text
