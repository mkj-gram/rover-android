import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AudienceTable from './table/AudienceTable'
import SideBar from './sidebar/SideBar'

class Audience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentId: '',
            predicates: '[]',
            pageNumber: 0,
            resetPagination: false,
            context: 'predicates'
        }
        this.getSegmentId = this.getSegmentId.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.formatQuery = this.formatQuery.bind(this)
        this.updatePageNumber = this.updatePageNumber.bind(this)
    }

    getSegmentId(segmentId) {
        this.setState({
            segmentId,
            resetPagination: true,
            pageNumber: 0,
            context: 'segments'
        })
    }

    updateQuery(rawQuery, condition) {
        const predicates = this.formatQuery(rawQuery, condition)
        this.setState({
            predicates,
            resetPagination: true,
            pageNumber: 0,
            context: 'predicates'
        })
    }

    formatQuery(rawQuery, condition) {
        const profiles = []
        const devices = []
        for (const i in rawQuery) {
            if (rawQuery[i].category === 'profile') {
                profiles.push(rawQuery[i])
            } else {
                devices.push(rawQuery[i])
            }
        }
        const val = {
            profiles,
            devices,
            condition
        }

        return JSON.stringify(val)
    }

    updatePageNumber(pageNumber) {
        this.setState({ pageNumber, resetPagination: false })
    }

    render() {
        const { segmentId, predicates, pageNumber, resetPagination } = this.state
        const { data } = this.props

        return (
            <div style={{ display: 'flex', flex: '1 1 100%' }}>
                <SideBar
                    data={data}
                    segmentId={segmentId}
                    getSegmentId={this.getSegmentId}
                    updateQuery={this.updateQuery}
                />
                <AudienceTable
                    data={data}
                    segmentId={segmentId}
                    predicates={predicates}
                    pageNumber={pageNumber}
                    context={this.state.context}
                    updatePageNumber={this.updatePageNumber}
                    resetPagination={resetPagination}
                />
            </div>
        )
    }
}

Audience.propTypes = {
    data: PropTypes.object.isRequired
}

export default Audience
