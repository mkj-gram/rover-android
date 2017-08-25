import React from 'react'
import PropTypes from 'prop-types'

const ModalInputPrompt = ({ attributeType, attribute, style, includeIs }) => (
    <div style={style}>
        {`Include ${attributeType} where ${getAttributeName(
            attribute
        )}`}
        {includeIs ? ' is' : ''}
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
    style: PropTypes.object,
    includeIs: PropTypes.bool
}

ModalInputPrompt.defaultProps = {
    style: {},
    includeIs: true
}

export default ModalInputPrompt
