import React, { Component } from 'react'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBar from './TableMenuBar'

class AudienceTable extends Component {
	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: '1 1 100%',
					position: 'relative'
				}}
			>
				<TableMenuBar />
				<AudienceDataGrid />
				
			</div>
		)
	}
}

export default AudienceTable
