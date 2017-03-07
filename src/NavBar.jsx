import React from 'react';

const NavBar = ({ style, children, ...rest }) => {

    let { left: leftStyle, center: centerStyle, right: rightStyle, ...containerStyle } = style

    containerStyle = {
        ...NavBar.defaultStyles.container,
        ...containerStyle
    }

    leftStyle = {
        ...NavBar.defaultStyles.left,
        ...leftStyle
    }

    centerStyle = {
        ...NavBar.defaultStyles.center,
        ...centerStyle
    }

    rightStyle = {
        ...NavBar.defaultStyles.right,
        ...rightStyle
    }

    if (!children) {
        children = []
    }

    return (
        <div style={containerStyle} {...rest}>
            <div style={leftStyle}>{children[0]}</div>
            <div style={centerStyle}>{children[1]}</div>
            <div style={rightStyle}>{children[2]}</div>
        </div>
    )
}

NavBar.defaultProps = {
    style: {}
}

NavBar.defaultStyles = {
    container: {
        alignItems: 'center',
        background: '#EEEEEE',
        display: 'flex',
        flex: 'none',
        height: 60
    },
    left: {
        flex: '1 0 0',
        paddingRight: 20,
        paddingLeft: 40
    },
    center: { 
        flex: 'none' 
    },
    right: {
        alignItems: 'center',
        display: 'flex',
        flex: '1 0 0',
        justifyContent: 'flex-end',
        paddingRight: 40,
        paddingLeft:  20
    }
}

export default NavBar
