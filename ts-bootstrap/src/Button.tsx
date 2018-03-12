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

import ResponsiveContainer from '../components/ResponsiveContainer'

export type propStyle = {
    innerStyle?: React.CSSProperties
    outerStyle?: React.CSSProperties
}

export interface ButtonProps extends InjectedProps {
    text?: string
    type?: 'primary' | 'secondary' | 'disabled' | 'regular'
    size?: 'large' | 'small'
    overrideWidth?: number
    onClick?: () => void
    style?: propStyle
}

export interface ButtonState {
    mouseDown: boolean
}

class ButtonComponent extends React.Component<ButtonProps, ButtonState> {
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

    handleMouseEvent(val: string, eventType: string) {
        const { device } = this.props
        if (eventType === 'touch' && device !== 'Desktop') {
            this.setState({
                mouseDown: !this.state.mouseDown
            })

            if (val === 'up') {
                this.props.onClick()
            }
        } else if (eventType === 'mouse' && device === 'Desktop') {
            this.setState({
                mouseDown: !this.state.mouseDown
            })

            if (val === 'up') {
                this.props.onClick()
            }
        }
    }

    render() {
        const { text, size, type, overrideWidth, style, device } = this.props

        const { mouseDown } = this.state

        let outerStyle: React.CSSProperties = {
            borderRadius: 4,
            textAlign: 'center',
            display: 'inline-block'
        }
        let innerStyle: React.CSSProperties = {
            ...typographyText,
            ...semibold,
            color: 'white'
        }

        switch (size) {
            case 'large':
                innerStyle = {
                    ...innerStyle,
                    padding: '16px 32px 16px 32px',
                    fontSize: 16
                }
                outerStyle = {
                    ...outerStyle,
                    height: 48
                }
                break
            case 'small':
                innerStyle = {
                    ...innerStyle,
                    padding: '8px 24px 8px 24px',
                    fontSize: 14
                }
                outerStyle = {
                    ...outerStyle,
                    height: 32
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
                    color: mouseDown === true ? graphite : steel,
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
                    onMouseDown={() => this.handleMouseEvent('down', 'mouse')}
                    onMouseUp={() => this.handleMouseEvent('up', 'mouse')}
                    onTouchStart={() => this.handleMouseEvent('down', 'touch')}
                    onTouchEnd={() => this.handleMouseEvent('up', 'touch')}
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

class Button extends React.Component<ButtonProps, ButtonState> {
    constructor(props: ButtonProps) {
        super(props)
    }

    render() {
        const ResponsiveButtonContainer = ResponsiveContainer(this.props)(
            ButtonComponent
        )
        return <ResponsiveButtonContainer />
    }
}

export default Button
