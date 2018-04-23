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
    innerStyle?: StringMap<string | number>
    outerStyle?: StringMap<string | number>
}

export interface ButtonProps extends InjectedProps {
    text?: string
    type?: 'primary' | 'secondary' | 'disabled' | 'regular'
    size?: 'large' | 'small'
    overrideWidth?: number
    onClick?: () => void
    style?: propStyle
    mouseDownColors?: StringMap<string>
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

    handleMouseEvent(e: any, val: string, eventType: string) {
        const forceTouchEventBlur = () => {
            const contentEditableText = document.getElementById(
                'contentEditableText'
            )

            if (
                contentEditableText &&
                contentEditableText.children[1] === document.activeElement
            ) {
                (contentEditableText.children[1] as HTMLElement).blur()
            }
        }

        const { device } = this.props

        if (eventType === 'touch' && device !== 'Desktop') {
            this.setState({
                mouseDown: !this.state.mouseDown
            })

            if (val === 'up') {
                forceTouchEventBlur()

                this.props.onClick()
                e.preventDefault()
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
        const {
            text,
            size,
            type,
            overrideWidth,
            style,
            mouseDownColors,
            device
        } = this.props

        const { mouseDown } = this.state

        let outerStyle: React.CSSProperties = {
            borderRadius: 5,
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

        let mouseStateColors: StringMap<string> = {}

        switch (type) {
            case 'primary':
                mouseStateColors = {
                    active: turquoise,
                    inactive: aquamarine,
                    ...mouseDownColors
                }
                outerStyle = {
                    ...outerStyle,
                    background:
                        mouseDown === true
                            ? mouseStateColors.inactive
                            : mouseStateColors.active
                }
                break
            case 'secondary':
                mouseStateColors = {
                    active: steel,
                    inactive: graphite,
                    ...mouseDownColors
                }
                outerStyle = {
                    ...outerStyle,
                    background:
                        mouseDown === true
                            ? mouseStateColors.inactive
                            : mouseStateColors.active
                }
                break
            case 'disabled':
                outerStyle = {
                    ...outerStyle,
                    background: titanium
                }
                break
            case 'regular':
                mouseStateColors = {
                    active: steel,
                    inactive: graphite,
                    ...mouseDownColors
                }
                innerStyle = {
                    ...innerStyle,
                    color:
                        mouseDown === true
                            ? mouseStateColors.inactive
                            : mouseStateColors.active,
                    fontSize: 17,
                    padding: 0
                }
                outerStyle = {
                    ...outerStyle,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center'
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
                    onMouseDown={e => this.handleMouseEvent(e, 'down', 'mouse')}
                    onMouseUp={e => this.handleMouseEvent(e, 'up', 'mouse')}
                    onTouchStart={e =>
                        this.handleMouseEvent(e, 'down', 'touch')
                    }
                    onTouchEnd={e => this.handleMouseEvent(e, 'up', 'touch')}
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
