import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
    DatePicker,
    light,
    Select,
    silver,
    steel,
    text,
    slate,
    graphite,
    titanium,
    violet
} from '@rover/react-bootstrap'

import { CalendarIconSmall } from '@rover/react-icons'

import ModalInput from './ModalInput'
import ModalInputPrompt from './ModalInputPrompt'

class DateInput extends Component {
    constructor(props) {
        super(props)

        const { predicate } = this.props
        const { value, comparison } = predicate
        const { start, end } = value
        this.state = {
            start,
            end,
            comparison
        }
    }

    renderDatePicker() {
        const { start, end, comparison } = this.state

        switch (comparison) {
            case 'in between':
                return this.renderInBetweenCalendarInput(start, end)
                break
            case 'after':
            case 'on':
            case 'before':
                return this.renderCalendarInput(start)
                break
            case 'more than':
            case 'exactly':
            case 'less than':
            default:
                return this.renderRelativeDatePicker(start)
        }
    }

    renderCalendarInput(currentDate, selectFn = null) {
        
        const onSelect = selectFn || (date => this.updateValue({ start: moment(date) }))
        
        const onFocus = e => e.target.parentElement.parentElement.style.borderColor = silver
        const onBlur = e => e.target.parentElement.parentElement.style.borderColor = steel
        
        return (
            <div
                style={{
                    borderBottom: '1px solid',
                    borderColor: steel,
                    color: 'white',
                    paddingBottom: 3,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'baseline'
                }}
            >
                <CalendarIconSmall fill={silver} style={{ marginRight: 5 }} />
                <DatePicker
                    backgroundColor={slate}
                    primaryColor={violet}
                    buttonBackgroundColor={graphite}
                    buttonIconColor={titanium}
                    titleColor="white"
                    headlineColor={steel}
                    inputStyle={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontFamily: 'Source Sans Pro',
                        textDecoration: 'none',
                        outline: 'none',
                        color: titanium,
                        fontSize: 16,
                        width: 120,
                        paddingLeft: 5
                    }}
                    numberColor={silver}
                    weekendBackgroundColor={graphite}
                    value={currentDate.format('MMM Do, YYYY')}
                    onSelect={onSelect}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        )
    }

    renderInBetweenCalendarInput(start, end) {
        const endSelectFn = date => this.updateValue({ end: moment(date) })
        return (
            <div style={{ display: 'flex' }}>
                {this.renderCalendarInput(start)}
                <span style={{ fontStyle: 'italic', margin: '0px 10px', alignSelf: 'center' }}>
                    and
                </span>
                {this.renderCalendarInput(end, endSelectFn)}
            </div>
        )
    }

    renderRelativeDatePicker(start) {

        return (
            <div>
                <ModalInput
                    type="number"
                    min={0}
                    value={moment().diff(start, 'd')}
                    onChange={e => this.updateValue({ start: moment().subtract(e.target.value, 'days') })}
                />
                <span style={{ fontStyle: 'italic' }}>days ago</span>
            </div>
        )
    }

    updateComparison(comparison) {
        const { predicate, updateFn } = this.props
        const { attribute, type, category } = predicate
        const start = moment()
        let end = {}
        
        if (comparison === 'in between') {
            end = moment()
        }
        
        const value = { start, end }
        
        updateFn({
            attribute,
            comparison,
            type,
            category,
            value
        })
        
        this.setState({ comparison, start, end })
    }
    
    updateValue(value) {
        const { predicate, updateFn } = this.props
        const { attribute, type, category } = predicate
        const { comparison, start, end } = this.state
        
        const newValue = {
            start,
            end,
            ...value
        }

        updateFn({
            attribute,
            comparison,
            type,
            category,
            value: newValue
        })
        
        this.setState({ ...newValue })
    }

    render() {
        const { predicate } = this.props
        const { attribute, category } = predicate
        const { value, comparison } = this.state
        return (
            <div style={{ ...text, ...light, color: silver, width: 444 }}>
                <ModalInputPrompt
                    attribute={attribute}
                    attributeType={category}
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
                            fontSize: 16,
                            color: titanium,
                            width: 110,
                            marginRight: 20,
                            borderColor: steel,
                            focusedBorderColor: silver,
                            borderRadius: 0,
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderTop: 'none',
                            borderRight: 'none',
                            borderLeft: 'none',
                            borderRadius: 0,
                            paddingLeft: 5
                        }}
                        isDisabled={false}
                        value={comparison}
                        onChange={e => this.updateComparison(e.target.value)}
                    >
                        <optgroup label="Relative">
                            <option value="more than">More than</option>
                            <option value="exactly">Exactly</option>
                            <option value="less than">Less than</option>
                        </optgroup>
                        <optgroup label="Absolute">
                            <option value="after">After</option>
                            <option value="on">On</option>
                            <option value="before">Before</option>
                            <option value="in between">In Between</option>
                        </optgroup>
                    </Select>
                    {this.renderDatePicker()}
                </div>
            </div>
        )
    }
}

DateInput.propTypes = {
    predicate: PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        value: PropTypes.shape({
            start: PropTypes.object,
            end: PropTypes.object
        }),
        comparison: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }),
    updateFn: PropTypes.func.isRequired
}

DateInput.defaultProps = {
    predicate: {
        attribute: '',
        value: {
            start: {},
            end: {}
        },
        comparison: '',
        category: 'device',
        type: 'date'
    },
    updateFn: () => ''
}

export default DateInput
