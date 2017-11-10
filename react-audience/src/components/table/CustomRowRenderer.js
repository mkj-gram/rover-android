import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-data-grid'
import { cloud, text } from '@rover/react-bootstrap'

import RowActionButton from './RowActionButton'

class HoverContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hover: false
        }
    }

    onMouseOver() {
        this.setState({ hover: true })
    }

    onMouseLeave() {
        this.setState({ hover: false })
    }

    render() {
        const { hover } = this.state
        const props = this.props
        const rowStyle = {
            height: 50,
            ...text,
            border: 'none',
            borderBottom: `1px solid ${cloud}`,
            position: 'relative'
        }
        return (
            <div
                style={rowStyle}
                onMouseOver={() => this.onMouseOver()}
                onMouseLeave={() => this.onMouseLeave()}
            >
                <RowActionButton
                    isButtonShowing={hover ||
                        (props.tooltipRowIdx === props.idx &&
                            props.showToolTips)}
                    rowId={props.idx}
                    handleClick={type => props.clickHandler(type)}
                />
                <Row {...props} />
            </div>
        )
    }
}

const CustomRowRenderer = props => (
        <HoverContainer {...props} />
)

CustomRowRenderer.propTypes = {
    clickHandler: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired
}

export default CustomRowRenderer
