import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    light,
    Select,
    silver,
    text,
    titanium
} from '@rover/react-bootstrap'

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
        const { attribute, category, __typename, index, updateFn } = this.props
        let { stringValue } = this.state

        if (stringComparison === 'is unknown') {
            stringValue = ''
        }

        updateFn({
            attribute,
            stringComparison,
            category,
            __typename,
            index,
            stringValue
        })
        this.setState({ stringComparison })
    }

    updateValue(stringValue) {
        const { attribute, category, __typename, index, updateFn } = this.props
        const { stringComparison } = this.state
        updateFn({
            attribute,
            stringComparison,
            category,
            __typename,
            index,
            stringValue
        })
        this.setState({ stringValue })
    }

    render() {
        const { attribute, category } = this.props
        const { stringValue, stringComparison } = this.state
        return (
            <div style={{ ...text, ...light, color: silver, width: 380 }}>
                <ModalInputPrompt
                    attributeType={category}
                    attribute={attribute}
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
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired
}

StringInput.defaultProps = {
    attribute: '',
    stringValue: '',
    stringComparison: 'is',
    category: 'device',
    index: 0,
    updateFn: () => null
}

export default StringInput
