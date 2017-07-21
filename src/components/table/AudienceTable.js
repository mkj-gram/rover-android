import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, createRefetchContainer } from 'react-relay'
import { Tooltip } from '@rover/react-bootstrap'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBar from './TableMenuBar'

import DateCellFormatter from './DateCellFormatter'
import BooleanCellFormatter from './BooleanCellFormatter'

class AudienceTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedColumns: {
                devices: {
                    'deviceId': 'StringPredicate',
                    'deviceOS': 'StringPredicate',
                    'deviceOSVersion': 'VersionPredicate',
                    'model': 'StringPredicate',
                    'appVersion': 'StringPredicate'
                },
                profiles: {
                    'firstName': 'StringPredicate'
                }
            },
            segmentId: '',
            predicates: '[]',
            formattedData: {},
            renderSegmentsFromPredicates: false,
            renderDynamicPredicates: false,
            columns: [],
            rows: [],
            segmentSize: 0,
            totalSize: 0,
            toolTip: {
                isTooltipShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            }
        }

        this.createRowsAndColumns = this.createRowsAndColumns.bind(this)
        this.getSelectedColumns = this.getSelectedColumns.bind(this)
        this.getSelectedRows = this.getSelectedRows.bind(this)
        this.formatRowData = this.formatRowData.bind(this)
        this.updateDragColumns = this.updateDragColumns.bind(this)
        this.handleCellEnter = this.handleCellEnter.bind(this)
        this.handleCellLeave = this.handleCellLeave.bind(this)
        this.getFormat = this.getFormat.bind(this)
    }

    componentDidMount() {
        const { data } = this.props
        const { deviceSchema, profileSchema } = data.adgSegmentSchema
        const {
            devices,
            profiles,
            segmentSize,
            totalSize
        } = data.adgSegmentsFromPredicates
        this.createRowsAndColumns(
            deviceSchema.concat(profileSchema),
            devices,
            profiles
        )
        this.setState({ segmentSize, totalSize })
    }

    componentWillReceiveProps(nextProps) {
        const {
            segmentId,
            predicates,
            renderSegmentsFromPredicates,
            renderDynamicPredicates
        } = this.state
        const { relay } = this.props
        let refetchVariables

        if (segmentId !== nextProps.segmentId) {
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: false,
                includeDynamicSegment: true,
                segmentId: nextProps.segmentId,
                predicates: '[]'
            })
            relay.refetch(refetchVariables, null)
            this.setState({
                segmentId: nextProps.segmentId,
                renderSegmentsFromPredicates: true,
                renderDynamicPredicates: false
            })
        }

        if (
            JSON.stringify(predicates) !== JSON.stringify(nextProps.predicates)
        ) {
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: true,
                includeDynamicSegment: false,
                predicates: nextProps.predicates,
                segmentId: ''
            })
            relay.refetch(refetchVariables, null)
            this.setState({
                predicates: nextProps.predicates,
                renderSegmentsFromPredicates: false,
                renderDynamicPredicates: true
            })
        }

        if (renderSegmentsFromPredicates) {
            const {
                devices,
                profiles,
                segmentSize,
                totalSize
            } = nextProps.data.adgDynamicSegment[0].data
            this.setState({
                rows: this.getSelectedRows(profiles, devices),
                segmentSize,
                totalSize
            })
        } else if (renderDynamicPredicates) {
            const {
                devices,
                profiles,
                segmentSize,
                totalSize
            } = nextProps.data.adgSegmentsFromPredicates
            this.setState({
                rows: this.getSelectedRows(profiles, devices),
                segmentSize,
                totalSize
            })
        }
    }

    handleCellEnter(e, message) {
        const target = e.target.getBoundingClientRect()
        this.setState({
            toolTip: {
                isTooltipShowing: !this.state.toolTip.isTooltipShowing,
                message,
                coordinates: {
                    x: target.left - 300,
                    y: target.top - 60 + target.height,
                    divWidth: target.width
                }
            }
        })
    }

    handleCellLeave() {
        if (this.state.toolTip.isTooltipShowing) {
            this.setState({
                toolTip: {
                    isTooltipShowing: false,
                    message: '',
                    coordinates: {
                        x: 0,
                        y: 0,
                        divWidth: 0
                    }
                }
            })
        }
    }

    createRowsAndColumns(attributes, devices, profiles) {
        const columns = this.getSelectedColumns(attributes)
        const rows = this.getSelectedRows(profiles, devices)

        this.setState({
            columns,
            rows
        })
    }

    getFormat(type) {
        /* --------------------------------------------------------------------
        /*
         * ToDo: Missing List Format (ListCellFormatter)  && Empty Cell
         */
        // --------------------------------------------------------------------

        switch (type) {
            case 'DatePredicate':
                return (
                    <DateCellFormatter
                        handleCellEnter={this.handleCellEnter}
                        handleCellLeave={this.handleCellLeave}
                    />
                )
            case 'BooleanPredicate':
                return <BooleanCellFormatter />
            default:
        }
    }

    getSelectedColumns(attributes) {
        const columns = []
        const { selectedColumns } = this.state

        attributes.map(elem => {
            let attr = elem.attribute

            if (
                Object.keys(selectedColumns.devices).includes(attr)|| 
                Object.keys(selectedColumns.profiles).includes(attr)
            ) {
                columns.push({
                    key: attr,
                    name: attr,
                    width: 200,
                    draggable: true,
                    resizable: true,
                    formatter: this.getFormat(elem.type)
                })
            }
        })
  
        return columns
    }



    getSelectedRows(profiles, devices) {
        const {
            devices: selectedDevices,
            profiles: selectedProfiles
        } = this.state.selectedColumns

        const concatData = devices.map(device => {
            const { profileId } = device
            if (profileId) {
                return {
                    ...device,
                    ...profiles.filter((profile) => profile.profileId === profileId)[0]
                }
            }
        })

        let rows = concatData.map(data => {
            let row = {}
            for (let key in data) {
                if (key in selectedDevices || key in selectedProfiles) {
                    row[key] = this.formatRowData(data[key], selectedDevices[key] || selectedProfiles[key])
                }
            }
            return row
        })

        return rows
    }

    formatRowData(data, type) {
         /*
         * ToDo: Parsed 'location' attributeType
         */
        let ret = data
        if (type === 'VersionPredicate') {
            ret = Object.values(data).join('.')
        }
        return ret
    }

    updateDragColumns(dragState) {
        const { columns, rows } = dragState
        this.setState({ columns, rows })
    }

    render() {
        const { columns, rows, segmentSize, totalSize } = this.state
        const { isTooltipShowing, message, coordinates } = this.state.toolTip
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 100%',
                    position: 'relative'
                }}
            >
                <TableMenuBar segmentSize={segmentSize} totalSize={totalSize} />
                <AudienceDataGrid
                    segmentSize={segmentSize}
                    columns={columns}
                    rows={rows}
                    updateDragColumns={this.updateDragColumns}
                />
                {isTooltipShowing &&
                    <Tooltip message={message} coordinates={coordinates} />}
            </div>
        )
    }
}

