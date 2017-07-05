import React, { Component } from 'react'

import AudienceDataGrid from './AudienceDataGrid'

import {
    Checkbox
} from '@rover/react-bootstrap'

class AudienceTable extends Component {
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 100%' }}>
                <AudienceDataGrid/>
            </div>
        )
    }
}

export default AudienceTable
