/* eslint react/prop-types: 0 */
import React from 'react'

export default ({ value, column }) => {
    let displayValue = value
    // Display undefined lat/long as empty string instead of "0"
    if (
        (column.name === 'Latitude' || column.name === 'Longitude') &&
        value === 0
    ) {
        displayValue = ''
    }
    return (
        <div
            style={{
                width: column.width - 20,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {displayValue}
        </div>
    )
}
