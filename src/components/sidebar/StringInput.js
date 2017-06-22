import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { light, Select, silver, steel, text, titanium } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class StringInput extends Component {
    constructor(props) {
        super(props)

        const { predicate } = this.props
        const { value, comparison } = predicate
        this.state = {
            value,
            comparison
        }
    }

    updateComparison(comparison) {
        const { predicate, updateFn } = this.props
        const { attribute, category, type } = predicate
        let { value } = this.state
        
        if (comparison === 'is unknown') {
            value = ''
        }
        
        updateFn({
            attribute,
            comparison,
            category,
            type,
            value
        })
        this.setState({ comparison })
    }

    updateValue(value) {
        const { predicate, updateFn } = this.props
        const { attribute, category, type } = predicate
        const { comparison } = this.state
        updateFn({
            attribute,
            comparison,
            category,
            type,
            value
        })
        this.setState({ value })
    }

    render() {
        const { predicate } = this.props
        const { attribute, category } = predicate
        const { value, comparison } = this.state
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
                        <option value="starts with">Starts with</option>
                        <option value="contains">Contains</option>
                        <option value="does not contain">
                            Does not contain
                        </option>
                        <option value="is unknown">Is unknown</option>
                    </Select>

                    {comparison !== 'is unknown' &&
                        <ModalInput
                            type="text"
                            value={value}
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
    predicate: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        comparison: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
    }),
    updateFn: PropTypes.func.isRequired
}

StringInput.defaultProps = {
    predicate: {
        attribute: '',
        value: '',
        comparison: 'is',
        category: 'device'
    },
    updateFn: () => null
}

export default StringInput
