import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SegmentSelection from './SegmentSelection'
import SegmentSave from './SegmentSave'

class SegmentsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentCoords: [0, 0],
            segments: [
                {
                    name:
                        'If I was a long segment then A long segment name looks like this',
                    segmentId: 0
                },
                {
                    name: 'Android 2 Users',
                    segmentId: 1
                },
                {
                    name: 'IOS 11 Users',
                    segmentId: 2
                },
                {
                    name: 'Android 2 Users',
                    segmentId: 3
                },
                {
                    name: 'IOS 10 Users',
                    segmentId: 4
                },
                {
                    name: 'IOS 6 Users',
                    segmentId: 5
                },
                {
                    name: 'IOS 7 Users',
                    segmentId: 6
                },
                {
                    name: 'IOS 8 Users',
                    segmentId: 7
                },
                {
                    name: 'IOS 9 Users',
                    segmentId: 8
                },
                {
                    name: 'IOS 10 Users',
                    segmentId: 9
                },
                {
                    name: 'IOS 11 Users',
                    segmentId: 10
                },
                {
                    name: 'IOS 12 Users',
                    segmentId: 11
                }
            ]
        }

        this.removeSegmentCell = this.removeSegmentCell.bind(this)
        this.updateSegmentCell = this.updateSegmentCell.bind(this)
        this.getCurrentSegment = this.getCurrentSegment.bind(this)
    }

    componentDidMount() {
        const { left, height } = document
            .getElementById('saveBar')
            .getBoundingClientRect()
        this.setState({
            segmentCoords: [left, height]
        })
    }

    removeSegmentCell(index) {
        const { segments } = this.state
        segments.splice(index, 1)
        this.setState({
            segments
        })
    }

    updateSegmentCell(index, value) {
        const { segments } = this.state
        segments[index].name = value.length !== 0 ? value : `No Name ${index}`
        this.setState({
            segments
        })
    }

    getCurrentSegment() {
        const { segments } = this.state

        // Update when using real data
        return segments[1]
    }

    render() {
        const { showSegmentSelection, showSegmentSave, query, handleSegmentAction } = this.props
        const { segmentCoords, segments } = this.state

        return (
            <div>
                <SegmentSelection
                    isOpen={showSegmentSelection}
                    onRequestClose={handleSegmentAction}
                    modalCoordinates={segmentCoords}
                    segments={segments}
                    removeSegmentCell={this.removeSegmentCell}
                    updateSegmentCell={this.updateSegmentCell}
                />
                <SegmentSave
                    isOpen={showSegmentSave}
                    onRequestClose={handleSegmentAction}
                    modalCoordinates={segmentCoords}
                    query={query}
                    segment={this.getCurrentSegment()}
                />
            </div>
        )
    }
}

SegmentsContainer.propTypes = {
    query: PropTypes.array.isRequired,
    showSegmentSave: PropTypes.bool.isRequired,
    showSegmentSelection: PropTypes.bool.isRequired,
    handleSegmentAction: PropTypes.func.isRequired
}

SegmentsContainer.defaultProps = {
    query: [],
    showSegmentSave: false,
    showSegmentSelection: false,
    handleSegmentAction: () => null
}

export default SegmentsContainer
