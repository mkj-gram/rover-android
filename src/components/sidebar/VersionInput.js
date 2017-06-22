import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { light, Select, silver, steel, text, titanium } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class VersionInput extends Component {
    constructor(props) {
        super(props)

        const { predicate } = this.props
        const { value, comparison } = predicate
        this.state = {
            value,
            comparison
        }
    }
    
    updateVersion(version, index) {
        const { predicate, updateFn } = this.props
        const { attribute } = predicate
        const { value, comparison } = this.state
        
        const newValue = value.slice(0, index).concat(version).concat(value.slice(index + 1))
        
        updateFn({
            attribute,
            comparison,
            value: newValue
        })
        
        this.setState({ value: newValue })
    }
    
    updateComparison(comparison) {
        const { predicate, updateFn } = this.props
        const  { attribute } = predicate
        const { value } = this.state
        
        updateFn({
            attribute,
            comparison,
            value
        })
        
        this.setState({ comparison })
    }

    renderNumberInput(value, index) {
        return (
            <ModalInput
                type="number"
                min={0}
                value={value}
                onChange={e => this.updateVersion(parseInt(e.target.value), index)}
            />
        )
    }

    render() {
        const { predicate, attributeType } = this.props
        const { attribute } = predicate
        const { value, comparison } = this.state

        return (
            <div style={{ ...text, ...light, color: silver }}>
                <ModalInputPrompt
                    attributeType={attributeType}
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
                        <option value="equal-to">Equal to</option>
                        <option value="does-not-equal">Does not equal</option>
                        <option value="less-than">Less than</option>
                        <option value="greater-than">Greater than</option>
                        <option value="in-between">In between</option>
                        <option value="is-unknown">Is unknown</option>
                    </Select>

                    {value
                        .slice(0, 3)
                        .map((val, index) =>
                            <div key={index}>
                                {this.renderNumberInput(val, index)}
                                {index < 2 && <span>.</span>}
                            </div>
                        )}
                    {comparison === 'in-between' &&
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <span style={{ fontStyle: 'italic' }}>and</span>
                            {value
                                .slice(3)
                                .map((val, index) =>
                                    <div key={index}>
                                        {this.renderNumberInput(val, index + 3)}
                                        {index < 2 && <span>.</span>}
                                    </div>
                                )}
                        </div>}
                </div>
            </div>
        )
    }
}

VersionInput.propTypes = {
    predicate: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        value: PropTypes.arrayOf(PropTypes.number),
        comparison: PropTypes.string.isRequired
    }),
    updateFn: PropTypes.func.isRequired
}

VersionInput.defaultProps = {
    predicate: {
        attribute: '',
        value: [0, 0, 0, 0, 0, 0],
        comparison: 'equal-to'
    },
    updateFn: () => null
}

export default VersionInput
