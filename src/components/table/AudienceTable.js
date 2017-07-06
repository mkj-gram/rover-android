import React, { Component } from 'react'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBar from './TableMenuBar'

import { Checkbox } from '@rover/react-bootstrap'

class AudienceTable extends Component {
	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: '1 1 100%'
				}}
			>
				<TableMenuBar />
				<AudienceDataGrid />
			</div>
		)
	}
}

export default AudienceTable
