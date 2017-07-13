import React, { Component } from 'react'
import { purple, steel } from '@rover/react-bootstrap'

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

    getRelativeTime() {
        const { value } = this.props
        const now = new Date()
        const secondsPast = (now.getTime() - value.getTime()) / 1000

        if (secondsPast <= 86400) {
            return `${parseInt(secondsPast / 3600)} hours ago`
        }

        if (secondsPast <= 604800) {
            return `${parseInt(secondsPast / 86400)} days ago`
        }

        if (secondsPast <= 2628000) {
            return `${parseInt(secondsPast / 604800)} weeks ago`
        }

        if (secondsPast <= 31536000) {
            return `${parseInt(secondsPast / 2628000)} months ago`
        }

        if (secondsPast > 31536000) {
            return `${parseInt(secondsPast / 31536000)} years ago`
        }
    }

    handleMouseOver(e) {
        e.persist()
        const { handleCellEnter, value } = this.props
        this.setState({ onCell: true })

        setTimeout(() => {
            if (this.state.onCell) {
                handleCellEnter(e, value.toDateString())
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
                {this.getRelativeTime()}
            </div>
        )
    }
}

export default DateCellFormatter
