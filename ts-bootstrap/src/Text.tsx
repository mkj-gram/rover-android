/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import { text as typographyText, semibold, regular } from '../styles/typography'

import { silver, graphite, charcoal } from '../styles/colors'

import ContentEditable from '../components/ContentEditable'
import PlaceholderComponent from '../components/PlaceholderComponent'

export interface TextProps {
    text: string | JSX.Element
    size: 'h1' | 'h2' | 'large' | 'medium' | 'small'
    position?: 'left' | 'center'
    contentEditable?: boolean
    placeholder?: boolean
    label?: boolean
    handleChange?: (val: string) => void
    textStyle?: React.CSSProperties
    id?: string
    onBlurChange?: boolean
    placeholderText?: string
    handleBlurChange?: (evt: string) => void
}

const Text: React.SFC<TextProps> = ({
    text,
    size,
    position,
    placeholder,
    label,
    contentEditable,
    handleChange,
    textStyle,
    id,
    onBlurChange,
    placeholderText,
    handleBlurChange
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
                html={html}
                onChange={handleChange}
                style={style}
                id={id}
                onBlurChange={onBlurChange}
                handleBlurChange={handleBlurChange}
            />
        )
    } else {
        return (
            <PlaceholderComponent
                html={html}
                placeholderText={placeholderText}
                style={style}
                onChange={handleChange}
                id={id}
                contentEditable={contentEditable}
                onBlurChange={onBlurChange}
                handleBlurChange={handleBlurChange}
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
