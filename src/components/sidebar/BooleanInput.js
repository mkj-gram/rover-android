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
            booleanValue: this.props.booleanValue
        }
    }

    componentDidMount() {
        const { booleanValue } = this.state
        this.updateBooleanValue(booleanValue)
    }

    renderRadioButton(radioValue) {
        const { booleanValue } = this.state
        return (
            <RadioButton
                label={
                    <span style={{ color: 'white' }}>
                        {radioValue ? 'True' : 'False'}
                    </span>
                }
                onChange={() => this.updateBooleanValue(radioValue, () => null)}
                isChecked={booleanValue === radioValue}
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
        updateFn({
            attribute,
            selector,
            index,
            booleanComparison: 'is equal',
            booleanValue,
            __typename,
            label
        })
        this.setState({ booleanValue })
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
            </div>
        )
    }
}

BooleanInput.propTypes = {
    attribute: PropTypes.string.isRequired,
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
