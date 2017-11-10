import React, { Component } from 'react'
import { steel, silver } from '@rover/react-bootstrap'

import getRelativeTime from '../../utils/getRelativeTime'

class DateCellFormatter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isTooltipShowing: false,
            onCell: false
        }
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
    }

    handleMouseOver(e) {
        e.persist()
        const { handleCellEnter, value, rowIdx } = this.props

        this.setState(
            {
                isTooltipShowing: true
            },
            handleCellEnter(
                e,
                new Date(value).toDateString(),
                false,
                rowIdx
            )
        )
    }

    handleMouseLeave(e) {
        const { handleCellLeave } = this.props

        this.setState({
            onCell: false,
            isTooltipShowing: false
        })
        handleCellLeave()
    }

    handleOnClick() {
        const { handleCellLeave, onCellSelected} = this.props
        this.setState({
            onCell: false,
            isTooltipShowing: false
        })
        handleCellLeave()
        onCellSelected(this.props)
    }

    render() {
        const { value, column, rowIdx } = this.props
        const { isTooltipShowing } = this.state

        let display
        if (value.length !== 0) {
            display = (
                <div>
                    <div
                        className="dateCellFormatter"
                        onMouseEnter={e => this.handleMouseOver(e)}
                        onMouseLeave={e => this.handleMouseLeave(e)}
                        onClick={() => this.handleOnClick()}
                    >
                        <style type="text/css">
                            {`
                            .dateCellFormatter {
                                color: ${steel}!important;
                                position: relative;
                                cursor: pointer;
                            }
                            .dateCellFormatter:hover {
                                color: ${steel}!important;
                                position: relative;
                                cursor: pointer;
                                text-decoration: underline!important;
                            }
                        `}
                        </style>
                        {getRelativeTime(value)}
                    </div>
                </div>
            )
        } else {
            display = (
                <div
                    style={{
                        color: silver,
                        position: 'relative'
                    }}
                >
                    Unknown
                </div>
            )
        }
        return display
    }
}

export default DateCellFormatter
