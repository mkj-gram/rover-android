import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Modal,
    titanium,
    text,
    cloud,
    steel,
    purple
} from '@rover/react-bootstrap'
import DeviceDetailsAttributesView from './DeviceDetailsAttributesView'
import DeviceDetailsTestingView from './DeviceDetailsTestingView'

class DeviceDetailsModal extends Component {
    constructor(props) {
        super(props)
        const selectedTestDevice = props.dataGridRows[props.index].filter(
            row =>
                row.attribute === 'is_test_device' && row.selector === 'DEVICE'
        )[0].value

        this.state = {
            selectedView: 'Attributes',
            selectedTestDevice
        }

        this.attrTestView = this.attrTestView.bind(this)
        this.handleViewChange = this.handleViewChange.bind(this)
        this.viewSelector = this.viewSelector.bind(this)
        this.updateSelectedTestDevice = this.updateSelectedTestDevice.bind(this)
    }

    handleViewChange(val) {
        this.setState({
            selectedView: val
        })
    }

    attrTestView(val) {
        const getBorderRadius = () => {
            return val === 'Attributes' ? '3px 0 0 3px' : '0 3px 3px 0'
        }

        const { selectedView } = this.state
        return (
            <div
                style={{
                    width: 145,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...text,
                    backgroundColor: selectedView === val ? purple : 'white',
                    color: selectedView === val ? 'white' : purple,
                    marginTop: 13,
                    marginBottom: 13,
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: purple,
                    borderRadius: getBorderRadius()
                }}
                onClick={() => this.handleViewChange(val)}
            >
                {val}
            </div>
        )
    }

    viewSelector() {
        return (
            <div
                style={{
                    height: 57,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {this.attrTestView('Attributes')}
                {this.attrTestView('Testing')}
            </div>
        )
    }

    updateSelectedTestDevice(val) {
        this.setState({
            selectedTestDevice: val
        })
    }

    render() {
        const {
            isOpen,
            onRequestClose,
            dataGridRows,
            index,
            allColumns
        } = this.props

        const { selectedView, selectedTestDevice } = this.state

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={() => onRequestClose()}
                style={{
                    content: {
                        backgroundColor: 'white',
                        padding: 0,
                        width: 'auto',
                        overflow: 'hidden'
                    },
                    overlay: {
                        zIndex: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }}
                hoverStyle={{
                    backgroundColor: titanium
                }}
                bodyOpenClassName="SegmentSelections"
            >
                <div
                    style={{
                        minHeight: 110,
                        maxHeight: 450,
                        width: 350,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div
                        style={{
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: cloud,
                            paddingLeft: 30,
                            color: steel,
                            fontSize: 14,
                            ...text,
                            fontWeight: 600
                        }}
                    >
                        Device Details
                    </div>

                    {this.viewSelector()}
                    {selectedView === 'Attributes' ? (
                        <DeviceDetailsAttributesView
                            dataGridRows={dataGridRows}
                            index={index}
                            allColumns={allColumns}
                        />
                    ) : (
                        <DeviceDetailsTestingView
                            updateSelectedTestDevice={
                                this.updateSelectedTestDevice
                            }
                            selectedTestDevice={selectedTestDevice}
                            dataGridRows={dataGridRows}
                            updateDataGridRows={this.props.updateDataGridRows}
                            index={index}
                        />
                    )}
                </div>
            </Modal>
        )
    }
}

DeviceDetailsModal.propTypes = {
    dataGridRows: PropTypes.array,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    index: PropTypes.number,
    allColumns: PropTypes.object,
    updateDataGridRows: PropTypes.func
}

DeviceDetailsModal.defaultProps = {
    dataGridRows: [],
    isOpen: false,
    onRequestClose: () => null,
    index: 0,
    allColumns: {},
    updateDataGridRows: () => null
}

export default DeviceDetailsModal
