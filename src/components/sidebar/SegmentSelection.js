import React from 'react'
import PropTypes from 'prop-types'

import { Modal, graphite, text, regular, steel } from '@rover/react-bootstrap'

import SegmentCell from './SegmentCell'

const SegmentSelection = ({
    isOpen,
    onRequestClose,
    modalCoordinates,
    segments,
    removeSegmentCell,
    updateSegmentCell
}) =>
    (<Modal
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
            }
        }}
        bodyOpenClassName="SegmentSelections"
        hoverStyle={{
            backgroundColor: steel
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
                    segment={segment.name}
                    key={index}
                    index={index}
                    removeSegmentCell={removeSegmentCell}
                    updateSegmentCell={updateSegmentCell}
                />)
            )}
        </div>
    </Modal>
    )

SegmentSelection.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    modalCoordinates: PropTypes.array.isRequired,
    segments: PropTypes.array.isRequired,
    removeSegmentCell: PropTypes.func.isRequired,
    updateSegmentCell: PropTypes.func.isRequired
}

SegmentSelection.defaultProps = {
    isOpen: false,
    onRequestClose: () => null,
    modalCoordinates: [0, 0],
    segments: [],
    removeSegmentCell: () => null,
    updateSegmentCell: () => null
}

export default SegmentSelection