AudienceTable.propTypes = {
    data: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    segmentId: PropTypes.string.isRequired,
    predicates: PropTypes.string.isRequired
}

export default createRefetchContainer(
    AudienceTable,
    graphql.experimental`
        fragment AudienceTable on Query
            @argumentDefinitions(
                segmentId: { type: "ID", defaultValue: "" }
                includeSegmentsFromPredicates: {
                    type: "Boolean!"
                    defaultValue: true
                }
                predicates: { type: "String!", defaultValue: "[]" }
                includeDynamicSegment: { type: "Boolean!", defaultValue: true }
            ) {
            adgDynamicSegment: dynamicSegment(
                segmentId: $segmentId
                paginationKey: "testpaginationkey"
            ) {
                ... on DynamicSegment @include(if: $includeDynamicSegment) {
                    name
                    segmentId
                    data {
                        segmentSize
                        totalSize
                        devices
                        profiles
                    }
                }
            }
            adgSegmentSchema: segmentSchema {
                deviceSchema {
                    ... on SchemaAttribute {
                        attribute
                        type
                    }
                }
                profileSchema {
                    ... on SchemaAttribute {
                        attribute
                        type
                    }
                }
            }
            adgSegmentsFromPredicates: segmentFromPredicates(
                predicates: $predicates
                paginationKey: "testpaginationkey"
            ) {
                ... on SegmentData
                    @include(if: $includeSegmentsFromPredicates) {
                    segmentSize
                    totalSize
                    devices
                    profiles
                }
            }
        }
    `,
    graphql.experimental`
        query AudienceTableRefetchQuery(
            $segmentId: ID
            $includeSegmentsFromPredicates: Boolean!
            $predicates: String!
            $includeDynamicSegment: Boolean!
        ) {
            ...AudienceTable
                @arguments(
                    segmentId: $segmentId
                    includeSegmentsFromPredicates: $includeSegmentsFromPredicates
                    predicates: $predicates
                    includeDynamicSegment: $includeDynamicSegment
                )
        }
    `
)
