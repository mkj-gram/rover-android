import React, { PropTypes } from 'react'

import { silver } from '../../styles/colors'
import { semibold, text } from '../../styles/typography'

const RadioButton = ({ label, disabled, isChecked, primaryColor, style, checkedStyle, labelStyle, ...rest }) => {
    style = {
        backgroundColor: 'white',
        borderColor: silver,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        fontSize: 16,
        height: 16,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 4,
        marginTop: 0,
        outline: 'none',
        textAlign: 'center',
        width: 16,
        MozAppearance: 'none',
        WebkitAppearance: 'none',
        ...style
    }

    labelStyle = {
        ...text,
        alignItems: 'center',
        display: 'flex',
        height: 16,
        lineHeight: '16px',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        ...labelStyle
    }

    const markStyle = {
        backgroundColor: disabled ? silver : primaryColor,
        borderRadius: 4,
        display: isChecked ? 'block' : 'none',
        height: 8,
        left: 4,
        position: 'absolute',
        top: 4,
        width: 8
    }

    return (
        <label style={labelStyle}>
            <input type="radio" disabled={disabled} checked={isChecked} style={style} {...rest}/> {label}
            <div style={markStyle}/>
        </label>
    )
}

RadioButton.propTypes = {
    isChecked: PropTypes.bool,
    primaryColor: PropTypes.string,
    style: PropTypes.object,
    checkedStyle: PropTypes.object,
    labelStyle: PropTypes.object
}

RadioButton.defaultProps = {
    primaryColor: 'tomato',
    isChecked: false
}

export default RadioButton
