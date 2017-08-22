import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AudienceTable from './table/AudienceTable'
import SideBar from './sidebar/SideBar'

class Audience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segment: {
                segmentId: '',
                name: ''
            },
            predicates: '{"profiles":[],"devices":[],"condition":"ALL"}',
            pageNumber: 0,
            resetPagination: false,
            context: 'predicates',
            saveStates: {
                isSegmentUpdate: false,
                showSaveButton: false
            },
            refetchData: true,
            reset: false,
            queryCondition: 'ALL'
        }
        this.getSegment = this.getSegment.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.formatQuery = this.formatQuery.bind(this)
        this.updatePageNumber = this.updatePageNumber.bind(this)
        this.setSaveState = this.setSaveState.bind(this)
        this.setSegment = this.setSegment.bind(this)
        this.updateSegmentName = this.updateSegmentName.bind(this)
        this.archiveSegment = this.archiveSegment.bind(this)
        this.setQueryCondition = this.setQueryCondition.bind(this)
    }

    setQueryCondition(queryCondition, initial = false, query = null) {
        if (initial) {
            this.setState({
                queryCondition,
                segmentIdRefetch: false,
                predicates: this.formatQuery(query, queryCondition)
            })
        } else {
            const pred = JSON.parse(this.state.predicates)

            this.setState({
                queryCondition,
                segmentIdRefetch: false,
                refetchData: (pred.profiles.length !== 0 || pred.devices.length !== 0),
                predicates: this.formatQuery(query, queryCondition),
                resetPagination: true,
                pageNumber: 0,
                context: 'predicates',
                reset: false
            })
        }
    }

    getSegment(segment) {
        this.setState({
            segment,
            resetPagination: true,
            pageNumber: 0,
            context: 'segments',
            refetchData: true,
            segmentIdRefetch: true,
            reset: false
        })
    }

    updateQuery(rawQuery, condition) {
        const predicates = this.formatQuery(rawQuery, condition)
        this.setState({
            predicates,
            resetPagination: true,
            pageNumber: 0,
            context: 'predicates',
            refetchData: true,
            segmentIdRefetch: false,
            reset: false
        })
    }

    setSaveState(saveStates) {
        this.setState({ saveStates })
    }

    formatQuery(rawQuery, condition) {
        const profiles = []
        const devices = []
        rawQuery.forEach((query) => {
            if (query.category === 'profile') {
                profiles.push(query)
            } else {
                devices.push(query)
            }
        })

        const val = {
            profiles,
            devices,
            condition
        }

        return JSON.stringify(val)
    }

    updateSegmentName(segment) {
        if (segment.segmentId === this.state.segment.segmentId) {
            this.setState({
                segment
            })
        }
    }

    archiveSegment(id) {
        if (this.state.segment.segmentId === id) {
            this.setState({
                segment: {
                    segmentId: '',
                    name: ''
                },
                predicates: '{"profiles":[],"devices":[],"condition":"ANY"}',
                pageNumber: 0,
                resetPagination: true,
                context: 'predicates',
                saveStates: {
                    isSegmentUpdate: false,
                    showSaveButton: false
                },
                refetchData: true,
                reset: true
            })
        }
    }

    updatePageNumber(pageNumber) {
        this.setState({ pageNumber, resetPagination: false })
    }

    setSegment(segment) {
        this.setState({
            segment,
            context: 'segments',
            refetchData: false,
            saveStates: {
                isSegmentUpdate: false,
                showSaveButton: false
            },
            reset: false
        })
    }

    render() {
        const {
            segment,
            predicates,
            pageNumber,
            resetPagination,
            saveStates,
            refetchData
        } = this.state
        const { data } = this.props

        return (
            <div style={{ display: 'flex', flex: '1 1 100%' }}>
                <SideBar
                    data={data}
                    segment={segment}
                    getSegment={this.getSegment}
                    updateQuery={this.updateQuery}
                    saveStates={saveStates}
                    refetchData={refetchData}
                    setSegment={this.setSegment}
                    segmentIdRefetch={this.state.segmentIdRefetch}
                    updateSegmentName={this.updateSegmentName}
                    archiveSegment={this.archiveSegment}
                    reset={this.state.reset}
                    setQueryCondition={this.setQueryCondition}
                    queryCondition={this.state.queryCondition}
                />
                <AudienceTable
                    data={data}
                    segmentId={segment.segmentId}
                    predicates={predicates}
                    pageNumber={pageNumber}
                    context={this.state.context}
                    updatePageNumber={this.updatePageNumber}
                    resetPagination={resetPagination}
                    setSaveState={this.setSaveState}
                    refetchData={refetchData}
                    reset={this.state.reset}
                />
            </div>
        )
    }
}

Audience.propTypes = {
    data: PropTypes.object.isRequired
}

export default Audience
