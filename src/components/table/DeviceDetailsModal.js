import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Modal,
    titanium,
    text,
    cloud,
    mercury,
    steel,
    purple,
    light,
    silver,
    RadioButton,
    TextField,
    RoundedButton,
    violet
} from '@rover/react-bootstrap'

import { LoadingIcon } from '@rover/react-icons'

import UpdateDeviceTestLabelPropertyMutation from '../../mutations/UpdateDeviceTestLabelPropertyMutation'

class DeviceDetailsModal extends Component {
    constructor(props) {
        super(props)
        const testDeviceVal = props.dataGridRows[props.index].filter(
            row =>
                row.attribute === 'is_test_device' && row.selector === 'DEVICE'
        )[0].value
        const deviceId = props.dataGridRows[props.index].filter(
            row => row.attribute === 'device_id' && row.selector === 'DEVICE'
        )[0].value
        const label = props.dataGridRows[props.index].filter(
            row => row.attribute === 'label' && row.selector === 'DEVICE'
        )[0].value

        this.state = {
            selectedView: 'Attributes',
            testDevice: testDeviceVal,
            selectedTestDevice: testDeviceVal,
            testDeviceName: label,
            updating: false,
            deviceId,
            label
        }

        this.getValue = this.getValue.bind(this)
        this.getRelativeTime = this.getRelativeTime.bind(this)
        this.attrTestView = this.attrTestView.bind(this)
        this.handleViewChange = this.handleViewChange.bind(this)
        this.viewSelector = this.viewSelector.bind(this)
        this.renderAttributesView = this.renderAttributesView.bind(this)
        this.renderTestingView = this.renderTestingView.bind(this)
        this.handleUpdatingState = this.handleUpdatingState.bind(this)
    }

    getRelativeTime(value) {
        const now = new Date()
        const secondsPast = (now.getTime() - new Date(value).getTime()) / 1000

        if (secondsPast <= 86400) {
            return `${parseInt(secondsPast / 3600)} hours ago`
        }

        if (secondsPast <= 604800) {
            return `${parseInt(secondsPast / 86400)} days ago`
        }

        if (secondsPast <= 2628000) {
            return `${parseInt(secondsPast / 604800)} weeks ago`
        }

        if (secondsPast <= 31536000) {
            return `${parseInt(secondsPast / 2628000)} months ago`
        }

        if (secondsPast > 31536000) {
            return `${parseInt(secondsPast / 31536000)} years ago`
        }
    }

