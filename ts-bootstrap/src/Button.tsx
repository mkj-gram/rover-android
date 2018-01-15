/// <reference path="../typings/index.d.ts" />
import * as React from 'react'

import {
    steel,
    turquoise,
    titanium,
    aquamarine,
    graphite
} from '../styles/colors'

import { text as typographyText, semibold } from '../styles/typography'

type propStyle = {
    innerStyle?: StringMap<string | number>
    outerStyle?: StringMap<string | number>
}

interface ButtonProps {
    text: string
    type: 'primary' | 'secondary' | 'disabled' | 'regular'
    size?: 'large' | 'small'
    overrideWidth?: number
    onClick?: () => void
    style?: propStyle
}

interface ButtonState {
    mouseDown: boolean
}

class Button extends React.Component<ButtonProps, ButtonState> {
    static defaultProps: Partial<ButtonProps> = {
        text: '',
        type: 'primary',
        onClick: () => null,
        style: {
            innerStyle: {},
            outerStyle: {}
        }
    }

    constructor(props: ButtonProps) {
        super(props)
        this.state = {
            mouseDown: false
        }
        this.handleMouseEvent = this.handleMouseEvent.bind(this)
    }

    handleMouseEvent(val: string) {
        this.setState({
            mouseDown: !this.state.mouseDown
        })
        if (val === 'down') {
            this.props.onClick()
        }
    }

    render() {
        const { text, size, type, overrideWidth, style } = this.props

        const { mouseDown } = this.state

        let outerStyle: StringMap<string | number> = {
            borderRadius: 5,
            textAlign: 'center',
            display: 'inline-block'
        }
        let innerStyle: StringMap<string | number> = {
            ...typographyText,
            ...semibold,
            color: 'white'
        }

        switch (size) {
            case 'large':
                innerStyle = {
                    ...innerStyle,
                    padding: '14px 32px 14px 32px',
                    fontSize: 16
                }
                outerStyle = {
                    ...outerStyle
                }
                break
            case 'small':
                innerStyle = {
                    ...innerStyle,
                    padding: '7px 24px 7px 24px',
                    fontSize: 14
                }
                outerStyle = {
                    ...outerStyle
                }
                break
        }

        if (overrideWidth !== undefined) {
            innerStyle = {
                ...innerStyle,
                paddingLeft: 0,
                paddingRight: 0
            }
            outerStyle = {
                ...outerStyle,
                width: overrideWidth
            }
        }

        switch (type) {
            case 'primary':
                outerStyle = {
                    ...outerStyle,
                    background: mouseDown === true ? aquamarine : turquoise
                }
                break
            case 'secondary':
                outerStyle = {
                    ...outerStyle,
                    background: mouseDown === true ? graphite : steel
                }
                break
            case 'disabled':
                outerStyle = {
                    ...outerStyle,
                    background: titanium
                }
                break
            case 'regular':
                innerStyle = {
                    ...innerStyle,
                    color: mouseDown === true ? aquamarine : turquoise,
                    fontSize: 17,
                    padding: '1px 0px 1px 0px'
                }
                outerStyle = {
                    ...outerStyle,
                    height: 24
                }
                break
        }

        outerStyle = {
            ...outerStyle,
            ...style.outerStyle
        }

        innerStyle = {
            ...innerStyle,
            ...style.innerStyle
        }

        let ret
        if (type !== 'disabled') {
            ret = (
                <div
                    style={outerStyle}
                    onMouseDown={() => this.handleMouseEvent('down')}
                    onMouseUp={() => this.handleMouseEvent('up')}
                >
                    <div style={innerStyle}>{text}</div>
                </div>
            )
        } else {
            ret = (
                <div style={outerStyle}>
                    <div style={innerStyle}>{text}</div>
                </div>
            )
        }
        return ret
    }
}

export default Button
