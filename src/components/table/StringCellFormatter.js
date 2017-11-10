/* eslint react/prop-types: 0 */
import React, { Component } from 'react'
import { silver, text, steel } from '@rover/react-bootstrap'

class StringCellFormatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            underline: false
        }
        this.handleClick = this.handleClick.bind(this)
    }

    onHover(val) {
        this.setState({
            underline: val
        })
    }

    handleClick() {
        const { column, onCellSelected } = this.props
        if (column.key !== 'label_DEVICE') {
            onCellSelected(this.props)
        }
    }

    render() {
        const { value, column } = this.props
        const { underline } = this.state

        let displayValue = value
        // Display undefined lat/long as empty string instead of "0"
        if (
            (column.name === 'Latitude' || column.name === 'Longitude') &&
            value === 0
        ) {
            displayValue = 'Unknown'
        } else if (value.length === 0) {
            displayValue = 'Unknown'
        }

        if (displayValue !== 'Unknown') {
            return (
                <div
                    style={{
                        width: column.width - 20,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-block',
                            cursor: column.key !== 'label_DEVICE' ? 'pointer' : 'default',
                            textDecoration: (underline && column.key !== 'label_DEVICE') ? 'underline' : 'none'
                        }}
                        onMouseEnter={() => this.onHover(true)}
                        onMouseLeave={() => this.onHover(false)}
                        onClick={() => this.handleClick()}
                    >
                        {displayValue}
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    style={{
                        width: column.width - 20,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        ...text,
                        color: silver
                    }}
                >
                    Unknown
                </div>
            )
        }
    }
}

export default StringCellFormatter
