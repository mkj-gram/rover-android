import React, { Component } from 'react'
import { purple, steel } from '@rover/react-bootstrap'

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
    }

    handleMouseOver(e) {

        e.persist()
        const { handleCellEnter, value } = this.props
        this.setState({ onCell: true })

        setTimeout(() => {
            if (this.state.onCell) {
                handleCellEnter(e, new Date(value).toDateString())
                this.setState({
                    isModalShowing: true
                })
            }
        }, 300)
    }

    handleMouseLeave(e) {
        const { handleCellLeave } = this.props
        this.setState({ onCell: false, isTooltipShowing: false })
        handleCellLeave()
    }

    render() {
        const { isTooltipShowing } = this.state
        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseLeave}
                style={{
                    color: isTooltipShowing ? purple : steel,
                    position: 'relative'
                }}
            >
                {getRelativeTime(this.props.value)}
            </div>
        )
    }
}

export default DateCellFormatter
