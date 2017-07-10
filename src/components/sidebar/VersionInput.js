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

class VersionInput extends Component {
    constructor(props) {
        super(props)

        const { value, comparison } = this.props
        this.state = {
            value,
            comparison
        }
    }

    updateVersion(version, versionIndex) {
        const { attribute, category, type, index, updateFn } = this.props
        const { value, comparison } = this.state

        const newValue = value
            .slice(0, versionIndex)
            .concat(version)
            .concat(value.slice(versionIndex + 1))

        updateFn({
            attribute,
            comparison,
            category,
            type,
            index,
            value: newValue
        })

        this.setState({ value: newValue })
    }

    updateComparison(comparison) {
        const { attribute, category, type, index, updateFn } = this.props
        const { value } = this.state

        updateFn({
            attribute,
            comparison,
            value,
            category,
            index,
            type
        })

        this.setState({ comparison })
    }

    renderNumberInput(value, index) {
        return (
            <ModalInput
                type="number"
                min={0}
                value={value}
                onChange={e =>
                    this.updateVersion(parseInt(e.target.value), index)}
            />
        )
    }

    render() {
        const { attribute, category } = this.props
        const { value, comparison } = this.state

        return (
            <div style={{ ...text, ...light, color: silver, width: 495 }}>
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
                        <option value="equals">Equal to</option>
                        <option value="does not equal">Not equal to</option>
                        <option value="less than">Less than</option>
                        <option value="greater than">Greater than</option>
                        <option value="in between">In between</option>
                        <option value="is unknown">Unknown</option>
                    </Select>

                    {comparison !== 'is unknown' &&
                        value.slice(0, 3).map((val, index) =>
                            <div key={index}>
                                {this.renderNumberInput(val, index)}
                                {index < 2 && '.'}
                            </div>
                        )}
                    {comparison === 'in between' &&
                        <div
                            style={{ display: 'flex', alignItems: 'baseline' }}
                        >
                            <span style={{ fontStyle: 'italic' }}>and</span>
                            {value.slice(3).map((val, index) =>
                                <div key={index}>
                                    {this.renderNumberInput(val, index + 3)}
                                    {index < 2 && '.'}
                                </div>
                            )}
                        </div>}
                </div>
            </div>
        )
    }
}

VersionInput.propTypes = {
    attribute: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.number),
    comparison: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired
}

VersionInput.defaultProps = {
    attribute: '',
    value: [0, 0, 0, 0, 0, 0],
    comparison: 'equal to',
    category: 'device',
    index: 0,
    updateFn: () => null
}

export default VersionInput
