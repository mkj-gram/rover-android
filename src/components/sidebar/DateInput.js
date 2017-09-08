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

        const { dateValue, dateComparison } = this.props
        const { start, end } = dateValue
        this.state = {
            start: moment(start),
            end: moment(end),
            dateComparison
        }
    }

    componentDidMount() {
        const { dateValue } = this.state
        this.updateValue(dateValue)
    }

    renderDatePicker() {
        const { start, end, dateComparison } = this.state

        switch (dateComparison) {
            case 'in between':
                return this.renderInBetweenCalendarInput(start, end)
            case 'after':
            case 'on':
            case 'before':
                return this.renderCalendarInput(start)
            case 'more than':
            case 'exactly':
            case 'less than':
            default:
                return this.renderRelativeDatePicker(start)
        }
    }

    renderCalendarInput(currentDate, selectFn = null) {
        const onSelect =
            selectFn || (date => this.updateValue({ start: moment(date) }))

        const onFocus = e =>
            (e.target.parentElement.parentElement.style.borderColor = silver)
        const onBlur = e =>
            (e.target.parentElement.parentElement.style.borderColor = steel)

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
                <span
                    style={{
                        fontStyle: 'italic',
                        margin: '0px 10px',
                        alignSelf: 'center'
                    }}
                >
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
                    onChange={e =>
                        this.updateValue({
                            start: moment().subtract(e.target.value, 'days')
                        })}
                />
                <span style={{ fontStyle: 'italic' }}>days ago</span>
            </div>
        )
    }

    updateComparison(dateComparison) {
        const {
            attribute,
            category,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const start = moment()
        let end = {}

        if (dateComparison === 'in between') {
            end = moment()
        }

        updateFn({
            attribute,
            dateComparison,
            category,
            __typename,
            index,
            dateValue: {
                start: start.toISOString(),
                end: moment.isMoment(end) ? end.toISOString() : end
            },
            label
        })

        this.setState({ dateComparison, start, end })
    }

    updateValue(dateValue) {
        const {
            attribute,
            category,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const { dateComparison, start, end } = this.state

        const newValue = {
            start,
            end,
            ...dateValue
        }

        updateFn({
            attribute,
            dateComparison,
            category,
            __typename,
            index,
            dateValue: {
                start: newValue.start.toISOString(),
                end: moment.isMoment(newValue.end)
                    ? newValue.end.toISOString()
                    : newValue.end
            },
            label
        })

        this.setState({ ...newValue })
    }

    render() {
        const { category, label } = this.props
        const { dateComparison } = this.state
        return (
            <div style={{ ...text, ...light, color: silver, width: 444 }}>
                <ModalInputPrompt attributeType={category} label={label} />
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
                            paddingLeft: 5
                        }}
                        isDisabled={false}
                        value={dateComparison}
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
    attribute: PropTypes.string.isRequired,
    dateValue: PropTypes.object.isRequired,
    dateComparison: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

DateInput.defaultProps = {
    attribute: '',
    dateValue: {
        start: moment(),
        end: {}
    },
    dateComparison: 'exactly',
    category: 'device',
    index: 0,
    updateFn: () => '',
    label: ''
}

export default DateInput
