import React from 'react'

const BooleanCellFormatter = ({ value }) =>
    <div
        style={{
            fontSize: 14,
            minWidth: 80,
            textAlign: 'center'
        }}
    >
        {value}
    </div>
    
export default BooleanCellFormatter
