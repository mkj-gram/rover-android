import React, { Component } from 'react'
import { steel, semibold, silver } from '@rover/react-bootstrap'
import { TestDeviceIcon } from '@rover/react-icons'

class BooleanCellFormatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            underline: false
        }
    }

    onHover(val) {
         this.setState({
            underline: val
        })
    }

    render() {
        const { column, value } = this.props
        const { underline } = this.state
        let view

        const getDisplayValue = () => {
            if (value === null || value === undefined || value === '') {
                return 'Unknown'
            }
            return value ? 'True' : 'False'
        }
        const displayValue = getDisplayValue()

            if (displayValue !== 'Unknown') {
                view = (
                    <div
                        style={{
                            fontSize: 14,
                            minWidth: 80,
                            fontWeight: semibold,
                            color: steel,
                            cursor: 'pointer',
                            textDecoration: underline ? 'underline' : 'none'
                        }}
                        onMouseEnter={() => this.onHover(true)}
                        onMouseLeave={() => this.onHover(false)}
                        onClick={() => this.props.onCellSelected(this.props)}
                    >
                        {displayValue}
                    </div>
                )
            } else {
                view = (
                    <div
                        style={{
                            fontSize: 14,
                            minWidth: 80,
                            fontWeight: semibold,
                            color: silver
                        }}
                    >
                        Unknown
                    </div>
                )
            }
            
        return view
    }
}

export default BooleanCellFormatter
