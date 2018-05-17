/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import {
    text as typographyText,
    semibold,
    regular,
    light
} from '../styles/typography'

import { silver, graphite, charcoal } from '../styles/colors'

import ContentEditable from '../components/ContentEditable'
import PlaceholderComponent from '../components/PlaceholderComponent'

export interface TextProps {
    text: string | JSX.Element
    contentEditable?: boolean
    handleBlurChange?: (evt: string) => void
    handleChange?: (val: string) => void
    id?: string
    label?: boolean
    onBlurChange?: boolean
    onInputChange?: (input: string) => void
    placeholder?: boolean
    placeholderText?: string
    position?: 'left' | 'center'
    size: 'h1' | 'h2' | 'large' | 'medium' | 'small' | 'x-large'
    textStyle?: React.CSSProperties
}

const Text: React.SFC<TextProps> = ({
    contentEditable,
    handleBlurChange,
    handleChange,
    id,
    label,
    onBlurChange,
    onInputChange,
    placeholder,
    placeholderText,
    position,
    size,
    text,
    textStyle
}) => {
    let style: StringMap<string | number> = {
        ...typographyText,
        ...regular,
        color: charcoal,
        display: 'inline-block',
        lineHeight: '24px'
    }

    switch (size) {
        case 'h1':
            style = {
                ...style,
                ...semibold,
                lineHeight: '40px',
                fontSize: 32
            }
            break
        case 'h2':
            style = {
                ...style,
                ...semibold,
                lineHeight: '32px',
                fontSize: 25
            }
            break
        case 'x-large':
            style = {
                ...style,
                ...light,
                color: graphite,
                lineHeight: '80px',
                fontSize: 64
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

    if (position === 'center') {
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

    style = {
        ...style,
        ...textStyle
    }

    const html = `${text}`

    if (
        !contentEditable &&
        (!placeholder || (placeholder && (text as string).length !== 0))
    ) {
        return <div style={style}>{text}</div>
    } else if (!placeholder || (placeholder && (text as string).length !== 0)) {
        return (
            <ContentEditable
                handleBlurChange={handleBlurChange}
                html={html}
                id={id}
                onBlurChange={onBlurChange}
                onChange={handleChange}
                onInputChange={onInputChange}
                style={style}
            />
        )
    } else {
        return (
            <PlaceholderComponent
                contentEditable={contentEditable}
                handleBlurChange={handleBlurChange}
                html={html}
                id={id}
                onBlurChange={onBlurChange}
                onChange={handleChange}
                onInputChange={onInputChange}
                placeholderText={placeholderText}
                style={style}
            />
        )
    }
}
Text.defaultProps = {
    text: '',
    size: 'medium',
    position: 'left',
    placeholder: false,
    contentEditable: false,
    handleChange: () => null,
    label: false,
    onBlurChange: false
}

export default Text
