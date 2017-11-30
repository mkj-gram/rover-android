import React, { Component } from 'react'
import { text, purple, silver } from '@rover/react-bootstrap'
import ListCell from './ListCell'

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
                (newStr.length + val.length) * 7 <= remainingWidth &&
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

    calcLayout(props) {
        const id = `listCellElement_${props.column.key}`
        let stringPixelLength = props.value.length * 6
        let totalWidth = document.getElementById(id).parentElement.parentElement
            .parentElement.parentElement.parentElement.offsetWidth

        if (stringPixelLength >= totalWidth - 25) {
            this.getExcess(totalWidth)
        } else {
            this.setState({
                value: props.value,
                remaining: []
            })
        }
    }

    componentDidMount() {
        this.calcLayout(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.calcLayout(nextProps)
    }

    render() {
        const { underline } = this.state
        const len = this.state.value.split(',').length

        const id = `listCellElement_${this.props.column.key}`
        if (this.props.value.length === 0) {
            return (
                <div
                    id={id}
                    style={{
                        ...text,
                        color: silver
                    }}
                >
                    Unknown
                </div>
            )
        }
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
                    {len > 0 &&
                        this.state.value
                            .split(',')
                            .map((item, i) => (
                                <ListCell
                                    length={len}
                                    index={i}
                                    key={i}
                                    item={item}
                                    value={this.props}
                                    onCellSelected={this.props.onCellSelected}
                                />
                            ))}
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
