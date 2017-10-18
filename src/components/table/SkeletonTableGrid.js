import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    offwhite,
    steel,
    text,
    semibold
} from '@rover/react-bootstrap'

import {
    TestDeviceIcon
} from '@rover/react-icons'

class SkeletonTableGrid extends Component {
    constructor(props) {
        super(props)
        this.renderCells = this.renderCells.bind(this)
    }

    renderCells(arr, header = false) {
        return (
            <div style={{ display: 'flex' }}>
                {arr.map(name => (
                    <div
                        style={{
                            ...text,
                            ...semibold,
                            height: 50,
                            width: (name === 'is_test_device_DEVICE') ? 50 : (this.props.selectedColumns[name].width || 200),
                            display: 'flex',
                            paddingLeft: 21,
                            paddingTop: (name === 'is_test_device_DEVICE') ? 14 : 19,
                            paddingBottom: 8,
                            paddingRight: 8,
                            backgroundColor: header ? offwhite : 'white',
                            color: steel,
                            borderRight: '1px solid #EEEEEE',
                            borderBottom: '1px solid #EEEEEE'
                        }}
                        key={name}
                    />
                ))}
                <div
                    style={{
                        flex: '1 1 auto',
                        borderRight: '1px solid #EEEEEE',
                        borderBottom: '1px solid #EEEEEE',
                        backgroundColor: header ? '#F9F9F9' : 'white'
                    }}
                />
            </div>
        )
    }

    render() {
        const numRows = Math.floor((window.innerHeight - 130 - 50) / 50)
        const numCol = Math.floor((window.innerWidth - 300) / 200)
        const fakeTable = [...Array(numRows)]

        const columns = Object.keys(this.props.selectedColumns).slice(0, numCol)
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 100%'
                }}
            >
                {this.renderCells(columns, true)}
                {fakeTable.map((elem, index) => (
                    <div key={index}>{this.renderCells(columns, false)}</div>
                ))}
            </div>
        )
    }
}

SkeletonTableGrid.propTypes = {
    selectedColumns: PropTypes.object
}

SkeletonTableGrid.defaultProps = {
    selectedColumns: {}
}

export default SkeletonTableGrid
