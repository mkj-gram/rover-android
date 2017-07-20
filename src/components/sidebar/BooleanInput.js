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
        const { attribute, category, updateFn, index, __typename } = this.props
        updateFn({
            attribute,
            category,
            index,
            booleanComparison: 'true',
            booleanValue,
            __typename
        })
        this.setState({ booleanValue })
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
    booleanValue: PropTypes.bool.isRequired,
    category: PropTypes.string.isRequired,
    updateFn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    __typename: PropTypes.string.isRequired
}

BooleanInput.defaultProps = {
    attribute: '',
    booleanValue: true,
    booleanComparison: 'true',
    category: 'profile',
    updateFn: () => null,
    index: 0,
    __typename: 'BooleanPredicate'
}

export default BooleanInput
