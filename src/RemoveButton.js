import React, { Component } from 'react'

import RemoveIcon from './icons/RemoveIcon'
import { red, silver } from '../styles/colors'

class RemoveButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isOver: false
        }

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
    }

    render() {
        return (
            <div
                {...this.props}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <RemoveIcon 
                    style={{
                        display: 'block',
                        fill: this.state.isOver ? red : silver
                    }}
                    
                />
            </div>
        )
    }

    onMouseEnter(event) {
        this.setState({
            isOver: true
        })
        this.props.onMouseEnter(event)
    }

    onMouseLeave(event) {
        this.setState({
            isOver: false
        })
        this.props.onMouseLeave(event)
    }
}

RemoveButton.defaultProps = {
    onClick: () => null,
    onMouseEnter: () => null,
    onMouseLeave: () => null
}

export default RemoveButton
