import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid'
import { DraggableHeader } from 'react-data-grid-addons'
const { DraggableContainer } = DraggableHeader

import {
    Checkbox,
    cloud,
    purple,
    offwhite,
    steel,
    straw
} from '@rover/react-bootstrap'

import BooleanCellFormatter from './BooleanCellFormatter'
import CustomRowRenderer from './CustomRowRenderer'
import DateCellFormatter from './DateCellFormatter'
import EmptyCellFormatter from './EmptyCellFormatter'
import ListCellFormatter from './ListCellFormatter'

class AudienceDataGrid extends Component {
    constructor(props) {
        super(props)

        this.state = {
            columns: [
                {
                    key: 'city',
                    name: 'City',
                    width: 200,
                    draggable: true,
                    resizable: true
                },
                {
                    key: 'region',
                    name: 'Region',
                    width: 200,
                    draggable: true,
                    resizable: true
                },
                {
                    key: 'last_seen',
                    name: 'Last Seen',
                    width: 200,
                    draggable: true,
                    resizable: true,
                    formatter: DateCellFormatter
                },
                {
                    key: 'tags',
                    name: 'Tags',
                    width: 280,
                    draggable: true,
                    resizable: true,
                    formatter: ListCellFormatter
                },
                {
                    key: 'location_permissions',
                    name: 'Location Permissions',
                    draggable: true,
                    resizable: true,
                    formatter: BooleanCellFormatter,
                    width: 200
                }
            ],
            rows: this.createRows(),
            selectedIndexes: []
        }
        
        this.onRowsSelected = this.onRowsSelected.bind(this)
        this.onRowsDeselected = this.onRowsDeselected.bind(this)
    }

    createRows() {
        let rows = []
        for (let i = 1; i < 51; i++) {
            rows.push({
                city: `Toronto ${i}`,
                region: 'Ontario',
                last_seen: new Date(),
                tags: ['Fishing', 'hunting', 'email subscriber', 'new customer'].join(", "),
                location_permissions: 'false'
            })
        }

        return rows
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
        const stateCopy = Object.assign({}, this.state)
        const columnSourceIndex = this.state.columns.findIndex(
            i => i.key === source
        )
        const columnTargetIndex = this.state.columns.findIndex(
            i => i.key === target
        )

        stateCopy.columns.splice(
            columnTargetIndex,
            0,
            stateCopy.columns.splice(columnSourceIndex, 1)[0]
        )

        const emptyColumns = Object.assign({}, this.state, { columns: [] })
        this.setState(emptyColumns)

        const reorderedColumns = Object.assign({}, this.state, {
            columns: stateCopy.columns
        })
        this.setState(reorderedColumns)
    }
    
    onRowsSelected(rows) { 
        this.setState({ selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))})
    }
    
    onRowsDeselected(rows) {
        let rowIndexes = rows.map(r => r.rowIdx)
        this.setState({ selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )})
    }

    render() {
        return (
            <div style={{ flex: '1 1 100%', position: 'relative' }} className="rover-data-grid">
                <style type="text/css">
                    {
                        `
                            .rover-data-grid .react-grid-Container {
                                margin-left: 1px;
                            }
                            .rover-data-grid .react-grid-HeaderRow {
                                border-bottom: 1px solid ${cloud};
                            }
                            .rover-data-grid .react-grid-HeaderCell {
                                background-color: ${offwhite};
                                color: ${steel}!important;
                                cursor: -webkit-grab!important;
                                font-family: "Source Sans Pro", sans-serif!important;
                                font-size: 14px!important;
                                font-weight: 600;
                                padding-left: 20px;
                                padding-top: 20px;
                                border-right: 1px solid ${cloud};
                                border-bottom: 1px solid ${cloud};
                            }
                            .rover-data-grid .react-grid-HeaderCell:hover {
                                background-color: ${straw};
                            }
                            .rover-data-grid .react-grid-Cell {
                                border-bottom: 1px solid ${cloud};
                                border-right: 1px solid ${cloud};
                                padding-left: 20px;
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
                            }

                            .rover-data-grid .react-grid-Canvas {
                                height: 100% !important;
                            }
                    `
                    }
                </style>
                <DraggableContainer
                    onHeaderDrop={(source, target) =>
                        this.onHeaderDrop(source, target)}
                >
                    <ReactDataGrid
                        rowKey="id"
                        columns={this.state.columns}
                        rowGetter={i => this.state.rows[i]}
                        rowsCount={this.state.rows.length}
                        rowHeight={50}
                        rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                                indexes: this.state.selectedIndexes
                            }
                        }}
                        rowRenderer={CustomRowRenderer}
                        rowActionsCell={this.renderCheckbox}
                    />
                </DraggableContainer>
            </div>
        )
    }
}

export default AudienceDataGrid
