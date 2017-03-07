import React, { PropTypes } from 'react'

import { silver } from '../../styles/colors'
import { semibold, text } from '../../styles/typography'

const Checkbox = ({ isChecked, isDisabled, label, primaryColor, style, checkedStyle, labelStyle, ...rest }) => {
    style = {
        backgroundColor: 'white',
        borderColor: silver,
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 2,
        fontSize: 16,
        height: 14,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 4,
        marginTop: 0,
        outline: 'none',
        textAlign: 'center',
        width: 14,
        MozAppearance: 'none',
        WebkitAppearance: 'none',
        ...style
    }

    if (isChecked) {
        style = {
            ...style,
            backgroundColor: primaryColor,
            borderWidth: 0,
            ...checkedStyle
        }
    }

    labelStyle = {
        ...text,
        ...semibold,
        alignItems: 'center',
        display: 'flex',
        fontSize: 11,
        height: 14,
        lineHeight: '14px',
        opacity: isDisabled ? 0.5 : 1,
        position: 'relative',
        ...labelStyle
    }

    const markStyle = {
        color: 'white',
        fontSize: 11,
        left: 4,
        lineHeight: '14px',
        position: 'absolute',
        top: 0

    }

    return (
        <label style={labelStyle}>
            <input type="checkbox" checked={isChecked} style={style} disabled={isDisabled} {...rest}/> {label}
            <div style={markStyle}>✓</div>
        </label>
    )
}

Checkbox.propTypes = {
    isChecked: PropTypes.bool,
    primaryColor: PropTypes.string,
    style: PropTypes.object,
    checkedStyle: PropTypes.object,
    labelStyle: PropTypes.object
}

Checkbox.defaultProps = {
    primaryColor: 'tomato',
    isChecked: false
}

export default Checkbox