    getValue(value, type) {
        let ret = value
        if (type === 'DatePredicate') {
            ret = this.getRelativeTime(value)
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
                    borderRadius: getBorderRadius(),
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

    renderAttributesView() {
        const { dataGridRows, index, allColumns } = this.props

        const segmentLine = {
            height: 1,
            backgroundColor: mercury,
            flex: '1 0 auto'
        }

        const data = () => {
            const rows = dataGridRows[index].map(row => {
                let label, value, attr
                if (row.selector.toLowerCase() === 'device') {
                    attr = allColumns.devices[row.attribute]
                } else {
                    attr = allColumns.profiles[row.attribute]
                }

                if (attr) {
                    label = attr.label
                    value = this.getValue(row.value, attr.__typename)
                    return {
                        label,
                        value
                    }
                }
            })

            return rows.filter(row => row !== undefined)
        }

        return (
            <div
                style={{
                    maxHeight: 340,
                    minHeight: 0,
                    width: '100%',
                    overflow: 'auto'
                }}
            >
                {data().map(row => (
                    <div key={`${row.label}_${row.value}`}>
                        <div style={segmentLine} />
                        <div
                            style={{
                                display: 'flex',
                                flex: '1 1 auto'
                            }}
                        >
                            <div
                                style={{
                                    marginLeft: 30,
                                    marginTop: 20,
                                    marginBottom: 15,
                                    ...text,
                                    ...light,
                                    color: steel,
                                    width: 145,
                                    overflowWrap: 'break-word'
                                }}
                            >
                                {row.label}
                            </div>
                            <div
                                style={{
                                    marginLeft: 30,
                                    marginTop: 20,
                                    marginBottom: 15,
                                    ...text,
                                    ...light,
                                    color: steel,
                                    width: 145,
                                    overflowWrap: 'break-word'
                                }}
                            >
                                {row.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    handleUpdatingState() {
        const { testDeviceName, selectedTestDevice } = this.state

        this.props.updateDataGridRows(
            this.props.index,
            selectedTestDevice,
            selectedTestDevice ? testDeviceName : ''
        )

        let state
        if (selectedTestDevice === false) {
            state = {
                updating: false,
                label: '',
                testDeviceName: '',
                testDevice: selectedTestDevice
            }
        } else {
            state = {
                updating: false,
                label: testDeviceName,
                testDevice: selectedTestDevice
            }
        }

        this.setState(state)
    }

    renderTestingView() {
        const {
            selectedTestDevice,
            testDeviceName,
            testDevice,
            deviceId,
            updating,
            label
        } = this.state

        const renderRadioButton = val => (
            <div
                style={{
                    marginRight: 20
                }}
            >
                <RadioButton
                    label={buttonLabel(val)}
                    primaryColor={purple}
                    isChecked={selectedTestDevice === val}
                    onChange={() =>
                        this.setState({
                            selectedTestDevice: val
                        })}
                />
            </div>
        )

        const buttonLabel = val => <span>{val ? 'Yes' : 'No'}</span>

        const boolSelector = () => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        marginTop: 17,
                        ...text,
                        color: silver
                    }}
                >
                    Would you like this to be a test device?
                </div>

                <div
                    style={{
                        marginTop: 15,
                        display: 'flex'
                    }}
                >
                    {renderRadioButton(true)}
                    {renderRadioButton(false)}
                </div>
            </div>
        )

        const nameDevice = () => (
            <div
                style={{
                    marginTop: 30
                }}
            >
                <div
                    style={{
                        marginBottom: 10,
                        ...text,
                        color: silver
                    }}
                >
                    Name this device (ex. John&apos;s iPhone X)
                </div>
                <TextField
                    placeholder={testDeviceName}
                    value={testDeviceName}
                    style={{
                        width: 290,
                        fontSize: 14,
                        focus: { borderColor: silver },
                        color: 'black',
                        borderColor: silver
                    }}
                    onChange={e =>
                        this.setState({
                            testDeviceName: e.target.value
                        })}
                />
            </div>
        )

        const isDisabled = () => {
            let condition
            if (selectedTestDevice === testDevice) {
                condition = true
                if (testDevice === true && testDeviceName !== label) {
                    condition = false
                }
            } else {
                condition = false
            }

            return condition
        }

        const updateButton = () => (
            <div
                style={{
                    marginTop: 30
                }}
            >
                <RoundedButton
                    type="primary"
                    primaryColor={purple}
                    hoverColor={violet}
                    isDisabled={isDisabled()}
                    style={{
                        width: 90,
                        height: 40,
                        disabledTextColor: silver,
                        disabledBackgroundColor: cloud,
                        cursor: 'pointer'
                    }}
                    onClick={() => handleUpdate()}
                    isLoading={updating}
                >
                    {!updating ? 'Update' : ''}
                </RoundedButton>
            </div>
        )

        const handleUpdate = () => {
            this.setState(
                {
                    updating: true
                },
                UpdateDeviceTestLabelPropertyMutation(
                    deviceId,
                    selectedTestDevice,
                    selectedTestDevice === true ? testDeviceName : '',
                    this.handleUpdatingState
                )
            )
        }

        return (
            <div
                style={{
                    height: selectedTestDevice ? 233 : 164,
                    display: 'flex',
                    marginLeft: 30,
                    flexDirection: 'column'
                }}
            >
                {boolSelector()}
                {selectedTestDevice ? nameDevice() : ''}
                {updateButton()}
            </div>
        )
    }

    render() {
        const { isOpen, onRequestClose } = this.props

        const { selectedView } = this.state

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
                        this.renderAttributesView()
                    ) : (
                        this.renderTestingView()
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
    allColumns: PropTypes.object
}

DeviceDetailsModal.defaultProps = {
    dataGridRows: [],
    isOpen: false,
    onRequestClose: () => null,
    index: 0,
    allColumns: {}
}

export default DeviceDetailsModal
