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
            value: this.props.predicate.value
        }
    }

    renderRadioButton(radioValue) {
        const { value } = this.state
        return (
            <RadioButton
                onChange={() => this.updateBooleanValue(radioValue, () => null)}
                isChecked={value === radioValue}
                primaryColor={lavender}
                style={{
                    backgroundColor: graphite,
                    borderColor: steel,
                    marginRight: 5
                }}
                labelStyle={{
                    top: 2
                }}
            />
        )
    }

    updateBooleanValue(value) {
        const { predicate, updateFn } = this.props
        const { attribute } = predicate
        updateFn({
            attribute: attribute,
            comparison: 'true',
            value: value
        })
        this.setState({ value })
    }

    render() {
        const { predicate, attributeType } = this.props
        const { attribute } = predicate
        const radioFieldStyle = {
            display: 'flex',
            color: titanium,
            marginTop: 20,
            fontSize: 16,
            fontWeight: 400
        }
        return (
            <div style={{ ...text, ...light, color: silver }}>
                <ModalInputPrompt
                    attribute={attribute}
                    attributeType={attributeType}
                />
                <div style={radioFieldStyle}>
                    {this.renderRadioButton(true)} True
                </div>
                <div style={radioFieldStyle}>
                    {this.renderRadioButton(false)} False
                </div>
            </div>
        )
    }
}

BooleanInput.propTypes = {
    predicate: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        value: PropTypes.bool.isRequired,
        comparison: PropTypes.string.isRequired
    }),
    updateFn: PropTypes.func.isRequired
}

BooleanInput.defaultProps = {
    predicate: {
        attribute: '',
        value: false,
        comparison: 'true'
    },
    updateFn: () => null
}

export default BooleanInput
