import React from 'react'
import PropTypes from 'prop-types'

const ModalInputPrompt = ({ attributeType, style, includeIs, label }) => (
    <div style={style}>
        {`Include ${attributeType} where ${label}`}
        {includeIs ? ' is' : ''}
    </div>
)

ModalInputPrompt.propTypes = {
    attributeType: PropTypes.string.isRequired,
    style: PropTypes.object,
    includeIs: PropTypes.bool,
    label: PropTypes.string.isRequired
}

ModalInputPrompt.defaultProps = {
    style: {},
    includeIs: true
}

export default ModalInputPrompt
