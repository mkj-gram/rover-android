import React, {Component} from 'react'
import { purple, semibold } from '@rover/react-bootstrap'
import {
    TestDeviceIcon
} from '@rover/react-icons'

class BooleanCellFormatter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { column, value } = this.props
        let view

        const getDisplayValue = () => {
            if (value === null || value === undefined || value === '') {
                return ''
            }
            return value ? 'True' : 'False'
        }

        if (column.key === 'is_test_device_DEVICE') {
            view = (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {value ? TestDeviceIcon() : ''}
                </div>
            )
        } else {
            view = (
                 <div
                    style={{
                        fontSize: 14,
                        minWidth: 80,
                        fontWeight: semibold,
                        color: purple
                    }}
                >
                    {getDisplayValue()}
                </div>
            )
        }
        return view
    }
}

export default BooleanCellFormatter
