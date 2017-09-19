import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { light, Select, silver, text, titanium } from '@rover/react-bootstrap'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class VersionInput extends Component {
    constructor(props) {
        super(props)

        const { versionValue, versionComparison } = this.props
        this.state = {
            versionValue,
            versionComparison
        }
    }

    componentDidMount() {
        const { versionComparison } = this.state
        this.updateComparison(versionComparison)
    }

    updateVersion(version, versionIndex) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const { versionValue, versionComparison } = this.state

        const newValue = versionValue
            .slice(0, versionIndex)
            .concat(version)
            .concat(versionValue.slice(versionIndex + 1))

        updateFn({
            attribute,
            versionComparison,
            selector,
            __typename,
            index,
            versionValue: newValue,
            label
        })

        this.setState({ versionValue: newValue })
    }

    updateComparison(versionComparison) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const { versionValue } = this.state

        let newVersionValue

        if (versionComparison === 'in between') {
            newVersionValue = versionValue.slice(0, 3).concat([0, 0, 0])
        } else {
            newVersionValue = versionValue.slice(0, 3)
        }

        updateFn({
            attribute,
            versionComparison,
            versionValue: newVersionValue,
            selector,
            __typename,
            index,
            label
        })

        this.setState({ versionComparison, versionValue: newVersionValue })
    }

    renderNumberInput(value, index) {
        return (
            <ModalInput
                type="number"
                min={0}
                value={value}
                onChange={e =>
                    this.updateVersion(parseInt(e.target.value, 10), index)}
            />
        )
    }

    render() {
        const { selector, label } = this.props
        const { versionValue, versionComparison } = this.state

        return (
            <div style={{ ...text, ...light, color: silver, width: 495 }}>
                <ModalInputPrompt selector={selector} label={label} />
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
                        value={versionComparison}
                        onChange={e => this.updateComparison(e.target.value)}
                    >
                        <option value="equals">Equal to</option>
                        <option value="does not equal">Not equal to</option>
                        <option value="less than">Less than</option>
                        <option value="greater than">Greater than</option>
                        <option value="in between">In between</option>
                        <option value="is unknown">Unknown</option>
                    </Select>

                    {versionComparison !== 'is unknown' &&
                        versionValue.slice(0, 3).map((val, index) =>
                            <div key={index}>
                                {this.renderNumberInput(val, index)}
                                {index < 2 && '.'}
                            </div>
                        )}
                    {versionComparison === 'in between' &&
                        <div
                            style={{ display: 'flex', alignItems: 'baseline' }}
                        >
                            <span style={{ fontStyle: 'italic' }}>and</span>
                            {versionValue.slice(3).map((val, index) =>
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
    versionValue: PropTypes.arrayOf(PropTypes.number),
    versionComparison: PropTypes.string.isRequired,
    selector: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

VersionInput.defaultProps = {
    attribute: '',
    versionValue: [0, 0, 0, 0, 0, 0],
    versionComparison: 'equal to',
    selector: 'DEVICE',
    index: 0,
    updateFn: () => null,
    label: ''
}

export default VersionInput
