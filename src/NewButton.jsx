import React from 'react'

import AddButton from './AddButton'
import Anchor from './Anchor'

import { text as textStyle, large } from '../styles/typography'

const { Component } = React

class NewButton extends Component {

    render() {
        const { primaryColor, style, children, onClick } = this.props

        let { button: buttonStyle, text: textStyle, ...containerStyle } = style

        containerStyle = {
            ...NewButton.defaultStyles.container,
            ...containerStyle
        }

        buttonStyle = {
            ...NewButton.defaultStyles.button,
            ...buttonStyle
        }

        textStyle = {
            ...NewButton.defaultStyles.text,
            ...textStyle
        }

        return (
            <div style={containerStyle}>
                <AddButton primaryColor={primaryColor} style={buttonStyle} onClick={onClick}/>
                <Anchor style={textStyle} onClick={onClick}>{children}</Anchor>
            </div>
        )  
    }
}

NewButton.defaultStyles = {
    container: {
        alignItems: 'center',
        display: 'flex'
    },
    button: {
    },
    text: {
        ...textStyle,
        ...large
    }
}

NewButton.defaultProps = {
    primaryColor: 'tomato',
    style: {},
    onClick: () => null
}

export default NewButton
