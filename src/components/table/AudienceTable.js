import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, createRefetchContainer } from 'react-relay'
import { Tooltip } from '@rover/react-bootstrap'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBarAlpha from './TableMenuBarAlpha'

import DateCellFormatter from './DateCellFormatter'
import BooleanCellFormatter from './BooleanCellFormatter'

class AudienceTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedColumns: {},
            allColumns: {
                devices: {},
                profiles: {}
            },
            segmentId: '',
            predicates: '[]',
            formattedData: {},
            renderFetchEnabled: null,
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
            },
            profiles: [],
            group: 0,
            refetched: false,
            adgDynamicSegment: []
        }

        this.createRowsAndColumns = this.createRowsAndColumns.bind(this)
        this.getSelectedColumns = this.getSelectedColumns.bind(this)
        this.getSelectedRows = this.getSelectedRows.bind(this)
        this.formatRowData = this.formatRowData.bind(this)
        this.updateDragColumns = this.updateDragColumns.bind(this)
        this.handleCellEnter = this.handleCellEnter.bind(this)
        this.handleCellLeave = this.handleCellLeave.bind(this)
        this.getFormat = this.getFormat.bind(this)
        this.getAllColumns = this.getAllColumns.bind(this)
        this.updateChecked = this.updateChecked.bind(this)
        this.getSetCachedColumns = this.getSetCachedColumns.bind(this)
        this.refetchCallback = this.refetchCallback.bind(this)
        this.updateDynamicSegments = this.updateDynamicSegments.bind(this)
        this.renderFetch = this.renderFetch.bind(this)
        this.fetchData = this.fetchData.bind(this)
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

        this.getSetCachedColumns()

        this.getAllColumns(deviceSchema, profileSchema)
        this.createRowsAndColumns(devices, profiles)
        this.setState({ segmentSize, totalSize, devices, profiles })
    }

    getSetCachedColumns() {
        // HardCoded default selected Columns
        const selectedColumns = {
            deviceId: 'StringPredicate',
            deviceOS: 'StringPredicate',
            deviceOSVersion: 'VersionPredicate',
            model: 'StringPredicate',
            appVersion: 'StringPredicate',
            firstName: 'StringPredicate'
        }

        const cachedSelectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        if (!cachedSelectedColumns) {
            this.setState({
                selectedColumns
            })
            localStorage.setItem(
                'selectedColumns',
                JSON.stringify(selectedColumns)
            )
        } else {
            this.setState({
                selectedColumns: cachedSelectedColumns
            })
        }
    }

    getAllColumns(deviceSchema, profileSchema) {
        const devices = {}
        const profiles = {}

        deviceSchema.map(device => (
            devices[device.attribute] = device.type
        ))
        profileSchema.map(profile => (
            profiles[profile.attribute] = profile.type
        ))
        this.setState({ allColumns: { devices, profiles } })
    }

    updateChecked(category, item) {
        const { allColumns } = this.state
        let cachedSelectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        if (item in cachedSelectedColumns) {
            delete cachedSelectedColumns[item]
        } else {
            const property = {
                [item]: allColumns[category][item]
            }
            cachedSelectedColumns = Object.assign(
                {},
                property,
                cachedSelectedColumns
            )
        }

        this.setState({
            selectedColumns: cachedSelectedColumns
        })

        localStorage.setItem(
            'selectedColumns',
            JSON.stringify(cachedSelectedColumns)
        )

        this.createRowsAndColumns(this.state.devices, this.state.profiles)
    }

    refetchCallback(error, nextProps) {
        const group = Math.floor(nextProps.pageNumber / 3) * 3
        const { setSaveState } = this.props

        if (!error) {
            if (nextProps.context === 'predicates') {
                this.setState({
                    predicates: nextProps.predicates,
                    renderFetchEnabled: true,
                    group,
                    refetched: true
                })

                const predicates = JSON.parse(nextProps.predicates)

                setSaveState({
                    isSegmentUpdate: this.state.segmentId !== '',
                    showSaveButton:
                        (predicates.devices.length !== 0 ||
                        predicates.profiles.length !== 0)
                })
            } else if (nextProps.context === 'segments') {
                this.setState({
                    segmentId: nextProps.segmentId,
                    renderFetchEnabled: false,
                    group,
                    refetched: true
                })
                setSaveState({
                    isSegmentUpdate: false,
                    showSaveButton: false
                })
            }
        } else {
            console.log(`Error: ${error}`)
        }
    }

    fetchData(nextProps) {
        const { relay } = this.props
        let refetchVariables
        if (
            nextProps.context === 'predicates' &&
            JSON.stringify(this.props.predicates) !==
                JSON.stringify(nextProps.predicates)
        ) {
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: true,
                includeDynamicSegment: false,
                predicates: nextProps.predicates,
                segmentId: '',
                pageNumber: Math.floor(nextProps.pageNumber / 3)
            })
            relay.refetch(
                refetchVariables,
                null,
                error => this.refetchCallback(error, nextProps),
                { force: true }
            )
        } else if (nextProps.context === 'segments') {
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: false,
                includeDynamicSegment: true,
                segmentId: nextProps.segmentId,
                predicates: '[]',
                pageNumber: Math.floor(nextProps.pageNumber / 3)
            })
            relay.refetch(
                refetchVariables,
                null,
                error => this.refetchCallback(error, nextProps),
                { force: true }
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            refetched,
            renderFetchEnabled
        } = this.state

        if (nextProps.refetchData && !nextProps.reset) {
            if (nextProps.resetPagination) {
                this.setState({ group: 0 })
            }

            if (!refetched) {
                if (
                    nextProps.pageNumber >= this.state.group &&
                    nextProps.pageNumber < this.state.group + 3 &&
                    !nextProps.resetPagination
                ) {
                    this.setState({
                        rows: this.getSelectedRows(
                            this.state.profiles,
                            this.state.devices,
                            nextProps.pageNumber
                        )
                    })
                } else {
                    this.fetchData(nextProps)
                }
            } else if (renderFetchEnabled !== null) {
                this.renderFetch(nextProps)
            }
        } else {
            this.updateDynamicSegments(nextProps.segmentId)

            if (nextProps.reset) {
                this.fetchData(nextProps)
                if (renderFetchEnabled !== null) {
                    this.renderFetch(nextProps)
                }
            }
        }
    }

      renderFetch(nextProps) {
        let devices, profiles, segmentSize, totalSize
        const { renderFetchEnabled } = this.state

        if (renderFetchEnabled) {
            ;({
                devices,
                profiles,
                segmentSize,
                totalSize
            } = nextProps.data.adgSegmentsFromPredicates)
        } else {
            ;({
                devices,
                profiles,
                segmentSize,
                totalSize
            } = nextProps.data.adgDynamicSegment[0].data)
        }

        this.setState({
            rows: this.getSelectedRows(profiles, devices, nextProps.pageNumber),
            segmentSize,
            totalSize,
            profiles,
            devices,
            renderFetchEnabled: null,
            refetched: false
        })
    }

    updateDynamicSegments(segmentId) {
        this.setState({
            segmentId
        })
    }

    getSelectedRows(profiles, devices, pageNum = 0) {
        const selectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        const concatData = devices.map((device) => {
            const { profileId } = device
            if (profileId) {
                return {
                    ...device,
                    ...profiles.filter(
                        profile => profile.profileId === profileId
                    )[0]
                }
            }
            return {}
        })
        const rows = concatData.map((data) => {
            const row = {}
            Object.keys(data).forEach((key) => {
                if (key in selectedColumns) {
                    row[key] = this.formatRowData(
                        data[key],
                        selectedColumns[key]
                    )
                }
            })
            return row
        })

        const startRow = pageNum % 3 * 50

        return rows.slice(startRow, startRow + 50)
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

    createRowsAndColumns(devices, profiles) {
        const columns = this.getSelectedColumns()
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

    getSelectedColumns() {
        const columns = []
        const selectedColumns = JSON.parse(localStorage.selectedColumns)

        Object.keys(selectedColumns).map((attr) => {
            columns.push({
                key: attr,
                name: attr,
                width: 200,
                draggable: true,
                resizable: true,
                formatter: this.getFormat(selectedColumns[attr])
            })
        })
        return columns
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
        const selectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )
        if (Object.keys(columns).length > 0) {
            const rearrangeColumns = {}
            columns.map((attr) => {
                rearrangeColumns[attr.name] = selectedColumns[attr.name]
            })
            localStorage.setItem(
                'selectedColumns',
                JSON.stringify(rearrangeColumns)
            )
        }

        this.setState({ columns, rows })
    }

    render() {
        const {
            columns,
            rows,
            segmentSize,
            totalSize,
            selectedColumns
        } = this.state
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
                <TableMenuBarAlpha
                    segmentSize={segmentSize}
                    totalSize={totalSize}
                    allColumns={this.state.allColumns}
                    updateChecked={this.updateChecked}
                    selectedColumns={selectedColumns}
                />
                <AudienceDataGrid
                    segmentSize={segmentSize}
                    columns={columns}
                    rows={rows}
                    updateDragColumns={this.updateDragColumns}
                    updatePageNumber={this.props.updatePageNumber}
                    resetPagination={this.props.resetPagination}
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
    predicates: PropTypes.string.isRequired,
    resetPagination: PropTypes.bool.isRequired,
    pageNumber: PropTypes.number.isRequired,
    context: PropTypes.string.isRequired,
    updatePageNumber: PropTypes.func.isRequired,
    setSaveState: PropTypes.func.isRequired,
    refetchData: PropTypes.bool.isRequired,
    reset: PropTypes.bool.isRequired
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
                pageNumber: { type: "Int", defaultValue: 0 }
            ) {
            adgDynamicSegment: dynamicSegment(
                segmentId: $segmentId
                pageNumber: $pageNumber
                pageSize: 150
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
                pageNumber: $pageNumber
                pageSize: 150
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
            $pageNumber: Int
        ) {
            ...AudienceTable
                @arguments(
                    segmentId: $segmentId
                    includeSegmentsFromPredicates: $includeSegmentsFromPredicates
                    predicates: $predicates
                    includeDynamicSegment: $includeDynamicSegment
                    pageNumber: $pageNumber
                )
        }
    `
)
