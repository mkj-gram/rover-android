import React from 'react'
import PropTypes from 'prop-types'

const ModalInputPrompt = ({ attributeType, attribute, style }) => (
    <div style={style}>
        {`Include ${attributeType} where ${getAttributeName(
            attribute
        )} is`}
    </div>
)

const getAttributeName = attribute =>
    attribute
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

ModalInputPrompt.propTypes = {
    attribute: PropTypes.string.isRequired,
    attributeType: PropTypes.string.isRequired,
    style: PropTypes.object
}

ModalInputPrompt.defaultProps = {
    style: {}
}

export default ModalInputPrompt
