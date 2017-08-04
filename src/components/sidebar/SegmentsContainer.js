import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import SegmentSelection from './SegmentSelection'
import SegmentSave from './SegmentSave'

class SegmentsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentCoords: [0, 0]
        }
        this.removeSegmentCell = this.removeSegmentCell.bind(this)
        this.updateSegmentCell = this.updateSegmentCell.bind(this)
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
        // Need to update with mutation

        const { segments } = this.props
        segments.splice(index, 1)
        this.setState({
            segments
        })
    }

    updateSegmentCell(index, value) {
        /*
         * Need to do a mutation to actually update segment name
         */
        const segments = JSON.parse(JSON.stringify(this.props.segments))
        segments[index].name = value.length !== 0 ? value : `No Name ${index}`
        this.setState({
            segments
        })
    }

    render() {
        const {
            showSegmentSelection,
            showSegmentSave,
            query,
            handleSegmentAction,
            segments,
            getSegment,
            segment
        } = this.props
        const { segmentCoords } = this.state

        return (
            <div>
                <SegmentSelection
                    isOpen={showSegmentSelection}
                    onRequestClose={handleSegmentAction}
                    modalCoordinates={segmentCoords}
                    segments={segments}
                    removeSegmentCell={this.removeSegmentCell}
                    updateSegmentCell={this.updateSegmentCell}
                    getSegment={getSegment}
                />
                <SegmentSave
                    isOpen={showSegmentSave}
                    onRequestClose={handleSegmentAction}
                    modalCoordinates={segmentCoords}
                    query={query}
                    segment={segment}
                    saveStates={this.props.saveStates}
                />
            </div>
        )
    }
}

SegmentsContainer.propTypes = {
    query: PropTypes.array.isRequired,
    showSegmentSave: PropTypes.bool.isRequired,
    showSegmentSelection: PropTypes.bool.isRequired,
    handleSegmentAction: PropTypes.func.isRequired,
    getSegmentId: PropTypes.func.isRequired,
    segments: PropTypes.array.isRequired,
    segment: PropTypes.object.isRequired
}

SegmentsContainer.defaultProps = {
    query: [],
    showSegmentSave: false,
    showSegmentSelection: false,
    handleSegmentAction: () => null,
    getSegmentId: () => null,
    segments: [],
    segment: {}
}

export default createFragmentContainer(
    SegmentsContainer,
    graphql`
        fragment SegmentsContainer_segments on DynamicSegment
            @relay(plural: true) {
            name
            segmentId
        }
    `
)
