import React from 'react'
import PropTypes from 'prop-types'
import { silver, steel, titanium } from '@rover/react-bootstrap'

const ModalInput = (props) => {
    const { style } = props
    const inputStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '1px solid',
        borderColor: steel,
        textDecoration: 'none',
        outline: 'none',
        color: titanium,
        fontFamily: 'Source Sans Pro',
        fontSize: 16,
        width: 40,
        margin: '0 5px',
        textAlign: 'right',
        paddingBottom: 3,
        paddingLeft: 5,
        display: 'initial',
        ...style
    }
    const onFocus = e => (e.target.style.borderColor = silver)
    const onBlur = e => (e.target.style.borderColor = steel)

    return (
        <input
            {...props}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}

ModalInput.propTypes = {
    style: PropTypes.object
}

ModalInput.defaultProps = {
    style: {}
}

export default ModalInput
