import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { mercury, text, light, steel } from '@rover/react-bootstrap'
import getRelativeTime from '../../utils/getRelativeTime'

class DeviceDetailsAttributesView extends Component {
    constructor(props) {
        super(props)
        this.getRows = this.getRows.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    getValue(value, type) {
        let ret = value
        if (type === 'DatePredicate') {
            ret = getRelativeTime(value)
        } else if (type === 'BooleanPredicate') {
            ret = value ? 'True' : 'False'
        } else if (
            type === 'StringArrayPredicate' ||
            type === 'VersionPredicate'
        ) {
            ret = value.join(', ')
        }
        return ret
    }

    getRows() {
        const { dataGridRows, index, allColumns } = this.props
        const segmentLine = {
            height: 1,
            backgroundColor: mercury,
            flex: '1 0 auto'
        }
        const attributeStyle = {
            marginLeft: 30,
            marginTop: 20,
            marginBottom: 15,
            ...text,
            ...light,
            color: steel,
            width: 145,
            overflowWrap: 'break-word'
        }

        const rows = []
        dataGridRows[index].forEach(row => {
            let attr, label, value
            if (row.selector.toLowerCase() === 'device') {
                attr = allColumns.devices[row.attribute]
            } else {
                attr = allColumns.profiles[row.attribute]
            }

            if (attr) {
                label = attr.label
                value = this.getValue(row.value, attr.__typename)

                rows.push(
                    <div key={`${label}_${value}`}>
                        <div style={segmentLine} />
                        <div
                            style={{
                                display: 'flex',
                                flex: '1 1 auto'
                            }}
                        >
                            <div style={attributeStyle}>{label}</div>
                            <div style={attributeStyle}>{value}</div>
                        </div>
                    </div>
                )
            }
        })
        return rows
    }

    render() {
        return (
            <div
                style={{
                    maxHeight: 340,
                    minHeight: 0,
                    width: '100%',
                    overflow: 'auto'
                }}
            >
                {this.getRows()}
            </div>
        )
    }
}

DeviceDetailsAttributesView.propTypes = {
    dataGridRows: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    allColumns: PropTypes.object.isRequired
}

DeviceDetailsAttributesView.defaultProps = {}

export default DeviceDetailsAttributesView
