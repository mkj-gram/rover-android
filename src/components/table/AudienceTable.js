// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SortablePane, Pane } from 'react-sortable-pane'

import {
    offwhite,
    cloud,
    mercury,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    EmptyTableCell
} from '@rover/react-bootstrap'

import TableMenuBar from './TableMenuBar'

class AudienceTable extends Component {
    state = {
        columnOrder: []
    }

    constructor(props: any) {
        super(props)
    }

    renderColumns() {
        const columns = [
            {
                style: { width: 100 },
                text: 'A',
                id: 'A'
            },
            {
                style: { width: 100 },
                text: 'B',
                id: 'B'
            },
            {
                style: { width: 100 },
                text: 'C',
                id: 'C'
            },
            {
                style: { width: 100 },
                text: 'D',
                id: 'D'
            },
            {
                style: { width: 100 },
                text: 'E',
                id: 'E'
            },
            {
                style: { width: 100 },
                text: 'F',
                id: 'F'
            },
            {
                style: { width: 100 },
                text: 'G',
                id: 'G'
            },
            {
                style: { width: 100 },
                text: 'H',
                id: 'H'
            },
            {
                style: { width: 100 },
                text: 'I',
                id: 'I'
            },
            {
                style: { width: 100 },
                text: 'J',
                id: 'J'
            },
            {
                style: { width: 100 },
                text: 'K',
                id: 'K'
            }
        ]
        return columns.map(({ id, style, text }, index) => (
            <Pane
                width={style.width}
                height={62}
                isResizable={{ x: true, y: false, xy: false }}
                style={style}
                key={index}
                id={id}
            >
                <TableCell style={{ width: '100%', border: `1px solid ${cloud}`, borderLeft: 'none' }}>{text}</TableCell>
            </Pane>
        ))
    }

    renderRows() {
        const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        return rows.map((row, index) => (
            <TableRow key={index}>{this.renderCells()}</TableRow>
        ))
    }

    renderCells() {
        const columns = [
            {
                style: { width: 100 },
                text: 'A',
                id: 'A'
            },
            {
                style: { width: 100 },
                text: 'B',
                id: 'B'
            },
            {
                style: { width: 100 },
                text: 'C',
                id: 'C'
            },
            {
                style: { width: 100 },
                text: 'D',
                id: 'D'
            },
            {
                style: { width: 100 },
                text: 'E',
                id: 'E'
            },
            {
                style: { width: 100 },
                text: 'F',
                id: 'F'
            },
            {
                style: { width: 100 },
                text: 'G',
                id: 'G'
            },
            {
                style: { width: 100 },
                text: 'H',
                id: 'H'
            },
            {
                style: { width: 100 },
                text: 'I',
                id: 'I'
            },
            {
                style: { width: 100 },
                text: 'J',
                id: 'J'
            },
            {
                style: { width: 100 },
                text: 'K',
                id: 'K'
            }
        ]
        const { columnOrder } = this.state

        return columnOrder.map(({ id, width }) => {
            return <TableCell key={id} style={{ width: width }}>{id}</TableCell>
        })
    }

    render() {
        return (
            <div>
                <Table isLoading={true} style={{ height: 500 }}>
                        <TableHead style={{ backgroundColor: mercury }}/>
                        <TableRow style={{ backgroundColor: offwhite }}>
                            <SortablePane
                                direction="horizontal"
                                margin={0}
                                onResize={(id, dir, size, rect) => null}
                                onOrderChange={(oldPanes, newPanes) =>
                                    this.setState({ columnOrder: newPanes })}
                                disableEffect
                            >
                                {this.renderColumns()}
                            </SortablePane>
                        </TableRow>
                    <TableBody style={{ height: 500 }}>
                        {this.renderRows()}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default AudienceTable
