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
            predicates: '[]',
            pageNumber: 0,
            resetPagination: false,
            context: 'predicates',
            saveStates: {
                isSegmentUpdate: false,
                showSaveButton: true
            }
        }
        this.getSegment = this.getSegment.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.formatQuery = this.formatQuery.bind(this)
        this.updatePageNumber = this.updatePageNumber.bind(this)
        this.setSaveState = this.setSaveState.bind(this)
    }

    getSegment(segment) {
        this.setState({
            segment,
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

    setSaveState(saveStates) {
        this.setState({saveStates})
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
        const { segment, predicates, pageNumber, resetPagination, saveStates } = this.state
        const { data } = this.props

        return (
            <div style={{ display: 'flex', flex: '1 1 100%' }}>
                <SideBar
                    data={data}
                    segment={segment}
                    getSegment={this.getSegment}
                    updateQuery={this.updateQuery}
                    saveStates={saveStates}
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
                />
            </div>
        )
    }
}

Audience.propTypes = {
    data: PropTypes.object.isRequired
}

export default Audience
