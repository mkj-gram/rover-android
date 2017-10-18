import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlashMessage, graphite, Tooltip } from '@rover/react-bootstrap'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBarAlpha from './TableMenuBarAlpha'

import DateCellFormatter from './DateCellFormatter'
import BooleanCellFormatter from './BooleanCellFormatter'
import ListCellFormatter from './ListCellFormatter'
import StringCellFormatter from './StringCellFormatter'

import { getDeviceSchema } from '../../localSchemas/deviceSchema'
import roverProfileSchema from '../../localSchemas/roverProfileSchema'

import SkeletonTableGrid from './SkeletonTableGrid'
import TestDeviceIconFormatter from './TestDeviceIconFormatter'

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
                },
                listView: false
            },
            dataGridRows: [],
            refetched: false,
            adgDynamicSegment: [],
            pageNumber: 0
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
        this.renderFetch = this.renderFetch.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.renderDataGrid = this.renderDataGrid.bind(this)
        this.shouldCompleteRefresh = this.shouldCompleteRefresh.bind(this)
        this.getCellWidth = this.getCellWidth.bind(this)
        this.getTestDevice = this.getTestDevice.bind(this)
        this.updateDataGridRows = this.updateDataGridRows.bind(this)
        this.onColumnResize = this.onColumnResize.bind(this)
    }

    componentDidMount() {
        if (this.props.data) {
            const { data } = this.props
            const { profileSchema } = data.adgSegmentSchema
            const deviceSchema = getDeviceSchema()

            const {
                dataGridRows,
                segmentSize,
                totalSize
            } = data.adgSegmentsFromPredicates

            this.getSetCachedColumns()
            this.getAllColumns(deviceSchema, profileSchema)
            this.createRowsAndColumns(dataGridRows)
            this.setState({ segmentSize, totalSize, dataGridRows })
        } else {
            this.getSetCachedColumns()

            const columns = this.getSelectedColumns()

            this.setState({ columns })
        }
    }

    getSetCachedColumns() {
        // HardCoded default selected Columns
        const selectedColumns = {
            device_id_DEVICE: {
                __typename: 'StringPredicate',
                label: 'Device ID',
                selector: 'DEVICE'
            },
            os_version_DEVICE: {
                __typename: 'VersionPredicate',
                label: 'OS Version',
                selector: 'DEVICE'
            },
            push_token_key_DEVICE: {
                __typename: 'StringPredicate',
                label: 'Push Token',
                selector: 'DEVICE'
            }
        }

        const cachedSelectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        const hasSelector = (elem, index, array) => {
            return (
                Object.keys(cachedSelectedColumns).length > 0 &&
                Object.keys(cachedSelectedColumns)[0].includes(elem)
            )
        }

        const containsDeprecatedColumns = () => {
            const badSelectors = [
                'radio_DEVICE',
                'is_cellular_enabled_DEVICE',
                'is_wifi_enabled_DEVICE',
                'locale_script_DEVICE',
                'screen_width_DEVICE',
                'screen_height_DEVICE',
                'app_version_DEVICE'
            ]
            const cachedKeys = Object.keys(cachedSelectedColumns)
            return (
                cachedKeys.filter(x => badSelectors.indexOf(x) > 0).length > 0
            )
        }

        if (
            !cachedSelectedColumns ||
            !['_DEVICE', '_CUSTOM_PROFILE', '_ROVER_PROFILE'].some(
                hasSelector
            ) ||
            containsDeprecatedColumns()
        ) {
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
        const customProfiles = {}
        const roverProfiles = {}

        deviceSchema.map(
            device =>
                (devices[device.attribute] = {
                    __typename: device.__typename,
                    label: device.label,
                    group: device.group,
                    selector: 'DEVICE'
                })
        )
        profileSchema.map(
            profile =>
                (customProfiles[profile.attribute] = {
                    __typename: profile.__typename,
                    label: profile.label,
                    selector: 'CUSTOM_PROFILE'
                })
        )
        roverProfileSchema().map(
            profile =>
                (roverProfiles[profile.attribute] = {
                    __typename: profile.__typename,
                    label: profile.label,
                    selector: 'ROVER_PROFILE'
                })
        )

        const profiles = {
            ...customProfiles,
            ...roverProfiles
        }

        this.setState({ allColumns: { devices, profiles } })
    }

    updateChecked(selector, info, item, devices = false) {
        const { allColumns, columns } = this.state

        let cachedSelectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )
        let values
        let compareItem = devices
            ? `${item}_DEVICE`
            : `${item}_${info.selector}`

        if (compareItem in cachedSelectedColumns) {
            delete cachedSelectedColumns[compareItem]
        } else {
            if (devices) {
                values = {
                    __typename: allColumns.devices[item].__typename,
                    label: allColumns.devices[item].label,
                    selector: allColumns.devices[item].selector
                }
            } else {
                values = {
                    __typename: allColumns[selector][item].__typename,
                    label: allColumns[selector][item].label,
                    selector: allColumns[selector][item].selector
                }
            }

            const property = {
                [`${item}_${values.selector}`]: values
            }
            cachedSelectedColumns = Object.assign(
                {},
                cachedSelectedColumns,
                property
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
        const callbackFetch = () => {
            if (this.state.refetched) {
                this.renderFetch(nextProps)
            }
        }

        const { relay } = this.props
        let refetchVariables

        if (
            nextProps.context === 'predicates' &&
            (nextProps.fetchSegmentsFromPred || nextProps.refresh)
        ) {
            const predicates = JSON.parse(nextProps.predicates)
            refetchVariables = fragmentVariables => ({
                includeSegmentsFromPredicates: true,
                includeDynamicSegment: false,
                predicates: JSON.stringify(predicates.query) || '[]',
                segmentId: '',
                pageNumber: Math.floor(nextProps.pageNumber / 3),
                condition: predicates.condition || 'ALL'
            })
            this.setState({ refetched: true })
            relay.refetch(
                refetchVariables,
                null,
                error => {
                    error !== undefined ? console.log(`Error: ${error}`) : callbackFetch()
                },
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
            this.setState({ refetched: true })
            relay.refetch(
                refetchVariables,
                null,
                error => {
                    error !== undefined ? console.log(`Error: ${error}`) : callbackFetch()
                },
                { force: true }
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        const { refetched } = this.state
        if (nextProps.refetchData) {
            if (!refetched) {
                if (nextProps.resetPagination === false) {
                    this.setState({
                        rows: this.getSelectedRows(
                            this.state.dataGridRows,
                            nextProps.pageNumber
                        )
                    })
                } else {
                    this.fetchData(nextProps)
                }
            } else {
                this.renderFetch(nextProps)
            }
        }
    }

    renderFetch(nextProps) {
        let dataSource
        if (
            nextProps.data.adgDynamicSegment &&
            nextProps.data.adgDynamicSegment[0] &&
            nextProps.data.adgDynamicSegment[0].data
        ) {
            dataSource = nextProps.data.adgDynamicSegment[0].data
        } else {
            dataSource = nextProps.data.adgSegmentsFromPredicates
        }
        const { dataGridRows, segmentSize, totalSize } = dataSource

        this.setState(
            {
                rows: this.getSelectedRows(dataGridRows, nextProps.pageNumber),
                segmentSize,
                totalSize,
                dataGridRows,
                refetched: false,
                pageNumber: nextProps.pageNumber
            },
            this.shouldCompleteRefresh(nextProps.refresh)
        )
    }

    shouldCompleteRefresh(refresh) {
        if (refresh) {
            this.props.completeRefresh()
        }
    }

    getSelectedRows(dataGridRows, pageNum = 0) {
        const selectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        const rows = dataGridRows.map(data => {
            const row = {}
            data.forEach(property => {
                const key = `${property.attribute}_${property.selector}`
                if (key in selectedColumns) {
                    row[key] = this.formatRowData(
                        property.value,
                        selectedColumns[key].__typename
                    )
                }
            })
            return row
        })

        const startRow = (pageNum % 3) * 50
        return rows.slice(startRow, startRow + 50)
    }

    handleCellEnter(e, message, listView = false) {
        const target = e.target.getBoundingClientRect()
        this.setState({
            toolTip: {
                isTooltipShowing: !this.state.toolTip.isTooltipShowing,
                message,
                coordinates: {
                    x: target.left - 300,
                    y: target.top - 60 + target.height,
                    divWidth: target.width
                },
                listView
            }
        })
    }

    handleCellLeave(listView = false) {
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
                },
                listView
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
            case 'StringArrayPredicate':
                return (
                    <ListCellFormatter
                        handleCellEnter={this.handleCellEnter}
                        handleCellLeave={this.handleCellLeave}
                    />
                )
            default:
                return <StringCellFormatter />
        }
    }

    getCellWidth(pred, key) {
        const storedItem = JSON.parse(localStorage.getItem('selectedColumns'))[key]
        if (storedItem && storedItem.width) {
            return storedItem.width
        }

        if (pred === 'StringArrayPredicate') {
            return 285
        }

        if (pred === 'BooleanPredicate' && key === 'is_test_device_DEVICE') {
            return 50
        }

        return 200
    }

    getTestDevice() {
        return (
            <TestDeviceIconFormatter
                handleCellEnter={this.handleCellEnter}
                handleCellLeave={this.handleCellLeave}
            />
        )
    }

    getSelectedColumns() {
        const selectedColumns = JSON.parse(localStorage.selectedColumns)

        const columns = Object.keys(selectedColumns).map(attr => ({
            key: attr,
            name: (attr === 'is_test_device_DEVICE') ? this.getTestDevice() : selectedColumns[attr].label,
            width: this.getCellWidth(selectedColumns[attr].__typename, attr),
            draggable: true,
            resizable: (attr === 'is_test_device_DEVICE') ? false : true,
            formatter: this.getFormat(selectedColumns[attr].__typename)
        }))

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
        } else if (type === 'StringArrayPredicate') {
            ret = data.join(', ')
        }
        if (ret === null) {
            ret = ''
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

            columns.forEach(attr => {
                rearrangeColumns[attr.key] = selectedColumns[attr.key]
            })
            localStorage.setItem(
                'selectedColumns',
                JSON.stringify(rearrangeColumns)
            )
        }

        const resizedColumns = columns.map(column => {
            return {
                ...column,
                width: selectedColumns[column.key].width || column.width
            }
        })

        this.setState({ columns: resizedColumns, selectedColumns, rows })
    }

    updateDataGridRows(index, isTestDevice, testDeviceName) {
        const indexrow = this.state.dataGridRows[index].map(property => {
            if (property.attribute === 'is_test_device' && property.selector === 'DEVICE') {
                return {
                    attribute: 'is_test_device',
                    selector: 'DEVICE',
                    value: isTestDevice
                }
            } else if (property.attribute === 'label' && property.selector === 'DEVICE') {
                return {
                    attribute: 'label',
                    selector: 'DEVICE',
                    value: testDeviceName
                }
            }
            return property
        })

        const dataGridRows = [...this.state.dataGridRows].slice(0)
        dataGridRows.splice(index, 1, indexrow)
        this.setState({
            dataGridRows,
            rows: this.getSelectedRows(dataGridRows, this.state.pageNumber)
        })
    }

    onColumnResize(column, width) {
        const { columns } = this.state
        const selectedColumns = JSON.parse(
            localStorage.getItem('selectedColumns')
        )

        const resizedColumn = columns[column].key
        const newSelectedColumns = {
            ...selectedColumns,
            [resizedColumn]: {
                ...selectedColumns[resizedColumn],
                width
            }
        }
        localStorage.setItem(
            'selectedColumns',
            JSON.stringify(newSelectedColumns)
        )
    }

    renderDataGrid() {
        const { skeleton, updatePageNumber, resetPagination } = this.props
        const { selectedColumns, segmentSize, columns, rows, dataGridRows, allColumns } = this.state

        if (skeleton) {
            return <SkeletonTableGrid selectedColumns={selectedColumns} />
        }    

        return (
            <AudienceDataGrid
                segmentSize={segmentSize}
                columns={columns}
                rows={rows}
                updateDragColumns={this.updateDragColumns}
                updatePageNumber={updatePageNumber}
                resetPagination={resetPagination}
                dataGridRows={dataGridRows}
                allColumns={allColumns}
                updateDataGridRows={this.updateDataGridRows}
                onColumnResize={this.onColumnResize}
                handleCellEnter={this.handleCellEnter}
                handleCellLeave={this.handleCellLeave}
            />
        )
    }

    render() {
        const { skeleton } = this.props
        const { columns, refetched, segmentSize, totalSize, selectedColumns } = this.state
        const flashMessageStyle = {
            backgroundColor: '#F4EEFF',
            borderColor: '#DDCBFE',
            color: graphite,
            position: 'fixed',
            top: 5,
            left: '50%',
            transform: 'translateX(-50%)'
        }
        const {
            isTooltipShowing,
            message,
            coordinates,
            listView
        } = this.state.toolTip
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
                    refreshData={this.props.refreshData}
                    skeleton={skeleton}
                />
                {refetched && <FlashMessage messageText="Updating..." style={flashMessageStyle} />}

                {columns.length > 0 && this.renderDataGrid()}
                {isTooltipShowing && (
                    <Tooltip
                        message={message}
                        coordinates={coordinates}
                        listView={listView}
                    />
                )}
            </div>
        )
    }
}

AudienceTable.propTypes = {
    data: PropTypes.object,
    relay: PropTypes.object,
    segmentId: PropTypes.string.isRequired,
    predicates: PropTypes.string.isRequired,

    pageNumber: PropTypes.number.isRequired,
    context: PropTypes.string.isRequired,
    updatePageNumber: PropTypes.func.isRequired,
    refetchData: PropTypes.bool,
    skeleton: PropTypes.bool
}

AudienceTable.defaultProps = {
    segmentId: '',
    predicates: '[]',
    pageNumber: 0,
    context: 'predicates',
    updatePageNumber: () => null
}

export default AudienceTable
