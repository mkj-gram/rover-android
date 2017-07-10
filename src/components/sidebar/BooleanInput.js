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
            value: this.props.value
        }
    }

    componentDidMount() {
        const { value } = this.state
        this.updateBooleanValue(value)
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
        const { attribute, category, type, updateFn, index } = this.props
        updateFn({
            attribute,
            category,
            type,
            index,
            comparison: 'true',
            value: value
        })
        this.setState({ value })
    }

    render() {
        const { attribute, category } = this.props
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
    attribute: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    comparison: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    updateFn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

BooleanInput.defaultProps = {
    attribute: '',
    value: true,
    comparison: 'true',
    category: 'profile',
    updateFn: () => null,
    index: 0
}

export default BooleanInput
