import React, { Component } from 'react'
import { text, purple } from '@rover/react-bootstrap'

class ListCellFormatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            onCell: false,
            totalWidth: 0,
            value: '',
            remaining: []
        }

        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.calcLayout = this.calcLayout.bind(this)
    }

    handleMouseOver(e) {
        e.persist()
        const { handleCellEnter } = this.props

        this.setState({ onCell: true })
        setTimeout(() => {
            if (this.state.onCell) {
                handleCellEnter(e, this.state.remaining, true)
            }
        }, 300)
    }

    handleMouseLeave() {
        const { handleCellLeave } = this.props
        this.setState({ onCell: false })
        handleCellLeave()
    }

    getExcess(totalWidth) {
        let remainingWidth = totalWidth - 70
        let newStr = ''
        let remaining = []
        this.props.value.split(',').forEach(val => {
            if (
                (newStr.length + val.length) * 6 <= remainingWidth &&
                remaining.length === 0
            ) {
                newStr += `${val},`
            } else {
                remaining.push(val.trim())
            }
        })

        this.setState({
            value: newStr,
            remaining
        })
    }

    calcLayout() {
        const id = `listCellElement_${this.props.column.key}`
        let stringPixelLength = this.props.value.length * 6
        let totalWidth = document.getElementById(id)
            .parentElement.parentElement.parentElement.parentElement
            .parentElement.offsetWidth

        if (stringPixelLength >= totalWidth - 25) {
            this.getExcess(totalWidth)
        } else {
            this.setState({
                value: this.props.value,
                remaining: []
            })
        }
    }

    componentDidMount() {
        this.calcLayout()
    }

    componentWillReceiveProps() {
        this.calcLayout()
    }

    render() {
        const id = `listCellElement_${this.props.column.key}`
        return (
            <div
                style={{
                    display: 'flex'
                }}
            >
                <div
                    id={id}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {this.state.value}
                </div>
                {this.state.remaining.length > 0 && (
                    <div
                        style={{
                            ...text,
                            color: purple
                        }}
                        onMouseOver={this.handleMouseOver}
                        onMouseLeave={this.handleMouseLeave}
                    >
                        + {this.state.remaining.length} more
                    </div>
                )}
            </div>
        )
    }
}

export default ListCellFormatter