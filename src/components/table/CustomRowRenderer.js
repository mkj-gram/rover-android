import React from 'react'
import { Row } from 'react-data-grid'
import { cloud, text } from '@rover/react-bootstrap'

const CustomRowRenderer = (props) =>
    <div style={{ height: 50, ...text, border: `1px solid ${cloud}` }}>
        <Row {...props}/>
    </div>

export default CustomRowRenderer
