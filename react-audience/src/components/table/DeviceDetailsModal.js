import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Modal,
    titanium,
    text,
    cloud,
    steel,
    purple,
    PrimaryNavigator
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
            selectedTestDevice
        }

        this.attrTestView = this.attrTestView.bind(this)
        this.handleViewChange = this.handleViewChange.bind(this)
        this.viewSelector = this.viewSelector.bind(this)
        this.updateSelectedTestDevice = this.updateSelectedTestDevice.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen) {
            this.setState({
                selectedTestDevice:
                nextProps.dataGridRows[nextProps.index].filter(
                    row =>
                        row.attribute === 'is_test_device' &&
                        row.selector === 'DEVICE'
                )[0].value
            })
        }
    }

    handleViewChange(val) {
        this.props.updateSelectedView(val)
    }

    attrTestView(val) {
        const { selectedView } = this.props
        const attributesSelected = selectedView === 'Attributes'
        const selectors = [
            {
                icon: () => null,
                title: 'Attributes',
                isSelected: attributesSelected,
                path: 'Attributes'
            },
            {
                icon: () => null,
                title: 'Testing',
                isSelected: !attributesSelected,
                path: 'Testing'
            }
        ]
        return (
            <PrimaryNavigator
                navigatorStyle={{
                    width: 290,
                    height: 30,
                    marginTop: 13,
                    marginBottom: 13
                }}
                selectors={selectors}
                onClick={this.handleViewChange}
                color={purple}
                selectorStyle={{
                    fontWeight: '400'
                }}
                titleStyle={{
                    marginLeft: 0
                }}
            />
        )
    }

    viewSelector() {
        const { selectedView } = this.props
        return (
            <div
                style={{
                    height: 57,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {this.attrTestView(selectedView)}
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
            allColumns,
            selectedView
        } = this.props

        const { selectedTestDevice } = this.state

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
                            handleCellEnter={this.props.handleCellEnter}
                            handleCellLeave={this.props.handleCellLeave}
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
    allColumns: PropTypes.object,
    dataGridRows: PropTypes.array,
    handleCellEnter: PropTypes.func.isRequired,
    handleCellLeave: PropTypes.func.isRequired,
    index: PropTypes.number,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    selectedView: PropTypes.string,
    updateDataGridRows: PropTypes.func,
    updateSelectedView: PropTypes.func.isRequired
}

DeviceDetailsModal.defaultProps = {
    dataGridRows: [],
    isOpen: false,
    onRequestClose: () => null,
    index: 0,
    allColumns: {},
    updateDataGridRows: () => null,
    selectedView: 'Attributes'
}

export default DeviceDetailsModal
