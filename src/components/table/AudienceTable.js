import React from 'react'

import AudienceDataGrid from './AudienceDataGrid'
import TableMenuBar from './TableMenuBar'

const AudienceTable = () =>
    (<div
        style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 100%',
            position: 'relative'
        }}
    >
        <TableMenuBar />
        <AudienceDataGrid />
    </div>)

export default AudienceTable
