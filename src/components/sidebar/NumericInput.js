import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Select, silver, text, titanium } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class NumericInput extends Component {
    constructor(props) {
        super(props)

        const { numberValue, numberComparison } = this.props
        this.state = {
            numberValue,
            numberComparison
        }
    }

    componentDidMount() {
        const { numberValue } = this.state
        this.updateValue(numberValue, 0)
    }

    updateComparison(numberComparison) {
        const {
            attribute,
            category,
            __typename,
            index,
            updateFn,
            float,
            label
        } = this.props
        let numberValue = [0]

        if (numberComparison === 'in between') {
            numberValue = [0, 0]
        }

        if (
            numberComparison === 'has any value' ||
            numberComparison === 'is unknown'
        ) {
            numberValue = [null, null]
        }

        if (float) {
            updateFn({
                attribute,
                floatComparison: numberComparison,
                category,
                index,
                floatValue: numberValue,
                __typename,
                label
            })
        } else {
            updateFn({
                attribute,
                numberComparison,
                category,
                index,
                numberValue,
                __typename,
                label
            })
        }

        this.setState({ numberComparison, numberValue })
    }

    updateValue(number, valueIndex) {
        const {
            attribute,
            category,
            __typename,
            index,
            updateFn,
            float,
            label
        } = this.props
        const { numberValue, numberComparison } = this.state

        const newValue = numberValue.map(
            (num, i) => (i === valueIndex ? number : num)
        )

        if (float) {
            updateFn({
                attribute,
                floatComparison: numberComparison,
                category,
                index,
                floatValue: newValue,
                __typename,
                label
            })
        } else {
            updateFn({
                attribute,
                numberComparison,
                category,
                index,
                numberValue: newValue,
                __typename,
                label
            })
        }

        this.setState({ numberValue: newValue })
    }

    render() {
        const { attribute, category, label } = this.props
        const { numberComparison, numberValue } = this.state

        return (
            <div style={{ ...text, color: silver, width: 283 }}>
                <ModalInputPrompt
                    attributeType={category}
                    includeIs={false}
                    label={label}
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
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderLeft: 'none',
                            borderRadius: 1,
                            paddingLeft: 5
                        }}
                        isDisabled={false}
                        value={numberComparison}
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
                    {numberComparison !== 'is unknown' &&
                        numberComparison !== 'has any value' &&
                        <ModalInput
                            type="number"
                            min={0}
                            value={numberValue[0]}
                            step={this.props.float ? 0.1 : 1}
                            onChange={e => {
                                const parsedValue = this.props.float
                                    ? parseFloat(e.target.value)
                                    : parseInt(e.target.value, 10)
                                this.updateValue(parsedValue, 0)
                            }}
                        />}
                    {numberComparison === 'in between' &&
                        <div>
                            <span style={{ fontStyle: 'italic' }}>and</span>
                            <ModalInput
                                type="number"
                                min={0}
                                value={numberValue[1]}
                                step={this.props.float ? 0.1 : 1}
                                onChange={e => {
                                    const parsedValue = this.props.float
                                        ? parseFloat(e.target.value)
                                        : parseInt(e.target.value, 10)
                                    this.updateValue(parsedValue, 1)
                                }}
                            />
                        </div>}
                </div>
            </div>
        )
    }
}

NumericInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    numberValue: PropTypes.arrayOf(PropTypes.number).isRequired,
    numberComparison: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    float: PropTypes.bool,
    label: PropTypes.string.isRequired
}

NumericInput.defaultProps = {
    attribute: '',
    numberValue: [0],
    numberComparison: 'is',
    category: 'device',
    index: 0,
    updateFn: () => null,
    float: false,
    label: ''
}

export default NumericInput
