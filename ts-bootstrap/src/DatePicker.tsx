/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import * as Pikaday from 'pikaday'
import ResponsiveContainer from '../components/ResponsiveContainer'

import { ArrowLeftIcon, ArrowRightIcon } from './Icons'
import {
    white,
    turquoise,
    silver,
    graphite,
    charcoal,
    titanium,
    cloud
} from '../styles/colors'

export interface DatePickerProps extends InjectedProps {
    backgroundColor?: string
    selectedDayBackgroundColor?: string
    hoveredDayBackgroundColor?: string
    outsideCurrentMonthColor?: string
    buttonIconColor?: string
    titleColor?: string
    weekdaysColor?: string
    headlineColor?: string
    numberColor?: string
    weekendBackgroundColor?: string
    disabledMonthBackgroundColor?: string

    onSelect?: (date: Date) => void
    defaultDate?: Date
}

class DatePickerComponent extends React.Component<DatePickerProps, {}> {
    private picker: Pikaday = undefined
    private pikaRef: React.ReactInstance = undefined

    constructor(props: DatePickerProps) {
        super(props)
    }

    componentDidMount() {
        const {
            buttonIconColor = graphite,
            onSelect,
            defaultDate = new Date()
        } = this.props

        this.picker = new Pikaday({
            field: this.refs.pikaRef as HTMLElement,
            bound: false,
            theme: 'DatePicker',
            firstDay: 1,
            onSelect: onSelect,
            format: 'MMM Do, YYYY',
            i18n: {
                previousMonth: `<svg width="24px" height="24px"><path fill-rule="nonzero" fill=${buttonIconColor}  d="M10.414 11H16a1 1 0 0 1 0 2h-5.586l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L10.414 11zM12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path></svg>`,
                nextMonth: `<svg width="24px" height="24px"><path fill=${buttonIconColor} d="M13.586 13H8a1 1 0 0 1 0-2h5.586l-2.293-2.293a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L13.586 13zM12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path></svg>`,
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
            defaultDate,
            setDefaultDate: true,
            minDate: new Date(),
            showDaysInNextAndPreviousMonths: true
        })
    }

    componentWillUnmount() {
        this.picker.destroy()
    }

    render() {
        const {
            backgroundColor = white,
            selectedDayBackgroundColor = turquoise,
            hoveredDayBackgroundColor = turquoise,
            outsideCurrentMonthColor = silver,
            titleColor = charcoal,
            weekdaysColor = charcoal,
            headlineColor = titanium,
            numberColor = charcoal,
            weekendBackgroundColor = cloud,
            disabledMonthBackgroundColor = titanium,
            device
        } = this.props

        const margin = device === 'Mobile' ? '24' : '16'
        return (
            <div>
                <style type="text/css">
                    {`                        
                        .DatePicker.is-hidden {
                            display: none;
                        }
                        .DatePicker button {                         
                          border: none;
                          background: #FFF;
                          padding: 0;                         
                        }
                        .DatePicker .pika-title {
                          align-items: flex-start;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          border-bottom: 1px solid ${headlineColor};
                          height: 55px;
                          margin-bottom: 8px;
                          position: relative;                     
                        }
                        .DatePicker .pika-title .pika-label {
                          color: ${titleColor};
                          position: relative;
                          font-size: 17px;
                          line-height: 24px;
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
                          height: 24px;                        
                          padding: 0;
                          position: absolute;
                          top: 3px;
                          width: 24px;                        
                        }                     
                        .DatePicker .pika-title button svg {
                          display: block;
                          pointer-events: none;
                        }                  
                        .DatePicker .pika-title button.pika-prev {
                          left: ${margin}px;
                          top: 16px;
                        }
                        .DatePicker .pika-title button.pika-next {
                          right: ${margin}px;
                          top: 16px;
                        }
                        .DatePicker .pika-lendar {                     
                          background-color: ${backgroundColor};
                        }
                        .DatePicker .pika-table {                      
                          margin-left: auto;
                          margin-right: auto;
                          margin-bottom: 8px;
                          font-family: Source Sans Pro;                                                
                        }
                        .DatePicker .pika-row {
                          height: 32px;
                        }
                      
                        .DatePicker th abbr {
                          display: block;
                          height: 40px;
                          line-height: 40px;
                          text-align: center;
                          text-decoration: none;
                          
                          font-size: 17px;
                          font-weight: 600;
                          color: ${weekdaysColor};
                          width: 40px;
                        }
                        .DatePicker td button {                          
                          color: ${numberColor};
                          cursor: default;
                          height: 40px;
                          line-height: 40px;
                          position: relative;
                          overflow: hidden;
                          text-indent: -999px;
                          width: 40px;
                          margin-right: 8px; 
                          font-size: 17px;
                        }
                        .DatePicker td button:before {
                          
                          border-radius: 16px;
                          content: "";
                          display: block;
                          height: 32px;
                          left: 8px;
                          line-height: 32px;
                          position: absolute;
                          text-indent: 0;
                          top: 4px;
                          left: 4px;
                          width: 32px;                       
                        }

                        .DatePicker td.is-outside-current-month button {
                          color: ${outsideCurrentMonthColor}
                        }
                        .DatePicker td button:hover:before {
                            background-color: ${
                                device === 'Desktop'
                                    ? hoveredDayBackgroundColor
                                    : 'none'
                            }
                        }
                        .DatePicker td.is-selected button {
                          color: white;
                        }
                        .DatePicker td.is-selected button:before {
                          background: ${selectedDayBackgroundColor};
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
                          margin-left: 4px;
                          margin-right: 4px;
                          background: ${weekendBackgroundColor} !important;
                        }
                        .DatePicker td.is-empty:after {
                          content: "";
                          height: 40px;
                          width: 40px;
                        }
                        .DatePicker th:nth-child(6) {
                          padding-right: 8px;
                        }                      
                        .DatePicker th:nth-child(6) abbr {                        
                            width: 32px;
                        }
                        .DatePicker td:nth-child(6) button {                     
                          width: 32px;
                        }
                        .DatePicker td:nth-child(7) button:before,
                        .DatePicker td:nth-child(6) button:before {
                          left: 0px;
                        }
                       .DatePicker th:nth-child(7) {
                          width: 40px;
                        }
                        .DatePicker th:nth-child(7) abbr {
                          margin-right: 0!important;                          
                          width: 32px;
                        }
                        .DatePicker th:nth-child(7) button {
                          margin-right: 4px;
                          margin-left: 4px;
                          width: 32px;
                        }
                        .DatePicker td:nth-child(7) button {
                          margin-right: 4px;                      
                          width: 32px;                        
                        }
                        .DatePicker .pika-prev.is-disabled svg path {
                         fill: ${disabledMonthBackgroundColor}
                        }                      
                    `}
                </style>
                <input type="text" ref="pikaRef" style={{ display: 'none' }} />
            </div>
        )
    }
}
const DatePicker = (props: DatePickerProps) => {
    const ResponsiveDatePickerContainer = ResponsiveContainer(props)(
        DatePickerComponent
    )
    return ResponsiveDatePickerContainer
}
export default DatePicker
