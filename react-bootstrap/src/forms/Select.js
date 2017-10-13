import React from 'react'
import PropTypes from 'prop-types'

import { graphite, titanium } from '../styles/colors'
import { semibold, text } from '../styles/typography'

const Select = ({ isDisabled, style, children, ...rest }) => {
    style = {
        backgroundColor: 'transparent',
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSI2cHgiIHZpZXdCb3g9IjEgNCAxMSA2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPiA8cG9seWdvbiBzdHJva2U9Im5vbmUiIGZpbGw9IiNCQ0JDQkMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSIxMSA0IDEgNCA2IDkgMTEgNCAxMSA0IDExIDQiPjwvcG9seWdvbj48L3N2Zz4=")',
        backgroundPosition: 'right 2px center',
        backgroundRepeat: 'no-repeat',
        borderColor: titanium,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 1px 0',
        color: graphite,
        display: 'block',
        fontFamily: '"Source Sans Pro", serif',
        fontSize: 16,
        fontWeight: 400,
        outline: 'none',
        padding: '3px 24px 3px 0',
        width: '100%',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        ...style
    }

    if (isDisabled) {
        style.opacity = 0.5
    }
    
    const focusedBorderColor = style.focusedBorderColor || style.borderColor
    
    const onFocus = e => e.target.style.borderColor = focusedBorderColor
    const onBlur = e => e.target.style.borderColor = style.borderColor

    return (
        <select onFocus={onFocus} onBlur={onBlur} disabled={isDisabled} style={style} {...rest}>{children}</select>
    )
}

Select.propTypes = {
    style: PropTypes.object
}

Select.defaultProps = {
    
}

export default Select
