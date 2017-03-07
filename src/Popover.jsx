import React from 'react'
import ReactDOM from 'react-dom'
import TetherComponent from 'react-tether'

import IconButton from './IconButton'

const { Component } = React

class Popover extends Component {

    constructor(props) {
        super(props)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('click', this.handleClick)
    }

    handleKeyDown(event) {
        if (event.keyCode === 27 && this.props.closeOnEscape) {
            this.props.onRequestClose()
        }
    }

    handleClick(event) {
        if (!this.props.closeOnClickOutside || !this.contentElement) {
            return
        }

        const targetElement = ReactDOM.findDOMNode(this.tetherComponent)
        const clickedOutside = !targetElement.contains(event.target) && !this.contentElement.contains(event.target)
        if (clickedOutside) {
            this.props.onRequestClose()
        }
    }

    render() {

        const { isOpen, style, attachment, targetAttachment, offset, targetOffset, hideCloseButton, children, onRequestClose } = this.props

        let { arrow: arrowStyle, closeButton: closeButtonStyle, ...contentStyle } = style

        contentStyle = {
            ...Popover.defaultStyles.content,
            ...contentStyle
        }

        arrowStyle = {
            ...Popover.defaultStyles.arrow,
            ...arrowStyle
        }

        closeButtonStyle = {
            ...Popover.defaultStyles.closeButton,
            ...closeButtonStyle
        }

        const horizontalAttachment = attachment.split(' ')[1]
        const verticalAttachment = attachment.split(' ')[0]

        switch(horizontalAttachment) {
            case 'left':
                contentStyle.marginLeft = -20
                arrowStyle.left = 10
                break
            case 'right':
                contentStyle.marginRight = -20
                arrowStyle.right = 10
                break
        }

        switch(verticalAttachment) {
            case 'top':
                contentStyle.animation = 'slideDown 0.2s ease-out'
                contentStyle.marginTop = 10
                arrowStyle.borderLeftColor = 'transparent'
                arrowStyle.borderRightColor = 'transparent'
                arrowStyle.borderTopColor = 'transparent'
                arrowStyle.top = -20
                break
        }

        let closeButtonElement
        if (!hideCloseButton) {
            closeButtonElement = (
                <IconButton type={'close'} onClick={onRequestClose} style={closeButtonStyle}/>
            )
        }

        let contentElement
        if (isOpen) {
            contentElement = (
                <div style={contentStyle} ref={ref => this.contentElement = ref}>
                    {closeButtonElement}
                    {children[1]}
                    <div ref={ref => this.arrowElement = ref} style={arrowStyle}></div>
                </div>
            )
        }

        return (
            <TetherComponent ref={e => this.tetherComponent = e} attachment={attachment} targetAttachment={targetAttachment} offset={offset} targetOffset={targetOffset}>
                {children[0]}
                {contentElement}
            </TetherComponent>
        )
    }
}

Popover.defaultProps = { 
    isOpen: false, 
    style: {}, 
    attachment: 'top left', 
    targetAttachment: 'bottom center', 
    offset: '0 0', 
    targetOffset: '0 0', 
    hideCloseButton: false, 
    closeOnClickOutside: true,
    closeOnEscape: true,
    onRequestClose: () => null 
}

Popover.defaultStyles = {
    content: {
        background: 'white',
        borderRadius: 5,
        boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.25)',
        padding: '40px 20px 20px 20px',
        position: 'relative'
    },
    arrow: {
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 10,
        position: 'absolute',
        width: 0,
        height: 0
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    }
}

export default Popover