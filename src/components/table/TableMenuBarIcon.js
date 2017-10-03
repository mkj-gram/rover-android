import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    ColumnsIcon,
    DownloadIcon,
    TagIcon,
    AudienceRefreshIcon
} from '@rover/react-icons'
import { purple, silver, Tooltip, offwhite } from '@rover/react-bootstrap'

const iconBackdropHover = {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px',
    width: '36px',
    backgroundColor: offwhite,
    boxShadow: 'rgba(0, 0, 0,0.05) 0px 3px'
}

const iconBackdrop = {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30px',
    width: '36px',
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0,0.05) 0px 3px'
}

class TableMenuBarIcon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hover: false,
            toolTip: {
                isTooltipShowing: false,
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
        const message = {
            columns: 'Manage Columns',
            tag: 'Manage Tags',
            download: 'Manage Downloads',
            refresh: 'Refetch Data'
        }

        e.persist()
        if (!this.state.toolTip.isTooltipShowing) {
            const target = e.target.getBoundingClientRect()
            this.setState({
                toolTip: {
                    isTooltipShowing: true,
                    message: message[this.props.val],
                    coordinates: {
                        x: target.left - 300,
                        y: target.top + target.height - 60,
                        divWidth: target.width
                    }
                },
                hover: true
            })
        }
    }

    handleMouseLeave() {
        this.setState({
            toolTip: {
                isTooltipShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            },
            hover: false
        })
    }

    getHoverStyle() {
        const hoverStyle = []
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
            }),
            refresh: AudienceRefreshIcon({
                fill: this.getHoverStyle()[1]
            })
        }
        return tableMenuIcons[val]
    }

    render() {
        const { isTooltipShowing, message, coordinates } = this.state.toolTip
        const { showToolTip } = this.props
        return (
            <div
                onMouseOver={this.handleMouseOver}
                onMouseLeave={this.handleMouseLeave}
                style={this.getHoverStyle()[0]}
            >
                {this.getTableMenuIcon(this.props.val)}
                {isTooltipShowing &&
                showToolTip && (
                    <Tooltip message={message} coordinates={coordinates} />
                )}
            </div>
        )
    }
}

TableMenuBarIcon.propTypes = {
    val: PropTypes.string.isRequired,
    showToolTip: PropTypes.bool
}

TableMenuBarIcon.defaultProps = {
    val: '',
    showToolTip: true
}

export default TableMenuBarIcon
