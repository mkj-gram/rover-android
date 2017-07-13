import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    DonutChart,
    ColumnsIcon,
    DownloadIcon,
    TagIcon
} from '@rover/react-icons'
import { mercury, straw, purple, silver, Tooltip } from '@rover/react-bootstrap'

const overlayParent = {
    width: '36px',
    height: '30px',
    position: 'relative'
}

const iconBackdropHover = {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px',
    width: '36px',
    backgroundColor: straw,
    boxShadow: `0px 3px ${mercury}`
}

const iconBackdrop = {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px',
    width: '36px',
    backgroundColor: 'white',
    boxShadow: `0px 3px ${mercury}`
}

class TableMenuBarIcon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hover: false,
            toolTip: {
                isModalShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            }
        }
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.getHoverStyle = this.getHoverStyle.bind(this)
        this.getTableMenuIcon = this.getTableMenuIcon.bind(this)
    }

    handleMouseOver(e) {
        e.persist()
        this.setState({
            hover: true
        })
        setTimeout(() => {
            if (this.state.hover) {
                const target = e.target.getBoundingClientRect()
                this.setState({
                    toolTip: {
                        ...this.state.toolTip,
                        isModalShowing: true,
                        message: 'this is an icon tooltip message',
                        coordinates: {
                            x: target.left - 300,
                            y: target.top + target.height - 60,
                            divWidth: target.width
                        }
                    }
                })
            }
        }, 300)
    }

    handleMouseLeave() {
        this.setState({
            hover: false,
            toolTip: {
                isModalShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            }
        })
    }

    getHoverStyle() {
        let hoverStyle = []
        if (this.state.hover) {
            hoverStyle[0] = iconBackdropHover
            hoverStyle[1] = purple
        } else {
            hoverStyle[0] = iconBackdrop
            hoverStyle[1] = silver
        }
        return hoverStyle
    }

    getTableMenuIcon(val) {
        const tableMenuIcons = {
            download: DownloadIcon({ fill: this.getHoverStyle()[1] }),
            tag: TagIcon({ fill: this.getHoverStyle()[1] }),
            columns: ColumnsIcon({
                fill: this.getHoverStyle()[1],
                style: { pointerEvents: 'none' }
            })
        }
        return tableMenuIcons[val]
    }

    render() {
        const { isModalShowing, message, coordinates } = this.state.toolTip
        return (
            <div style={this.getHoverStyle()[0]}>
                <div
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseLeave}
                >
                    {this.getTableMenuIcon(this.props.val)}
                    {isModalShowing &&
                        <Tooltip message={message} coordinates={coordinates} />}
                </div>
            </div>
        )
    }
}

export default TableMenuBarIcon
