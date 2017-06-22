import React from 'react'

export default ({ attributeType, attribute }) =>
    <div>
        {`Include ${attributeType} where ${getAttributeName(
            attribute
        )} is`}
    </div>

const getAttributeName = attribute =>
    attribute
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
