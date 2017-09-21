import React from 'react'

const StringCellFormatter = ({ value, column }) => (
    <div
        style={{
            width: column.width - 20,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }}
    >
        {value}
    </div>
)

export default StringCellFormatter
