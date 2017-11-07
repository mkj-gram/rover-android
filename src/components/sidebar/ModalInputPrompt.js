import React from 'react'
import PropTypes from 'prop-types'

const ModalInputPrompt = ({
    selector,
    style,
    includeIs,
    label,
    includeHas
}) => (
    <div style={style}>
        {`Include ${getSelector(selector)} where ${getLabel(label)}`}
        {includeIs ? ' is' : ''}
        {includeHas ? ' has' : ''}
    </div>
)
const getLabel = label => label.replace('?', '')
const getSelector = selector => selector === 'DEVICE' ? 'devices' : 'profiles'

ModalInputPrompt.propTypes = {
    selector: PropTypes.string.isRequired,
    style: PropTypes.object,
    includeIs: PropTypes.bool,
    label: PropTypes.string.isRequired
}

ModalInputPrompt.defaultProps = {
    style: {},
    includeIs: true
}

export default ModalInputPrompt
