import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createFragmentContainer, graphql } from 'react-relay'
import SegmentSelection from './SegmentSelection'
import SegmentSave from './SegmentSave'
import UpdateSegmentNameMutation from '../../mutations/UpdateSegmentNameMutation'
import ArchiveSegmentMutation from '../../mutations/ArchiveSegmentMutation'

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
        const { segments, archiveSegment } = this.props
        ArchiveSegmentMutation(segments[index].segmentId, archiveSegment)
        this.setState({
            segments
        })
    }

    updateSegmentCell(index, value) {
        const segments = JSON.parse(JSON.stringify(this.props.segments))
        segments[index].name = value.length !== 0 ? value : `No Name ${index}`

        UpdateSegmentNameMutation(
            segments[index].segmentId,
            segments[index].name,
            null,
            null,
            null
        )
        this.props.updateSegmentName(segments[index])
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
            segment,
            saveStates,
            setSegment,
            reset,
            queryCondition
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
                    reset={this.props.reset}
                />
                <SegmentSave
                    isOpen={showSegmentSave}
                    onRequestClose={handleSegmentAction}
                    modalCoordinates={segmentCoords}
                    query={query}
                    segment={segment}
                    saveStates={saveStates}
                    setSegment={setSegment}
                    reset={reset}
                    queryCondition={queryCondition}
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
    segments: PropTypes.array.isRequired,
    segment: PropTypes.object.isRequired,
    archiveSegment: PropTypes.func.isRequired,
    updateSegmentName: PropTypes.func.isRequired,
    getSegment: PropTypes.func.isRequired,
    reset: PropTypes.bool.isRequired,
    setSegment: PropTypes.func.isRequired,
    saveStates: PropTypes.object.isRequired,
    queryCondition: PropTypes.string.isRequired
}

SegmentsContainer.defaultProps = {
    query: [],
    showSegmentSave: false,
    showSegmentSelection: false,
    handleSegmentAction: () => null,
    segments: [],
    segment: {},
    archiveSegment: () => null,
    updateSegmentName: () => null,
    getSegment: () => null,
    reset: false,
    setSegment: () => null,
    saveStates: {},
    queryCondition: 'ALL'
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
