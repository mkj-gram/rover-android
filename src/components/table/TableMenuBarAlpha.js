import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    cloud,
    purple,
    semibold,
    silver,
    text,
    graphite
} from '@rover/react-bootstrap'
import { DonutChart } from '@rover/react-icons'

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

const tableMenuBarRight = {
    flex: '0 0',
    display: 'flex',
    alignItems: 'center',
    marginRight: '50px',
    width: 290
}

class TableMenuBarAlpha extends Component {
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
        this.numberWithCommas = this.numberWithCommas.bind(this)
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
                x: left - 230,
                y: top + 40
            }
        })
    }

    showChecked(item, info) {    
        const { selectedColumns } = this.props
        if (!info.hasOwnProperty('selector')) {
            return (`${item}_DEVICE` in selectedColumns)
        } else if (['CUSTOM_PROFILE','ROVER_PROFILE'].includes(info.selector)) {
            return (`${item}_${info.selector}` in selectedColumns)
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                            amountFilled={segmentSize / totalSize * 80}
                            amountEmpty={
                                (totalSize - segmentSize) / totalSize * 80
                            }
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
                            {this.numberWithCommas(segmentSize)}
                        </div>
                        <div style={{ ...text, fontSize: 13, color: silver }}>
                            of {this.numberWithCommas(totalSize)} total devices
                        </div>
                    </div>
                </div>

                <div style={tableMenuBarRight}>
                    <div
                        style={{ height: '100%' }}
                        onClick={e => this.triggerColumnsMenu(e)}
                        id="columnsIcon"
                    >
                        <TableMenuBarIcon
                            val="columns"
                            showToolTip={!showColumnsMenu}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

TableMenuBarAlpha.propTypes = {
    updateChecked: PropTypes.func.isRequired,
    allColumns: PropTypes.object.isRequired,
    segmentSize: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
    selectedColumns: PropTypes.object.isRequired
}

TableMenuBarAlpha.defaultProps = {
    updateChecked: () => null,
    allColumns: {},
    segmentSize: 0,
    totalSize: 0
}

export default TableMenuBarAlpha
