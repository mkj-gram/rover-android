import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TableMenuBarIcon from './TableMenuBarIcon'

import {
	cloud,
	mercury,
	purple,
	RoundedButton,
	semibold,
	silver,
	text,
	TextField,
	titanium,
	graphite
} from '@rover/react-bootstrap'

import { SearchIcon, DonutChart } from '@rover/react-icons'

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
			searchVal: ''
		}
		this.handleSearch = this.handleSearch.bind(this)
	}

	handleSearch(e) {
		this.setState({ searchVal: e.target.value })
	}

	render() {
		return (
			<div style={tableMenuBarStyle}>
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
							45,251
						</div>
						<div style={{ ...text, fontSize: 13, color: silver }}>
							of 77,231 total devices
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
					<div style={{ marginRight: '11px' }}>
						<TableMenuBarIcon val="columns" />
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
								color: mercury,
								fontSize: 14,
								focus: { borderColor: titanium },
								color: silver
							}}
							onChange={this.handleSearch}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default TableMenuBar
