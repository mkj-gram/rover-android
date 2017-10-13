import React from 'react'

import Anchor from './Anchor'
import Icon from './Icon'

const { Component } = React

class AddButton extends Component {

    render() {
        const { primaryColor, onClick } = this.props
        
        let { style = {} } = this.props
    
        style = {

            root: {
                background: primaryColor,
                borderRadius: 4,
                display: 'inline-block',
                height: 24,
                marginRight: 10,
                padding: 4,
                width: 24,
                ...style.root
            },

            icon: { 
                display: 'block',
                fill: 'white',
                ...style.icon
            }
        }

        return (
            <Anchor style={style.root} onClick={onClick}>
                <Icon type={'plus-sign'} style={style.icon}/>
            </Anchor>
        )
    }
}

AddButton.defaultProps = {
    primaryColor: 'tomato',
    onClick: () => null
}

export default AddButton
