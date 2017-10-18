import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Checkbox,
    cloud,
    purple,
    offwhite,
    steel,
    straw
} from '@rover/react-bootstrap'

import ReactDataGrid from 'react-data-grid'

import { DraggableHeader } from 'react-data-grid-addons'
import CustomRowRenderer from './CustomRowRenderer'
import GridPagination from './GridPagination'
import DeviceDetailsModal from './DeviceDetailsModal'

const { DraggableContainer } = DraggableHeader

class AudienceDataGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: [],
            isShiftKeyPressed: false,
            isCommandKeyPressed: false,
            isModalShowing: false
        }

        this.onRowsSelected = this.onRowsSelected.bind(this)
        this.onRowsDeselected = this.onRowsDeselected.bind(this)
        this.rowGetter = this.rowGetter.bind(this)
        this.onDeviceDetailsModalClose = this.onDeviceDetailsModalClose.bind(this)
    }

    rowGetter(i) {
        return this.props.rows[i]
    }

    renderCheckbox(props) {
        const { column, dependentValues, rowIdx } = props
        const { onCellChange, key } = column
        return (
            <Checkbox
                isChecked={props.value}
                label=""
                primaryColor={purple}
                isDisabled={false}
                onChange={e => onCellChange(rowIdx, key, dependentValues, e)}
                style={{
                    height: 16,
                    width: 16
                }}
                labelStyle={{
                    height: 16,
                    left: 16
                }}
            />
        )
    }

    onHeaderDrop(source, target) {
        const stateCopy = Object.assign({}, this.props)
        const columnSourceIndex = this.props.columns.findIndex(
            i => i.key === source
        )
        const columnTargetIndex = this.props.columns.findIndex(
            i => i.key === target
        )

        stateCopy.columns.splice(
            columnTargetIndex,
            0,
            stateCopy.columns.splice(columnSourceIndex, 1)[0]
        )

        const emptyColumns = Object.assign({}, this.props, { columns: [] })
        this.props.updateDragColumns(emptyColumns)

        const reorderedColumns = Object.assign({}, this.props, {
            columns: stateCopy.columns
        })
        this.props.updateDragColumns(reorderedColumns)
    }

    onRowsSelected(rows) {
        this.setState({
            selectedIndex: rows.map(r => r.rowIdx) })
    }

    onRowsDeselected(rows) {
        const rowIndexes = rows.map(r => r.rowIdx)
        this.setState({
            selectedIndex: this.state.selectedIndex.filter(
                i => rowIndexes.indexOf(i) === -1
            )
        })
    }

    onRowClick(rowIdx) {
        this.setState({ selectedIndex: [rowIdx], isModalShowing: (rowIdx >= 0) })
    }

    getGridHeight() {
        return window.innerHeight - 130
    }

    onDeviceDetailsModalClose() {
        this.setState({
            isModalShowing: false,
            selectedIndex: []
        })
    }

    render() {
        const { onColumnResize } = this.props
        return (
            <div
                ref={(el) => {
                    this.parent = el
                }}
                style={{ flex: '1 1 100%', position: 'relative' }}
                className="rover-data-grid"
                id="audienceDataGrid"
            >
                <style type="text/css">
                    {`
                            .rover-data-grid .react-grid-Container {
                                margin-left: 1px;
                            }
                            .rover-data-grid .react-grid-HeaderRow {
                                border-bottom: 1px solid ${cloud};
                            }
                            .rover-data-grid .react-grid-HeaderCell {
                                background-color: ${offwhite};
                                color: ${steel}!important;
                                font-family: "Source Sans Pro", sans-serif!important;
                                font-size: 14px!important;
                                font-weight: 600;
                                padding-left: 20px;
                                padding-top: 20px;
                                border-right: 1px solid ${cloud};
                                border-bottom: 1px solid ${cloud};
                                cursor: default;
                            }
                            .rover-data-grid .react-grid-HeaderCell:hover {
                                background-color: ${straw};
                            }
                            .rover-data-grid .react-grid-Cell {
                                border-bottom: 1px solid ${cloud};
                                border-right: 1px solid ${cloud};
                                padding-left: 20px;
                            }

                            .react-grid-Cell__value {
                                display: inline-block;
                            }
                            
                            .rover-data-grid .react-grid-Cell:focus {
                                outline: none;
                            }
                            
                            .rover-data-grid .rdg-row-actions-cell.react-grid-Cell {
                                border-right: none!important;
                            }
                            .rover-data-grid .row-selected {
                                background-color: ${straw}!important;
                            }

                            .rover-data-grid .react-grid-Main {
                                height: 100%;
                            }

                            .rover-data-grid .react-grid-Container {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                overflow-x: scroll;
                            }

                            .rover-data-grid .react-grid-Grid {
                                min-height: 100% !important;
                                border: none !important;
                            }

                            .rover-data-grid .react-grid-Canvas {
                                height: 100% !important;
                            }
                    `}
                </style>
                <DraggableContainer
                    onHeaderDrop={(source, target) =>
                        this.onHeaderDrop(source, target)}
                >
                    <ReactDataGrid
                        rowKey="id"
                        columns={this.props.columns}
                        rowGetter={this.rowGetter}
                        rowsCount={this.props.rows.length}
                        rowHeight={50}
                        minHeight={this.getGridHeight()}
                        rowSelection={{
                            showCheckbox: false,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                                indexes: this.state.selectedIndex
                            }
                        }}
                        rowRenderer={CustomRowRenderer}
                        onRowClick={rowIdx => this.onRowClick(rowIdx)}
                        onColumnResize={onColumnResize}
                    />
                </DraggableContainer>
                <GridPagination
                    totalRows={this.props.segmentSize}
                    updatePageNumber={this.props.updatePageNumber}
                    resetPagination={this.props.resetPagination}
                />
                <DeviceDetailsModal
                    dataGridRows={this.props.dataGridRows}
                    isOpen={this.state.isModalShowing}
                    onRequestClose={this.onDeviceDetailsModalClose}
                    index={this.state.selectedIndex[0]}
                    allColumns={this.props.allColumns}
                    updateDataGridRows={this.props.updateDataGridRows}
                    handleCellEnter={this.props.handleCellEnter}
                    handleCellLeave={this.props.handleCellLeave}
                />
            </div>
        )
    }
}

AudienceDataGrid.propTypes = {
    columns: PropTypes.array.isRequired,
    onColumnResize: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    segmentSize: PropTypes.number.isRequired,
    updateDragColumns: PropTypes.func.isRequired,
    updatePageNumber: PropTypes.func.isRequired
}

export default AudienceDataGrid
