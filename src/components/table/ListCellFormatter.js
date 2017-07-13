import React, { Component } from 'react'

class ListCellFormatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            onCell: false
        }
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    handleMouseOver(e) {
        e.persist()
        const { handleCellEnter } = this.props

        this.setState({ onCell: true })
        setTimeout(() => {
            if (this.state.onCell) {
                handleCellEnter(e, 'This is a tooltip for tags')
            }
        }, 300)
    }

    handleMouseLeave() {
        const { handleCellLeave } = this.props
        this.setState({ onCell: false })
        handleCellLeave()
    }

    render() {
        const { value } = this.props
        return (
            <div
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: 240
                }}
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseLeave}
            >
                {value}
            </div>
        )
    }
}

export default ListCellFormatter
