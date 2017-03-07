import React from 'react'

import { text } from '../../styles/typography'
import { silver } from '../../styles/colors'

const { Component } = React

class Label extends Component {

    render() {

        let { style, children, ...rest } = this.props

        style = {
            ...text,
            display: 'block',
            color: silver,
            ...style
        }

        return (
            <label style={style} {...rest}>{children}</label>
        )
    }

}

export default Label
