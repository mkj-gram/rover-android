import React, { Component } from 'react'
import { TestDeviceIcon } from '@rover/react-icons'

class TestDeviceIconFormatter extends Component {
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
            if (this.state.onCell && !this.state.isTooltipShowing) {
                handleCellEnter(e, 'Test Device')
                this.setState({
                    isTooltipShowing: true
                })
            }
        }, 500)
    }

    handleMouseLeave(e) {
        const { handleCellLeave } = this.props
        this.setState({ onCell: false, isTooltipShowing: false })
        handleCellLeave()
    }

    render() {
        return (
            <div
                style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 19
                }}
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseLeave}
            >
                <TestDeviceIcon />
            </div>
        )
    }
}

export default TestDeviceIconFormatter
