import React from 'react'

import Label from './Label'

import { graphite, titanium } from '../styles/colors'
import { unselectable } from '../styles/typography'

const { Component } = React

class TextField extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isFocused: false
        }

        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    render() {
        const { label, disabled, style, onFocus, onBlur, onChange, ...rest } = this.props
        const { isFocused, isPresent } = this.state

        let {
            container: containerStyle,
            focus: focusStyle,
            disabled: disabledStyle,
            label: labelStyle,
            presentLabel: presentLabelStyle,
            ...inputStyle
        } = style

        containerStyle = {
            ...TextField.defaulStyles.container,
            ...containerStyle
        }

        inputStyle = {
            ...TextField.defaulStyles.input,
            ...inputStyle
        }

        focusStyle = {
            ...TextField.defaulStyles.focus,
            ...focusStyle
        }

        disabledStyle = {
            ...TextField.defaulStyles.disabled,
            ...disabledStyle
        }

        labelStyle = {
            ...TextField.defaulStyles.label,
            ...labelStyle
        }

        presentLabelStyle = {
            ...TextField.defaulStyles.presentLabel,
            ...presentLabelStyle
        }

        if (isFocused) {
            inputStyle = {
                ...inputStyle,
                ...focusStyle
            }
        }

        if (disabled) {
            inputStyle = {
                ...inputStyle,
                ...disabledStyle
            }
        }

        if (isPresent) {
            labelStyle = {
                ...labelStyle,
                ...presentLabelStyle
            }
        }

        const input = <input ref={e => this.input = e} disabled={disabled} style={inputStyle} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} {...rest}/>

        if (!label) {
            return input
        }

        return (
            <div style={containerStyle}>
                <Label style={labelStyle}>{'Name'}</Label>
                {input}
            </div>
        )
    }

    onFocus(event) {
        this.setState({
            isFocused: true
        })
        
        this.props.onFocus(event)
    }

    onBlur(event) {
        this.setState({
            isFocused: false
        })

        this.props.onBlur(event)
    }

    onChange(event) {
        this.setState({
            isPresent: Boolean(event.target.value)
        })

        this.props.onChange(event)
    }

    getInput() {
        return this.input
    }
}

TextField.defaulStyles = {
    container: {
        paddingTop: 18,
        position: 'relative'
    },
    input: {
        ...unselectable,
        background: 'none',
        border: 'none',
        borderColor: titanium,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 1px 0',
        color: graphite,
        display: 'block',
        fontFamily: '"Source Sans Pro", serif',
        fontSize: 16,
        fontWeight: 400,
        outline: 'none',
        padding: '3px 0',
        width: '100%'
    },
    focus: {
        borderColor: graphite
    },
    disabled: {
        color: titanium
    },
    label: {
        transition: 'top 0.1s, font-size 0.1s',
        fontSize: 16,
        pointerEvents: 'none',
        position: 'absolute',
        top: 22
    },
    presentLabel: {
        fontSize: 14,
        top: 0
    }
}

TextField.defaultProps = {
    style: {},
    onFocus: () => null,
    onBlur: () => null,
    onChange: () => null
}

export default TextField
