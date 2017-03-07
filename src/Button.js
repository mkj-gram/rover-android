import React, { Children, Component, PropTypes } from 'react'

import { steel } from './styles/colors'
import { text } from './styles/typography'

class Button extends Component {

    constructor(props) {
        super(props)

        this.state = {
            didClick: false
        }

        this.onClick = this.onClick.bind(this)
    }

    componentWillUnmount() {
        if (this.timeoutID) {
            window.clearTimeout(this.timeoutID)
        }
    }

    render() {
        const { children: image, color, height, horizontalAlignment, imageInsets, style, title, width } = this.props

        const padding = insets => insets.reduce((padding, inset) => `${padding} ${inset}px`, '')

        let justifyContent
        switch (horizontalAlignment) {
            case 'left':
                justifyContent = 'flex-start'
                break
            case 'right':
                justifyContent = 'flex-end'
                break
            case 'center':
                justifyContent = 'center'
                break
            default:
                justifyContent = image ? 'flex-start' : 'center'
                break
        }

        return (
            <div
                onClick={this.onClick}
                style={{
                    animation: this.state.didClick ? 'flicker .4s ease-out' : null,
                    alignItems: 'center',
                    display: 'flex',
                    height,
                    justifyContent,
                    width,
                    ...style
                }}
            >
                <style dangerouslySetInnerHTML={{__html: '@keyframes flicker{0%{opacity:0.5}100%{opacity:1}}'}}/>
                {image && <div style={{ padding: padding(imageInsets) }}>{image}</div>}
                {title && <div style={{ ...text, color }}>{title}</div>}
            </div>
        )
    }

    onClick(event) {
        if (this.timeoutID) {
            window.clearTimeout(this.timeoutID)
        }

        this.setState({
            didClick: true
        })
        
        this.timeoutID = window.setTimeout(() => {
            this.setState({
                didClick: false
            })
        }, 400)

        this.props.onClick(event)
    }
}

Button.propTypes = {
    children: PropTypes.element,
    color: PropTypes.string,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['auto'])
    ]),
    horizontalAlignment: PropTypes.oneOf(['left', 'right', 'center']),
    imageInsets: PropTypes.arrayOf(PropTypes.number),
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    title: PropTypes.string,
    titleInsets: PropTypes.arrayOf(PropTypes.number),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['auto'])
    ])
}

Button.defaultProps = {
    color: steel,
    height: 30,
    imageInsets: [0, 0, 0, 0],
    onClick: () => null,
    width: 'auto'
}

export default Button