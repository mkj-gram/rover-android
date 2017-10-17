import React from 'react'
import { purple, semibold } from '@rover/react-bootstrap'

const BooleanCellFormatter = ({ value }) =>
    <div
        style={{
            fontSize: 14,
            minWidth: 80,
            fontWeight: semibold,
            color: purple
        }}
    >
        {value ? 'True' : 'False'}
    </div>
    
export default BooleanCellFormatter
