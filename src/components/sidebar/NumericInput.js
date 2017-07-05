import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    light,
    Select,
    silver,
    steel,
    text,
    titanium
} from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class NumericInput extends Component {
    constructor(props) {
        super(props)

        const { value, comparison } = this.props
        this.state = {
            value,
            comparison
        }
    }

    updateComparison(comparison) {
        const { attribute, category, type, index, updateFn } = this.props
        let value = [0]

        if (comparison === 'in between') {
            value = [0, 0]
        }

        if (comparison === 'has any value' || comparison === 'is unknown') {
            value = [null, null]
        }

        updateFn({
            attribute,
            comparison,
            category,
            type,
            index,
            value
        })

        this.setState({ comparison, value })
    }

    updateValue(number, valueIndex) {
        const { attribute, category, type, index, updateFn } = this.props
        const { value, comparison } = this.state

        let newValue = value
        newValue[valueIndex] = number

        updateFn({
            attribute,
            comparison,
            category,
            type,
            index,
            value: newValue
        })

        this.setState({ newValue })
    }

    render() {
        const { attribute, category } = this.props
        const { comparison, value } = this.state

        return (
            <div style={{ ...text, color: silver, width: 283 }}>
                <ModalInputPrompt
                    attribute={attribute}
                    attributeType={category}
                />
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginTop: 15
                    }}
                >
                    <Select
                        style={{
                            fontFamily: 'Source Sans Pro',
                            fontSize: 16,
                            color: titanium,
                            width: 140,
                            marginRight: 20,
                            borderColor: silver,
                            focusedBorderColor: silver,
                            borderRadius: 0,
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderLeft: 'none',
                            borderRadius: 1,
                            paddingLeft: 5
                        }}
                        isDisabled={false}
                        value={comparison}
                        onChange={e => this.updateComparison(e.target.value)}
                    >
                        <option value="is">Is</option>
                        <option value="is not">Is not</option>
                        <option value="greater than">Greater than</option>
                        <option value="less than">Less than</option>
                        <option value="in between">In between</option>
                        <option value="is unknown">Is unknown</option>
                        <option value="has any value">Has any value</option>
                    </Select>
                    {comparison !== 'is unknown' &&
                        comparison !== 'has any value' &&
                        <ModalInput
                            type="number"
                            min={0}
                            value={value[0]}
                            onChange={e =>
                                this.updateValue(parseInt(e.target.value), 0)}
                        />}
                    {comparison === 'in between' &&
                        <div>
                            <span style={{ fontStyle: 'italic' }}>and</span>
                            <ModalInput
                                type="number"
                                min={0}
                                value={value[1]}
                                onChange={e =>
                                    this.updateValue(
                                        parseInt(e.target.value),
                                        1
                                    )}
                            />
                        </div>}
                </div>
            </div>
        )
    }
}

NumericInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    comparison: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired
}

NumericInput.defaultProps = {
    attribute: '',
    value: [0],
    comparison: 'is',
    category: 'device',
    index: 0,
    updateFn: () => null
}

export default NumericInput
