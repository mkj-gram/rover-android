import React from 'react'

const ListCellFormatter = ({ value }) =>
    <div
        style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: 240
        }}
    >
        {value}
    </div>

export default ListCellFormatter
