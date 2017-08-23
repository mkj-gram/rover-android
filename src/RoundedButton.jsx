import React from 'react'

import Anchor from './Anchor'

import { cloud, silver, steel } from './styles/colors'

const Button = ({
    primaryColor,
    hoverColor,
    type,
    isDisabled,
    isLoading,
    style,
    children,
    onClick,
    ...rest
}) => {
    let { loadingIndicator: loadingIndicatorStyle, ...anchorStyle } = style

    anchorStyle = {
        ...Button.defaultStyles.anchor,
        ...anchorStyle
    }

    loadingIndicatorStyle = {
        ...Button.defaultStyles.loadingIndicator,
        ...loadingIndicatorStyle
    }

    switch (type) {
        case 'cancel':
            anchorStyle.color = primaryColor
            break
        case 'primary':
            anchorStyle.backgroundColor = primaryColor
            anchorStyle.color = 'white'
            break
        default:
            anchorStyle.backgroundColor = steel
            anchorStyle.color = 'white'
    }

     if (isDisabled) {
        const { disabledTextColor, disabledBackgroundColor, ...rest } = anchorStyle
        anchorStyle = {
            ...rest,
            color: disabledTextColor,
            backgroundColor: disabledBackgroundColor
        }
    }

    const onMouseOver = e => {
        const backgroundColor = type === 'primary'
            ? hoverColor || primaryColor
            : 'rgba(0, 0, 0, 0.0)'
        const textColor = type === 'cancel'
            ? hoverColor || primaryColor
            : 'white'

        e.target.style.backgroundColor = backgroundColor
        e.target.style.color = textColor
    }

    const onMouseOut = e => {
        type === 'primary'
            ? (e.target.style.backgroundColor = primaryColor)
            : (e.target.style.color = primaryColor)
    }

    let loadingIndicator
    if (isLoading) {
        anchorStyle.position = 'relative'
        anchorStyle.color = 'rgba(0, 0, 0, 0.0)'
        loadingIndicator = <div style={loadingIndicatorStyle} />
    }

    return (
        <Anchor
            style={anchorStyle}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            isDisabled={isLoading || isDisabled}
            onClick={onClick}
            {...rest}
        >
            {children}
            {loadingIndicator}
        </Anchor>
    )
}

Button.defaultProps = {
    primaryColor: 'tomato',
    hoverColor: null,
    style: {},
    onClick: () => null
}

Button.defaultStyles = {
    anchor: {
        borderRadius: 4,
        border: 'none',
        display: 'inline-block',
        fontFamily: '"Source Sans Pro", serif',
        fontSize: 14,
        height: 40,
        lineHeight: '40px',
        outline: 'none',
        padding: '0 20px',
        textAlign: 'center',
        disabledBackgroundColor: 'red',
        disabledTextColor: 'blue'
    },
    loadingIndicator: {
        borderRadius: '50%',
        animation: 'spin .6s linear infinite',
        borderTop: '2px solid white',
        borderRight: '2px solid transparent',
        left: '50%',
        height: 16,
        marginTop: -8,
        marginLeft: -8,
        position: 'absolute',
        top: '50%',
        width: 16
    }
}

export default Button
