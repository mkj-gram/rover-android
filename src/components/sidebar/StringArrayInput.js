import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    light,
    Select,
    silver,
    text,
    titanium,
    steel
} from '@rover/react-bootstrap'

import ModalInputPrompt from './ModalInputPrompt'
import SelectedTags from './SelectedTags'
import AddTag from './AddTag'

class StringArrayInput extends Component {
    constructor(props) {
        super(props)
        const { stringArrayValue, stringArrayComparison } = this.props
        this.state = {
            stringArrayComparison,
            stringArrayValue
        }
        this.updateComparison = this.updateComparison.bind(this)
        this.updateTags = this.updateTags.bind(this)
        this.updateValue = this.updateValue.bind(this)
    }

    componentDidMount() {
        this.updateValue(
            this.state.stringArrayComparison,
            this.state.stringArrayValue
        )
    }

    updateValue(stringArrayComparison, stringArrayValue) {
        const {
            attribute,
            category,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        updateFn({
            attribute,
            stringArrayComparison,
            category,
            __typename,
            index,
            stringArrayValue,
            label
        })
    }

    updateComparison(stringArrayComparison) {
        this.setState({ stringArrayComparison })
        this.updateValue(stringArrayComparison, this.state.stringArrayValue)
    }

    updateTags(val = null, action, position = null) {
        let stringArrayValue
        if (action === 'add') {
            stringArrayValue = this.state.stringArrayValue.slice(0)
            stringArrayValue.push(val)
        } else if (action === 'delete') {
            stringArrayValue = this.state.stringArrayValue.slice(0)
            stringArrayValue.splice(position, 1)
        }
        this.setState({
            stringArrayValue
        })
        this.updateValue(this.state.stringArrayComparison, stringArrayValue)
    }

    render() {
        const { category, label } = this.props
        const { stringArrayComparison } = this.state
        return (
            <div
                style={{ ...text, ...light, color: silver, width: 380 }}
                id="stringArrayInputContainer"
            >
                <div>Include devices with a profile that</div>
                <div
                    style={{
                        marginTop: 15
                    }}
                >
                    <Select
                        style={{
                            fontFamily: 'Source Sans Pro',
                            fontSize: 16,
                            color: titanium,
                            width: 290,
                            marginRight: 20,
                            borderColor: steel,
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
                        value={stringArrayComparison}
                        onChange={e => this.updateComparison(e.target.value)}
                    >
                        <option value="contains all">
                            has ALL of the following tags
                        </option>
                        <option value="contains any">
                            has ANY of the following tags
                        </option>
                        <option value="does not contain all">
                            does not have ALL of the following tags
                        </option>
                        <option value="does not contain any">
                            does not have ANY of the following tags
                        </option>
                    </Select>
                </div>

                <SelectedTags
                    tags={this.state.stringArrayValue}
                    updateTags={this.updateTags}
                />
            </div>
        )
    }
}

StringArrayInput.defaultProps = {
    attribute: '',
    stringArrayValue: [],
    stringArrayComparison: 'contains all',
    category: 'device',
    index: 0,
    label: ''
}

export default StringArrayInput
