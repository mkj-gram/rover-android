import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SideBarRefetchContainer from './relayContainers/SideBarRefetchContainer'
import AudienceTableRefetchContainer from './relayContainers/AudienceTableRefetchContainer'

class Audience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segment: {
                segmentId: '',
                name: ''
            },
            predicates: '[]',
            pageNumber: 0,
            group: 0,
            resetPagination: false,
            context: 'predicates',

            refetchData: true,
            refetchSideBar: true,
            reset: false,
            queryCondition: 'ALL',
            fetchSegmentsFromPred: false,
            refresh: false
        }
        this.getSegment = this.getSegment.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.formatQuery = this.formatQuery.bind(this)
        this.updatePageNumber = this.updatePageNumber.bind(this)
        this.setSegment = this.setSegment.bind(this)
        this.updateSegmentName = this.updateSegmentName.bind(this)
        this.archiveSegment = this.archiveSegment.bind(this)
        this.setQueryCondition = this.setQueryCondition.bind(this)
        this.refreshData = this.refreshData.bind(this)
    }

    setQueryCondition(queryCondition, initial = false, query = null) {
        if (!initial) {
            let predicates = this.formatQuery(query, queryCondition)
            let fetchSegmentsFromPred = false
            if (
                JSON.stringify(this.state.predicates) !==
                JSON.stringify(predicates)
            ) {
                fetchSegmentsFromPred = true
            }
            this.setState({
                queryCondition,
                segmentIdRefetch: false,
                refetchData: query.length !== 0,
                refetchSideBar: false,
                predicates,
                resetPagination: true,
                pageNumber: 0,
                group: 0,
                context: 'predicates',
                reset: false,
                fetchSegmentsFromPred
            })
        } else {
            this.setState({
                queryCondition,
                segmentIdRefetch: false
            })
        }
    }

    refreshData(completed = false) {
        const { context } = this.state
        if (completed) {
            this.setState({
                refresh: false,
                refetchData: false
            })
        } else if (!completed) {
            if (context === 'segments') {
                this.setState({
                    refetchData: true,
                    resetPagination: true,
                    group: 0,
                    pageNumber: 0,
                    refetchSideBar: false,
                    segmentIdRefetch: false,
                    refresh: true
                })
            } else if (context === 'predicates') {
                this.setState({
                    fetchSegmentsFromPred: false,
                    resetPagination: true,
                    group: 0,
                    pageNumber: 0,
                    refetchData: true,
                    refetchSideBar: false,
                    segmentIdRefetch: false,
                    refresh: true
                })
            }
        }
    }

    getSegment(segment) {
        this.setState({
            segment,
            resetPagination: true,
            group: 0,
            pageNumber: 0,
            context: 'segments',
            refetchData: true,
            refetchSideBar: true,
            segmentIdRefetch: true,
            reset: false
        })
    }

    updateQuery(rawQuery, condition) {
        let fetchSegmentsFromPred = false
        const predicates = this.formatQuery(rawQuery, condition)
        if (
            JSON.stringify(this.state.predicates) !==
                JSON.stringify(predicates) ||
            this.state.context !== 'predicates'
        ) {
            fetchSegmentsFromPred = true
        }

        this.setState({
            predicates,
            resetPagination: true,
            group: 0,
            pageNumber: 0,
            context: 'predicates',
            refetchData: true,
            refetchSideBar: false,
            segmentIdRefetch: false,
            reset: false,

            fetchSegmentsFromPred
        })
    }

    formatQuery(query, condition) {
        const val = {
            query,
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
                predicates: '[]',
                pageNumber: 0,
                resetPagination: true,
                group: 0,
                context: 'predicates',
                refetchData: true,
                refetchSideBar: false,
                segmentIdRefetch: false,
                reset: true,
                fetchSegmentsFromPred: true
            })
        }
    }

    updatePageNumber(pageNumber) {
        let resetPagination
        let group = this.state.group
        let fetchSegmentsFromPred
        if (
            pageNumber >= this.state.group &&
            pageNumber < this.state.group + 3
        ) {
            resetPagination = false
            fetchSegmentsFromPred = false
        } else {
            group = Math.floor(pageNumber / 3) * 3
            fetchSegmentsFromPred = true
            resetPagination = null
        }

        this.setState({
            pageNumber,
            resetPagination,
            fetchSegmentsFromPred,
            group,
            refetchData: true
        })
    }

    setSegment(segment) {
        this.setState({
            segment,
            context: 'segments',
            refetchData: false,
            refetchSideBar: false,
            reset: false
        })
    }

    render() {
        const {
            segment,
            predicates,
            pageNumber,
            resetPagination,
            refetchData
        } = this.state
        const { data } = this.props

        return (
            <div style={{ display: 'flex', flex: '1 1 100%' }}>
                <SideBarRefetchContainer
                    data={data}
                    segment={segment}
                    getSegment={this.getSegment}
                    updateQuery={this.updateQuery}
                    refetchData={this.state.refetchSideBar}
                    setSegment={this.setSegment}
                    segmentIdRefetch={this.state.segmentIdRefetch}
                    updateSegmentName={this.updateSegmentName}
                    archiveSegment={this.archiveSegment}
                    reset={this.state.reset}
                    setQueryCondition={this.setQueryCondition}
                    queryCondition={this.state.queryCondition}
                    context={this.state.context}
                    predicates={this.state.predicates}
                />
                <AudienceTableRefetchContainer
                    data={data}
                    segmentId={segment.segmentId}
                    predicates={predicates}
                    pageNumber={pageNumber}
                    context={this.state.context}
                    updatePageNumber={this.updatePageNumber}
                    resetPagination={resetPagination}
                    refetchData={refetchData}
                    fetchSegmentsFromPred={this.state.fetchSegmentsFromPred}
                    refreshData={this.refreshData}
                    refresh={this.state.refresh}
                />
            </div>
        )
    }
}

Audience.propTypes = {
    data: PropTypes.object.isRequired
}

Audience.defaultProps = {
    data: {}
}

export default Audience
