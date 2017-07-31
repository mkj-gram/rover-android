import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AudienceTable from './table/AudienceTable'
import SideBar from './sidebar/SideBar'

class Audience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentId: '',
            predicates: '[]'
        }
        this.getSegmentId = this.getSegmentId.bind(this)
        this.updateQuery = this.updateQuery.bind(this)
        this.formatQuery = this.formatQuery.bind(this)
    }

    getSegmentId(segmentId) {
        this.setState({ segmentId })
    }

    updateQuery(rawQuery, condition) {
        const predicates = this.formatQuery(rawQuery, condition)
        this.setState({ predicates })
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

    render() {
        const { segmentId, predicates } = this.state
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
                />
            </div>
        )
    }
}

Audience.propTypes = {
    data: PropTypes.object.isRequired
}

export default Audience
