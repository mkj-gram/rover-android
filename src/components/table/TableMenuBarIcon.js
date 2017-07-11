import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    DonutChart,
    ColumnsIcon,
    DownloadIcon,
    TagIcon
} from '@rover/react-icons'
import { mercury, straw, purple, silver } from '@rover/react-bootstrap'

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
            hover: false
        }
        this.toggleHover = this.toggleHover.bind(this)
        this.getHoverStyle = this.getHoverStyle.bind(this)
        this.getTableMenuIcon = this.getTableMenuIcon.bind(this)
    }

    toggleHover() {
        this.setState({ ...this.state, hover: !this.state.hover })
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
            donut: DonutChart({ fill: this.getHoverStyle()[1] }),
            tag: TagIcon({ fill: this.getHoverStyle()[1] }),
            columns: ColumnsIcon({
                fill: this.getHoverStyle()[1],
                style: { pointerEvents: 'none' }
            })
        }
        return tableMenuIcons[val]
    }

    render() {
        return (
            <div
                style={this.getHoverStyle()[0]}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
            >
                {this.getTableMenuIcon(this.props.val)}
            </div>
        )
    }
}

export default TableMenuBarIcon
