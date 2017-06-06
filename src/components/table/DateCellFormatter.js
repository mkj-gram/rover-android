import React, { Component } from 'react'
import { purple, steel, Tooltip } from '@rover/react-bootstrap'

class DateCellFormatter extends Component {
    constructor(props) {
        super(props)

        this.state = { isModalShowing: false }
        
        this.handleClick = this.handleClick.bind(this)
    }
    
    handleClick() {
        this.setState({ isModalShowing: !this.state.isModalShowing })
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

    render() {
        const { isModalShowing } = this.state
        const { value } = this.props
        return (
            <div
                onClick={this.handleClick}
                style={{
                    color: isModalShowing ? purple : steel,
                    position: 'relative'
                }}
            >
                {isModalShowing && <Tooltip message={value.toDateString()}/>}
                {this.getRelativeTime()}
            </div>
        )
    }
}

export default DateCellFormatter
