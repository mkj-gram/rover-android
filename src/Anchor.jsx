import React from 'react'

import { Link } from 'react-router'

import { text } from './styles/typography'

const { Component } = React

class Anchor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hover: false
        }

        this.onClick = this.onClick.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
    }

    render() {

        // Ensure onClick, onMouseEnter and onMouseLeave are pulled out from the ...rest params as they will be called from the instance methods

        let { to, isActive, onClick, onMouseEnter, onMouseLeave, style, hoverStyle, activeStyle, primaryColor, isDisabled, ...rest } = this.props

        style = {
            ...text,
            color: primaryColor,
            outline: 'none',
            textDecoration: 'none',
            ...style
        }

        if (isActive) {
            style = {
                ...style,
                ...activeStyle
            }
        }

        if (isDisabled) {
            style.pointerEvents = 'none'
        }
        
        if (this.state.hover) {
            style = {
                ...style,
                ...hoverStyle
            }
        }

        if (to) {
            return <Link to={to} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={style} {...rest}>{this.props.children}</Link>
        }

        return (
            <a ref={e => this.element = e} onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={style} {...rest}>{this.props.children}</a>
        )
    }

    onClick(event) {
        const { href } = this.props
        
        if (!href) {
            event.preventDefault()
        }

        this.props.onClick(event)
    }

    onMouseEnter(event) {
        this.setState({
            hover: true
        })

        this.props.onMouseEnter(event)
    }

    onMouseLeave(event) {
        this.setState({
            hover: false
        })

        this.props.onMouseLeave(event)
    }
}

Anchor.defaultProps = {
    href: '',
    primaryColor: 'tomato',
    onClick: () => null,
    onMouseEnter: () => null,
    onMouseLeave: () => null
}

export default Anchor
