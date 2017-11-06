import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'

import { ash, silver, slate, steel } from '../styles/colors'
import { light, text } from '../styles/typography'
import TextField from './TextField'

class TypeAhead extends Component {
    constructor(props) {
        super(props)

        const { value } = this.props
        this.state = {
            inputValue: value,
        }
        this.getOnKeyDown = this.getOnKeyDown.bind(this)
    }

    getOnKeyDown(highlightedIndex, inputValue, isOpen) {
        const {
            items,
            onKeyDown
        } = this.props
        if (highlightedIndex === null) {
            return onKeyDown
        }
        const itemsLength = items
            .filter(
                i => i.toLowerCase().includes(inputValue.toLowerCase())
            )
        if (isOpen && itemsLength.length > 0) {
            return undefined
        }

        return onKeyDown
    }

    renderInput({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
        openMenu,
        selectedItem
    }) {
        const {
            dropdownBackground,
            dropdownHighlight,
            dropdownStyle,
            items,
            onKeyDown,
            textFieldStyle
        } = this.props

        return (
            <div style={{ width: textFieldStyle.width, position: 'absolute' }}>
                <TextField
                    {...getInputProps({
                        isOpen,
                        onFocus: () => { this.setState({ inputValue: '' }); return openMenu() },
                        onKeyDown: this.getOnKeyDown(highlightedIndex, inputValue, isOpen),
                        value: inputValue
                    })}
                    style={{
                        ...textFieldStyle
                    }}

                />
                {isOpen ? (
                    <div>
                        {items
                            .filter(i => !inputValue || i.toLowerCase().includes(inputValue.toLowerCase()))
                            .map((item, index) => (
                                <div
                                    {...getItemProps({
                                        key: item,
                                        index,
                                        item,
                                        style: {
                                            backgroundColor:
                                                highlightedIndex === index
                                                    ? dropdownHighlight
                                                    : dropdownBackground,
                                            ...dropdownStyle
                                        }
                                    })}
                                >
                                    {item}
                                </div>
                            ))}
                    </div>
                ) : null}
            </div>
        )
    }

    render() {
        const { update, value } = this.props
        return (
            <Downshift
                onStateChange={({ inputValue }) => {
                    return inputValue && this.setState({ inputValue }, update(inputValue))
                }}
                selectedItem={this.state.inputValue}
                defaultInputValue={value}
            >
                {props => this.renderInput(props)}
            </Downshift>
        )
    }
}

TypeAhead.propTypes = {
    dropdownBackground: PropTypes.string,
    dropdownHighlight: PropTypes.string,
    dropdownStyle: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.string),
    onKeyDown: PropTypes.func,
    textFieldStyle: PropTypes.object,
    update: PropTypes.func,
    value: PropTypes.string
}

TypeAhead.defaultProps = {
    dropdownBackground: slate,
    dropdownHighlight: ash,
    dropdownStyle: {
        ...text,
        ...light,
        alignItems: 'center',
        border: `1px solid ${steel}`,
        borderTop: 'none',
        color: 'white',
        display: 'flex',
        height: 35,
        paddingLeft: 15
    },
    items: ['apple', 'orange', 'banana', 'grape', 'tomato'],
    onKeyDown: () => null,
    textFieldStyle: {
        backgroundColor: slate,
        borderColor: silver,
        color: 'white',
        focus: { borderColor: silver },
        fontSize: 14,
        inputStyle: {
            padding: '3px 15px 0 0'
        },
        width: 400
    },
    update: value => console.log(value),
    value: 'test'
}

export default TypeAhead
