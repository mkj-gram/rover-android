import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    graphite,
    lavender,
    light,
    RadioButton,
    steel,
    silver,
    text,
    titanium
} from '@rover/react-bootstrap'

import ModalInputPrompt from './ModalInputPrompt'

class BooleanInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            booleanComparison: this.props.booleanComparison,
            booleanValue: this.props.booleanValue
        }
    }

    componentDidMount() {
        const { booleanValue } = this.state
        this.updateBooleanValue(booleanValue)
    }

    renderRadioButton(radioValue) {
        const { booleanComparison, booleanValue } = this.state
        const onChange = () => {
            if (radioValue === 'is unset') {
                return this.updateBooleanComparison('is unset')
            }
            this.setState(
                { booleanComparison: 'is equal' },
                () => this.updateBooleanValue(radioValue)
            )
        }
        const getDisplayValue = () => {
            if (radioValue === 'is unset') {
                return 'Is unknown'
            }
            return radioValue ? 'True' : 'False'
        }
        const getIsChecked = () => {
            if (booleanComparison === 'is unset') {
                return radioValue === 'is unset'
            }
            return booleanValue === radioValue
        }
        return (
            <RadioButton
                label={
                    <span style={{ color: 'white' }}>{getDisplayValue()}</span>
                }
                onChange={onChange}
                isChecked={getIsChecked()}
                primaryColor={lavender}
                style={{
                    backgroundColor: graphite,
                    borderColor: steel,
                    marginRight: 5
                }}
            />
        )
    }

    updateBooleanValue(booleanValue) {
        const {
            attribute,
            selector,
            updateFn,
            index,
            __typename,
            label
        } = this.props
        const { booleanComparison } = this.state
        updateFn({
            attribute,
            selector,
            index,
            booleanComparison,
            booleanValue,
            __typename,
            label
        })
        this.setState({ booleanComparison, booleanValue })
    }

    updateBooleanComparison(booleanComparison) {
        const {
            attribute,
            selector,
            updateFn,
            index,
            __typename,
            label
        } = this.props
        const { booleanValue } = this.state
        updateFn({
            attribute,
            selector,
            index,
            booleanComparison,
            booleanValue,
            __typename,
            label
        })
        this.setState({ booleanComparison })
    }

    render() {
        const { label, selector } = this.props
        const radioFieldStyle = {
            display: 'flex',
            color: titanium,
            marginTop: 20,
            fontSize: 16,
            fontWeight: 400
        }
        return (
            <div style={{ ...text, ...light, color: silver }}>
                <ModalInputPrompt label={label} selector={selector} />
                <div style={radioFieldStyle}>
                    {this.renderRadioButton(true)}
                </div>
                <div style={radioFieldStyle}>
                    {this.renderRadioButton(false)}
                </div>
                <div style={radioFieldStyle}>
                    {this.renderRadioButton('is unset')}
                </div>
            </div>
        )
    }
}

BooleanInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    booleanComparison: PropTypes.string,
    booleanValue: PropTypes.bool.isRequired,
    selector: PropTypes.string.isRequired,
    updateFn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

BooleanInput.defaultProps = {
    attribute: '',
    booleanValue: true,
    booleanComparison: 'is equal',
    selector: 'DEVICE',
    updateFn: () => null,
    index: 0,
    __typename: 'BooleanPredicate',
    label: ''
}

export default BooleanInput
