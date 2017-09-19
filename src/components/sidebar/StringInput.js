import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { light, Select, silver, text, titanium } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class StringInput extends Component {
    constructor(props) {
        super(props)

        const { stringValue, stringComparison } = this.props
        this.state = {
            stringValue,
            stringComparison
        }
    }

    componentDidMount() {
        const { stringValue } = this.state
        this.updateValue(stringValue)
    }

    updateComparison(stringComparison) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        let { stringValue } = this.state

        if (stringComparison === 'is unknown') {
            stringValue = ''
        }

        updateFn({
            attribute,
            stringComparison,
            selector,
            __typename,
            index,
            stringValue,
            label
        })
        this.setState({ stringComparison })
    }

    updateValue(stringValue) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const { stringComparison } = this.state
        updateFn({
            attribute,
            stringComparison,
            selector,
            __typename,
            index,
            stringValue,
            label
        })
        this.setState({ stringValue })
    }

    render() {
        const { selector, label } = this.props
        const { stringValue, stringComparison } = this.state

        return (
            <div style={{ ...text, ...light, color: silver, width: 380 }}>
                <ModalInputPrompt
                    selector={selector}
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
                            width: 150,
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
                        value={stringComparison}
                        onChange={e => this.updateComparison(e.target.value)}
                    >
                        <option value="is">Is</option>
                        <option value="is not">Is not</option>
                        <option value="starts with">Starts with</option>
                        <option value="contains">Contains</option>
                        <option value="does not contain">
                            Does not contain
                        </option>
                        <option value="is unknown">Is unknown</option>
                    </Select>

                    {stringComparison !== 'is unknown' &&
                        <ModalInput
                            type="text"
                            value={stringValue}
                            style={{
                                width: 200,
                                textAlign: 'left'
                            }}
                            onChange={e => this.updateValue(e.target.value)}
                        />}
                </div>
            </div>
        )
    }
}

StringInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    stringValue: PropTypes.string.isRequired,
    stringComparison: PropTypes.string.isRequired,
    selector: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

StringInput.defaultProps = {
    attribute: '',
    stringValue: '',
    stringComparison: 'is',
    selector: 'DEVICE',
    index: 0,
    updateFn: () => null,
    label: ''
}

export default StringInput
