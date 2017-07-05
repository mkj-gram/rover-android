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
                label={
                    <span style={{ color: 'white' }}>
                        {radioValue ? 'True' : 'False'}
                    </span>
                }
                onChange={() => this.updateBooleanValue(radioValue, () => null)}
                isChecked={value === radioValue}
                primaryColor={lavender}
                style={{
                    backgroundColor: graphite,
                    borderColor: steel,
                    marginRight: 5
                }}
            />
        )
    }

    updateBooleanValue(value) {
        const { predicate, updateFn } = this.props
        const { attribute, category, type } = predicate
        updateFn({
            attribute,
            category,
            type,
            comparison: 'true',
            value: value
        })
        this.setState({ value })
    }

    render() {
        const { predicate } = this.props
        const { attribute, category } = predicate
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
                    attributeType={category}
                />
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
    predicate: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        value: PropTypes.bool.isRequired,
        comparison: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
    }),
    updateFn: PropTypes.func.isRequired
}

BooleanInput.defaultProps = {
    predicate: {
        attribute: '',
        value: false,
        comparison: 'true',
        category: 'profile'
    },
    updateFn: () => null
}

export default BooleanInput
