import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    Modal,
    graphite,
    text,
    regular,
    ash
} from '@rover/react-bootstrap'

import SegmentCell from './SegmentCell'

class SegmentSelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSegment: null
        }
        this.currentEditSegment = this.currentEditSegment.bind(this)
    }

    currentEditSegment(currentSegment) {
        this.setState({ currentSegment })
    }

    render() {
        const {
            isOpen,
            onRequestClose,
            modalCoordinates,
            segments,
            removeSegmentCell,
            updateSegmentCell,
            getSegment
        } = this.props

        const { currentSegment } = this.state

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={() => onRequestClose('selection')}
                style={{
                    content: {
                        top: null,
                        right: null,
                        left: modalCoordinates[0] + 25,
                        bottom: modalCoordinates[1],
                        transform: null,
                        backgroundColor: graphite,
                        padding: 0,
                        width: 'auto',
                        overflow: 'hidden'
                    }, 
                    overlay: {
                        zIndex: 2
                    }
                }}
                bodyOpenClassName="SegmentSelections"
                hoverStyle={{
                    backgroundColor: ash
                }}
            >
                <div
                    style={{
                        ...text,
                        ...regular,
                        fontSize: 16,
                        color: 'white',
                        marginTop: 27,
                        marginBottom: 15,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    Select a segment
                </div>
                <div
                    style={{
                        height: 380,
                        width: 250,
                        overflow: 'auto'
                    }}
                >
                    {segments.map((segment, index) =>
                        (<SegmentCell
                            segment={segment}
                            key={index}
                            index={index}
                            removeSegmentCell={removeSegmentCell}
                            updateSegmentCell={updateSegmentCell}
                            currentEditSegment={this.currentEditSegment}
                            currentSegment={currentSegment}
                            getSegment={getSegment}
                            onRequestClose={onRequestClose}
                        />)
                    )}
                </div>
            </Modal>
        )
    }
}

SegmentSelection.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    modalCoordinates: PropTypes.array.isRequired,
    segments: PropTypes.array,
    removeSegmentCell: PropTypes.func.isRequired,
    updateSegmentCell: PropTypes.func.isRequired,
    getSegment: PropTypes.func.isRequired
}

SegmentSelection.defaultProps = {
    isOpen: false,
    onRequestClose: () => null,
    modalCoordinates: [0, 0],
    segments: [],
    removeSegmentCell: () => null,
    updateSegmentCell: () => null,
    getSegment: () => null
}

export default SegmentSelection
