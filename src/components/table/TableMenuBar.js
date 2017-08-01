import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    cloud,
    purple,
    RoundedButton,
    semibold,
    silver,
    text,
    TextField,
    titanium,
    graphite,
    ash
} from '@rover/react-bootstrap'
import { SearchIcon, DonutChart } from '@rover/react-icons'

import TableMenuBarIcon from './TableMenuBarIcon'
import ColumnDisplayContainer from './ColumnDisplayContainer'

const tableMenuBarStyle = {
    flex: '0 0 auto',
    height: 70,
    width: '100%',
    backgroundColor: cloud,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 43,
    justifyContent: 'space-between'
}

const tableMenuBarLeft = {
    flex: '1 1',
    display: 'flex',
    alignItems: 'center',
    height: '100%'
}

const tableMenuDonutIconStyle = {
    flex: '0 0',
    marginRight: 11
}

const tableMenuNumberRatio = {
    marginRight: '20px'
}

const tableMenuMiddle = {
    flex: '1 0',
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center'
}

const tableMenuBarRight = {
    flex: '0 0',
    display: 'flex',
    alignItems: 'center',
    marginRight: '50px',
    width: 290
}

class TableMenuBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchVal: '',
            showColumnsMenu: false,
            pageClickLocation: {
                x: 0,
                y: 0
            }
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.triggerColumnsMenu = this.triggerColumnsMenu.bind(this)
        this.showChecked = this.showChecked.bind(this)
    }

    handleSearch(e) {
        this.setState({ searchVal: e.target.value })
    }

    triggerColumnsMenu() {
        const { top, left } = document
            .getElementById('columnsIcon')
            .getBoundingClientRect()

        this.setState({
            showColumnsMenu: !this.state.showColumnsMenu,
            pageClickLocation: {
                x: left - 10,
                y: top + 40
            }
        })
    }

    showChecked(category, item) {
        const selectedColumns = JSON.parse(localStorage.getItem('selectedColumns'))
        return (item in selectedColumns)
    }

    render() {
        const { showColumnsMenu, pageClickLocation } = this.state
        const { updateChecked, allColumns, segmentSize, totalSize } = this.props

        return (
            <div style={tableMenuBarStyle}>
                <ColumnDisplayContainer
                    showColumnsMenu={showColumnsMenu}
                    updateChecked={updateChecked}
                    showChecked={this.showChecked}
                    triggerColumnsMenu={this.triggerColumnsMenu}
                    pageClickLocation={pageClickLocation}
                    allColumns={allColumns}
                />

                <div style={tableMenuBarLeft}>
                    <div style={tableMenuDonutIconStyle}>
                        <DonutChart
                            amountFilled={60}
                            amountEmpty={20}
                            primaryColor={silver}
                            accentColor={purple}
                        />
                    </div>

                    <div style={tableMenuNumberRatio}>
                        <div
                            style={{
                                ...semibold,
                                ...text,
                                fontSize: 20,
                                lineHeight: 1.2,
                                color: graphite
                            }}
                        >
                            {segmentSize}
                        </div>
                        <div style={{ ...text, fontSize: 13, color: silver }}>
                            of {totalSize} total devices
                        </div>
                    </div>

                    <div style={tableMenuMiddle}>
                        <TableMenuBarIcon val="tag" />
                        <div
                            style={{ position: 'relative', paddingLeft: '2px' }}
                        />
                        <TableMenuBarIcon val="download" />
                        <div style={{ ...text, color: purple }}>
                            <RoundedButton
                                type="cancel"
                                primaryColor={purple}
                                style={{ cursor: 'pointer', fontSize: 13 }}
                            >
                                Select All
                            </RoundedButton>
                        </div>
                    </div>
                </div>

                <div style={tableMenuBarRight}>
                    <div
                        style={{ marginRight: '11px', height: '100%' }}
                        onClick={e => this.triggerColumnsMenu(e)}
                        id="columnsIcon"
                    >
                        <TableMenuBarIcon val="columns" showToolTip={!showColumnsMenu} />
                    </div>
                    <div style={{ marginRight: '5px' }}>
                        <SearchIcon fill={silver} />
                    </div>
                    <div>
                        <TextField
                            placeholder="Search for a City, Region, Device..."
                            value={this.state.searchVal}
                            style={{
                                width: '225px',
                                fontSize: 14,
                                focus: { borderColor: titanium },
                                color: ash
                            }}
                            onChange={this.handleSearch}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

TableMenuBar.propTypes = {
    updateChecked: PropTypes.func.isRequired,
    allColumns: PropTypes.object.isRequired,
    segmentSize: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired
}

TableMenuBar.defaultProps = {
    updateChecked: () => null,
    allColumns: {},
    segmentSize: 0,
    totalSize: 0
}

export default TableMenuBar
