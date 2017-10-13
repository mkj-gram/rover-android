import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

import Pikaday from 'pikaday'

import { graphite, slate, purple, steel, silver, titanium } from './index'

class DatePicker extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { buttonIconColor, onSelect } = this.props
        const element = this.dateInput
        this.picker = new Pikaday({
            field: element,
            theme: 'DatePicker',
            firstDay: 1,
            onSelect: onSelect,
            format: 'MMM Do, YYYY',
            i18n: {
                previousMonth: `<svg class="Icon"><g><path fill=${buttonIconColor} d="M8,1 L8,11 L3,6 L8,1 L8,1 L8,1 Z"></path></g></svg>`,
                nextMonth: `<svg class="Icon"><g><path fill=${buttonIconColor} d="M3,1 L3,11 L8,6 L3,1 L3,1 L3,1 L3,1 Z"></path></g></svg>`,
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                weekdays: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ],
                weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            },
            setDefaultDate: true
        })
    }
    
    componentWillUnmount() {
        this.picker.el.remove()
    }

    render() {
        const {
            backgroundColor,
            buttonBackgroundColor,
            headlineColor,
            inputStyle,
            numberColor,
            onFocus,
            onBlur,
            primaryColor,
            titleColor,
            value,
            weekendBackgroundColor
        } = this.props
        return (
            <div>
                <style type="text/css">
                    {`
                        .DatePicker {
                            width: 270px;
                            box-sizing: border-box!important;
                            font-family: Source Sans Pro;
                        }
                        .DatePicker.is-hidden {
                            display: none;
                        }
                        .DatePicker button {
                          background: none !important;
                          border: none;
                          font-size: 13px;
                          font-weight: 400;
                        }
                        .DatePicker .pika-title {
                          align-items: flex-start;
                          display: flex;
                          justify-content: center;
                          border-bottom: 1px solid ${headlineColor};
                          height: 37px;
                          margin-bottom: 6px;
                          position: relative;
                        }
                        .DatePicker .pika-title .pika-label {
                          color: ${titleColor};
                          position: relative;
                          font-size: 16px;
                          line-height: 27px;
                          margin: 0 3px;
                          font-family: Source Sans Pro;
                        }
                        .DatePicker .pika-title .pika-label select {
                          position: absolute;
                          top: 0;
                          left: 0;
                          opacity: 0;
                        }
                        .DatePicker .pika-title button {
                          background: ${buttonBackgroundColor} !important;
                          border-radius: 12px;
                          height: 24px;
                          line-height: 24px;
                          padding: 0;
                          position: absolute;
                          top: 3px;
                          width: 24px;
                        }
                        .DatePicker .pika-title button:hover {
                          background: ${steel}!important;
                        }
                        .DatePicker .pika-title button svg {
                          display: block;
                          height: 12px;
                          margin: 6px;
                          pointer-events: none;
                          width: 12px;
                        }
                        .DatePicker .pika-title button.pika-prev {
                          left: 0;
                        }
                        .DatePicker .pika-title button.pika-next {
                          right: 0;
                        }
                        .DatePicker .pika-lendar {
                          width: 300px;
                          padding: 30px 15px 40px;
                          background-color: ${backgroundColor};
                        }
                        .DatePicker .pika-table {
                          border-bottom: 1px solid ${headlineColor};
                        }
                        .DatePicker .pika-row {
                          height: 32px;
                        }
                        .DatePicker th, .DatePicker td {
                          padding: 0 3px;
                          font-family: Source Sans Pro;
                          height: 32px;
                          font-size: 13px;
                        }
                        .DatePicker th abbr {
                          display: block;
                          height: 32px;
                          line-height: 32px;
                          text-align: center;
                          text-decoration: none;
                          width: 32px;
                        }
                        .DatePicker td button {
                          border-radius: 0;
                          color: ${numberColor};
                          cursor: default;
                          height: 32px;
                          line-height: 32px;
                          position: relative;
                          overflow: hidden;
                          text-indent: -999px;
                          width: 32px;
                        }
                        .DatePicker td button:before {
                          font-family: 'Source Sans Pro';
                          border-radius: 12px;
                          content: "";
                          display: block;
                          height: 24px;
                          left: 4px;
                          line-height: 24px;
                          position: absolute;
                          text-indent: 0;
                          top: 4px;
                          width: 24px;
                        }
                        .DatePicker td button:hover:before {
                            background-color: ${steel}
                        }
                        .DatePicker td.is-selected button {
                          color: white;
                        }
                        .DatePicker td.is-selected button:before {
                          background: ${primaryColor};
                        }
                        .DatePicker td[data-day="1"] button:before {
                          content: "1";
                        }
                        .DatePicker td[data-day="2"] button:before {
                          content: "2";
                        }
                        .DatePicker td[data-day="3"] button:before {
                          content: "3";
                        }
                        .DatePicker td[data-day="4"] button:before {
                          content: "4";
                        }
                        .DatePicker td[data-day="5"] button:before {
                          content: "5";
                        }
                        .DatePicker td[data-day="6"] button:before {
                          content: "6";
                        }
                        .DatePicker td[data-day="7"] button:before {
                          content: "7";
                        }
                        .DatePicker td[data-day="8"] button:before {
                          content: "8";
                        }
                        .DatePicker td[data-day="9"] button:before {
                          content: "9";
                        }
                        .DatePicker td[data-day="10"] button:before {
                          content: "10";
                        }
                        .DatePicker td[data-day="11"] button:before {
                          content: "11";
                        }
                        .DatePicker td[data-day="12"] button:before {
                          content: "12";
                        }
                        .DatePicker td[data-day="13"] button:before {
                          content: "13";
                        }
                        .DatePicker td[data-day="14"] button:before {
                          content: "14";
                        }
                        .DatePicker td[data-day="15"] button:before {
                          content: "15";
                        }
                        .DatePicker td[data-day="16"] button:before {
                          content: "16";
                        }
                        .DatePicker td[data-day="17"] button:before {
                          content: "17";
                        }
                        .DatePicker td[data-day="18"] button:before {
                          content: "18";
                        }
                        .DatePicker td[data-day="19"] button:before {
                          content: "19";
                        }
                        .DatePicker td[data-day="20"] button:before {
                          content: "20";
                        }
                        .DatePicker td[data-day="21"] button:before {
                          content: "21";
                        }
                        .DatePicker td[data-day="22"] button:before {
                          content: "22";
                        }
                        .DatePicker td[data-day="23"] button:before {
                          content: "23";
                        }
                        .DatePicker td[data-day="24"] button:before {
                          content: "24";
                        }
                        .DatePicker td[data-day="25"] button:before {
                          content: "25";
                        }
                        .DatePicker td[data-day="26"] button:before {
                          content: "26";
                        }
                        .DatePicker td[data-day="27"] button:before {
                          content: "27";
                        }
                        .DatePicker td[data-day="28"] button:before {
                          content: "28";
                        }
                        .DatePicker td[data-day="29"] button:before {
                          content: "29";
                        }
                        .DatePicker td[data-day="30"] button:before {
                          content: "30";
                        }
                        .DatePicker td[data-day="31"] button:before {
                          content: "31";
                        }
                        .DatePicker th:nth-child(6) abbr,
                        .DatePicker th:nth-child(7) abbr,
                        .DatePicker td:nth-child(6) button,
                        .DatePicker td:nth-child(7) button,
                        .DatePicker td:nth-child(6).is-empty:after,
                        .DatePicker td:nth-child(7).is-empty:after {
                          background: ${weekendBackgroundColor} !important;
                        }
                        .DatePicker td.is-empty:after {
                          content: "";
                          height: 32px;
                          width: 32px;
                        }
                        .DatePicker th {
                          color: ${headlineColor};
                          font-weight: 600;
                        }

                    `}
                </style>
                <input
                    type="text"
                    ref={input => {
                        this.dateInput = input
                    }}
                    style={{...inputStyle}}
                    defaultValue={value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        )
    }
}

DatePicker.propTypes = {
    backgroundColor: PropTypes.string,
    buttonBackgroundColor: PropTypes.string,
    buttonIconColor: PropTypes.string,
    headlineColor: PropTypes.string,
    inputStyle: PropTypes.object,
    numberColor:  PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    primaryColor: PropTypes.string,
    titleColor: PropTypes.string,
    weekendBackgroundColor: PropTypes.string
}

DatePicker.defaultProps = {
    backgroundColor: slate,
    buttonBackgroundColor: graphite,
    buttonIconColor: titanium,
    headlineColor: steel,
    inputStyle: {},
    numberColor:  silver,
    onFocus: () => null,
    onBlur: () => null,
    primaryColor: purple,
    titleColor: 'white',
    weekendBackgroundColor: graphite
}

export default DatePicker
