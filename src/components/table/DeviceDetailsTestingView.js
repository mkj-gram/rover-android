import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    purple,
    text,
    silver,
    violet,
    cloud,
    RadioButton,
    TextField,
    RoundedButton
} from '@rover/react-bootstrap'

import UpdateDeviceTestLabelPropertyMutation from '../../mutations/UpdateDeviceTestLabelPropertyMutation'

class DeviceDetailsTestingView extends Component {
    constructor(props) {
        super(props)
        const testDeviceName = props.dataGridRows[props.index].filter(
            row => row.attribute === 'label' && row.selector === 'DEVICE'
        )[0].value
        const deviceId = props.dataGridRows[props.index].filter(
            row => row.attribute === 'device_id' && row.selector === 'DEVICE'
        )[0].value

        this.state = {
            testDeviceName,
            testDevice: props.selectedTestDevice,
            label: testDeviceName,
            deviceId,
            updating: false
        }

        this.boolSelector = this.boolSelector.bind(this)
        this.nameDevice = this.nameDevice.bind(this)
        this.updateButton = this.updateButton.bind(this)
        this.handleUpdatingState = this.handleUpdatingState.bind(this)
    }

    handleUpdatingState() {
        const { testDeviceName } = this.state
        const { selectedTestDevice } = this.props
        const { index } = this.props

        this.props.updateDataGridRows(
            index,
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

    updateButton(selectedTestDevice) {
        const {
            testDevice,
            updating,
            deviceId,
            testDeviceName,
            label
        } = this.state

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
    }

    nameDevice() {
        const { testDeviceName } = this.state
        return (
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
                    Name this device (ex. Alex&apos;s iPhone X)
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
    }

    boolSelector(selectedTestDevice) {
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
                    onChange={() => this.props.updateSelectedTestDevice(val)}
                />
            </div>
        )

        const buttonLabel = val => <span>{val ? 'Yes' : 'No'}</span>

        return (
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
    }

    render() {
        const { selectedTestDevice } = this.props
        return (
            <div
                style={{
                    height: selectedTestDevice ? 233 : 164,
                    display: 'flex',
                    marginLeft: 30,
                    flexDirection: 'column'
                }}
            >
                {this.boolSelector(selectedTestDevice)}
                {selectedTestDevice ? this.nameDevice() : ''}
                {this.updateButton(selectedTestDevice)}
            </div>
        )
    }
}

DeviceDetailsTestingView.propTypes = {
    selectedTestDevice: PropTypes.bool.isRequired,
    dataGridRows: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    updateDataGridRows: PropTypes.func.isRequired,
    updateSelectedTestDevice: PropTypes.func.isRequired
}

DeviceDetailsTestingView.defaultProps = {}

export default DeviceDetailsTestingView
