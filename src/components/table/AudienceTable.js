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
            dataGridRows: [],
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
        this.updateContextData = this.updateContextData.bind(this)
        this.updateDynamicSegments = this.updateDynamicSegments.bind(this)
        this.renderFetch = this.renderFetch.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
        const { data } = this.props
        const { deviceSchema, profileSchema } = data.adgSegmentSchema
        const {
            dataGridRows,
            segmentSize,
            totalSize
        } = data.adgSegmentsFromPredicates

        this.getSetCachedColumns()

        this.getAllColumns(deviceSchema, profileSchema)
        this.createRowsAndColumns(dataGridRows)
        this.setState({ segmentSize, totalSize, dataGridRows })
    }

    getSetCachedColumns() {
        // HardCoded default selected Columns
        const selectedColumns = {
            device_id: 'StringPredicate',
            device_manufacturer: 'StringPredicate',
            os_version: 'VersionPredicate',
            device_model: 'StringPredicate',
            sdk_version: 'VersionPredicate',
            app_version: 'StringPredicate',
            profile_id: 'StringPredicate'
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

        this.createRowsAndColumns(this.state.dataGridRows)
    }

    fetchData(nextProps) {
        const { relay } = this.props
        let refetchVariables

        if (
            nextProps.context === 'predicates' && (
            JSON.stringify(this.props.predicates) !==
                JSON.stringify(nextProps.predicates) || !(nextProps.pageNumber >= this.state.group &&
                    nextProps.pageNumber < this.state.group + 3) )
        ) {
            const predicates = JSON.parse(nextProps.predicates)
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: true,
                includeDynamicSegment: false,
                predicates: JSON.stringify(predicates.query) || '[]',
                segmentId: '',
                pageNumber: Math.floor(nextProps.pageNumber / 3),
                condition: predicates.condition
            })
            relay.refetch(
                refetchVariables,
                null,
                error => { (error !== undefined) ? console.log(`Error: ${error}`) : ''},
                { force: true }
            )
        } else if (nextProps.context === 'segments') {
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: false,
                includeDynamicSegment: true,
                segmentId: nextProps.segmentId,
                predicates: '[]',
                pageNumber: Math.floor(nextProps.pageNumber / 3),
                condition: 'ANY'
            })

            relay.refetch(
                refetchVariables,
                null,
                error => { (error !== undefined) ? console.log(`Error: ${error}`) : ''},
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
                            this.state.dataGridRows,
                            nextProps.pageNumber
                        )
                    })
                } else {
                    this.setState({
                        refetched: true
                    }, this.fetchData(nextProps))
                }
            } else if (renderFetchEnabled === null) {
                this.updateContextData(nextProps)
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

    updateContextData(nextProps) {
        const { setSaveState } = this.props
        const group = Math.floor(nextProps.pageNumber / 3) * 3
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
                    (predicates.query && predicates.query.length !== 0)
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
    }

    renderFetch(nextProps) {
        const { renderFetchEnabled } = this.state
        let dataSource
        if (nextProps.data.adgDynamicSegment && nextProps.data.adgDynamicSegment[0].data) {
            dataSource = nextProps.data.adgDynamicSegment[0].data
        } else {
            dataSource = nextProps.data.adgSegmentsFromPredicates
        }

        const { dataGridRows, segmentSize, totalSize } = dataSource
        this.setState({
            rows: this.getSelectedRows(dataGridRows, nextProps.pageNumber),
            segmentSize,
            totalSize,
            dataGridRows,
            renderFetchEnabled: null,
            refetched: false
        })
    }

    updateDynamicSegments(segmentId) {
        this.setState({
            segmentId
        })
    }

    getSelectedRows(dataGridRows, pageNum = 0) {
        const selectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )
         
        const rows = dataGridRows.map(data => {
            let row = {}
            data.forEach(property => {
                if (property.attribute in selectedColumns) {
                    row[property.attribute] = this.formatRowData(
                        property.value,
                        selectedColumns[property.attribute]
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

    createRowsAndColumns(dataGridRows) {
        const columns = this.getSelectedColumns()
        const rows = this.getSelectedRows(dataGridRows)

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
        } else if (type === 'GeofencePredicate') {
            ret = data.name
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
                includeDynamicSegment: { type: "Boolean!", defaultValue: false }
                pageNumber: { type: "Int", defaultValue: 0 }
                condition: { type: "String", defaultValue: "ANY" }
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
                        dataGridRows
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
                condition: $condition       
            ) {
                ... on SegmentData
                    @include(if: $includeSegmentsFromPredicates) {
                    segmentSize
                    totalSize
                    dataGridRows
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
            $condition: String
        ) {
            ...AudienceTable
                @arguments(
                    segmentId: $segmentId
                    includeSegmentsFromPredicates: $includeSegmentsFromPredicates
                    predicates: $predicates
                    includeDynamicSegment: $includeDynamicSegment
                    pageNumber: $pageNumber
                    condition: $condition
                )
        }
    `
)
