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
import StringInputTypeAhead from './StringInputTypeAhead'
// Will use StringInputQueryRenderer once true typeahead is supported
// import StringInputQueryRenderer from '../relayContainers/StringInputQueryRenderer'

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
            label,
            options
        } = this.props

        const stringValue = ''

        updateFn({
            attribute,
            stringComparison,
            selector,
            __typename,
            index,
            stringValue,
            label,
            options
        })
        this.setState({ stringComparison, stringValue })
    }

    updateValue(stringValue) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label,
            options
        } = this.props
        const { stringComparison } = this.state
        updateFn({
            attribute,
            stringComparison,
            selector,
            __typename,
            index,
            stringValue,
            label,
            options
        })
        this.setState({ stringValue })
    }

    renderInputComponent() {
        const { attribute, options, selector, successFn } = this.props
        const { stringComparison, stringValue } = this.state

        if (stringComparison.includes('is') && options) {
            return (
                <StringInputTypeAhead
                    attribute={attribute}
                    key={stringComparison}
                    data={{ suggestions: options }}
                    selector={selector}
                    stringValue={stringValue}
                    successFn={successFn}
                    updateValue={value => this.updateValue(value)}
                />
            )
        }

        return (
            <ModalInput
                key={stringComparison}
                type="text"
                value={stringValue}
                style={{
                    width: 200,
                    textAlign: 'left',
                    paddingBottom: 4,
                    height: 23,
                    marginTop: 2
                }}
                onChange={e => this.updateValue(e.target.value)}
                onKeyDown={e => e.keyCode === 13 && e.target.value.length > 0 && successFn()}
            />
        )
    }

    render() {
        const { selector, label } = this.props
        const { stringComparison } = this.state

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
                            borderRadius: 0,
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
                        <option value="is set">Exists</option>
                        <option value="is unset">Does not exist</option>
                    </Select>
                    {!stringComparison.includes('set') && this.renderInputComponent()}
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
    successFn: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
}

StringInput.defaultProps = {
    attribute: '',
    stringValue: '',
    stringComparison: 'is',
    selector: 'DEVICE',
    index: 0,
    updateFn: () => null,
    label: '',
    options: []
}

export default StringInput
