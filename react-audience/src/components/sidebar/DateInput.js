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
        const { dateValue, dateComparison } = props
        let { start, duration } = dateValue

        const relativeComparisons = [
            'is greater than',
            'is equal',
            'is less than'
        ]
        if (relativeComparisons.includes(dateComparison)) {
            start = {
                year: moment().year(),
                month: moment().month() + 1,
                day: moment().date()
            }
        } else {
            duration = 1
        }

        this.state = {
            start,
            dateComparison,
            relativeComparisons,
            duration
        }
    }

    componentDidMount() {
        const { dateValue } = this.props
        this.updateValue(dateValue)
    }

    renderDatePicker() {
        const { start, dateComparison, duration } = this.state

        switch (dateComparison) {
            case 'is after':
            case 'is on':
            case 'is before':
                return this.renderCalendarInput(start)
            case 'is greater than':
            case 'is equal':
            case 'is less than':
                return this.renderRelativeDatePicker(duration)
            default:
                return
        }
    }

    renderCalendarInput(currentDate) {
        let curDate = moment([
            currentDate.year,
            currentDate.month - 1,
            currentDate.day
        ])

        const onSelect = date =>
            this.updateValue({
                start: {
                    year: moment(date).year(),
                    month: moment(date).month() + 1,
                    day: moment(date).date()
                }
            })

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
                    value={curDate.format('MMM Do, YYYY')}
                    onSelect={onSelect}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        )
    }

    renderRelativeDatePicker(duration) {
        return (
            <div>
                <ModalInput
                    type="number"
                    min={0}
                    value={duration}
                    onChange={e =>
                        this.updateValue({
                            duration: e.target.value
                        })
                    }
                />
                <span style={{ fontStyle: 'italic' }}>days ago</span>
            </div>
        )
    }

    updateComparison(dateComparison) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const { relativeComparisons } = this.state
        let { start, duration } = this.state
        let dateValue
        if (!relativeComparisons.includes(dateComparison)) {
            if (!relativeComparisons.includes('set')) {
                dateValue = {
                    start,
                    duration: 1
                }
            }
        } else {
            let m = moment()
            dateValue = {
                duration,
                start: {
                    year: m.year(),
                    month: m.month() + 1,
                    day: m.date()
                }
            }
        }

        updateFn({
            attribute,
            dateComparison,
            selector,
            __typename,
            index,
            dateValue,
            label
        })

        this.setState({ dateComparison, start, duration })
    }

    updateValue(curDateValue) {
        const {
            attribute,
            selector,
            __typename,
            index,
            updateFn,
            label
        } = this.props
        const {
            dateComparison,
            start,
            duration,
            relativeComparisons
        } = this.state

        const newValue = {
            start,
            duration,
            ...curDateValue
        }
        let dateValue

        if (!relativeComparisons.includes(dateComparison)) {
            dateValue = {
                start: newValue.start,
                duration: 1
            }
        } else {
            let m = moment()
            dateValue = {
                duration: parseInt(newValue.duration),
                start: {
                    year: m.year(),
                    month: m.month() + 1,
                    day: m.date()
                }
            }
        }

        updateFn({
            attribute,
            dateComparison,
            selector,
            __typename,
            index,
            dateValue,
            label
        })

        this.setState({ ...newValue })
    }

    render() {
        const { selector, label } = this.props
        const { dateComparison } = this.state
        return (
            <div style={{ ...text, ...light, color: silver, width: 444 }}>
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
                            fontSize: 16,
                            color: titanium,
                            width: 124,
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
                            <option value="is greater than">More than</option>
                            <option value="is equal">Exactly</option>
                            <option value="is less than">Less than</option>
                        </optgroup>
                        <optgroup label="Absolute">
                            <option value="is after">After</option>
                            <option value="is on">On</option>
                            <option value="is before">Before</option>
                            <option value="is set">Exists</option>
                            <option value="is unset">Does not exist</option>
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
    dateComparison: PropTypes.string,
    selector: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    updateFn: PropTypes.func.isRequired,
    __typename: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

DateInput.defaultProps = {
    attribute: '',
    dateValue: {
        duration: 1,
        start: {
            year: moment().year(),
            month: moment().month() + 1,
            day: moment().date()
        }
    },
    dateComparison: 'is equal',
    selector: 'DEVICE',
    index: 0,
    updateFn: () => '',
    label: ''
}

export default DateInput
