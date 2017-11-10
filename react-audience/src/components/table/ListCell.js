import React, { Component } from 'react'

class ListCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            underline: false
        }
        this.handleCellOver = this.handleCellOver.bind(this)
    }

    handleCellOver(val) {
        this.setState({
            underline: val
        })
    }

    render() {
        const { underline } = this.state
        const { item, value, index, length } = this.props

        return (
            <div
                style={{
                    display: 'inline',
                    cursor: 'pointer',
                    textDecoration: underline ? 'underline' : 'none'
                }}
                onMouseOver={() => this.handleCellOver(true)}
                onMouseLeave={() => this.handleCellOver(false)}
                onClick={() => this.props.onCellSelected(value, [item])}
            >
                {item}{index != length -1 && <div style={{display: 'inline'}}>, </div> }
            </div>
        )
    }
}

export default ListCell
