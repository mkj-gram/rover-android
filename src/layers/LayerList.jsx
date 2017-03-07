import React from 'react'

import { text } from '../styles/typography'

const LayerList = ({ style, children, ...rest }) => {

    style = {
        borderRadius: 5,
        background: 'white',
        ...style
    }

    const titleStyle = {
        ...text,
        fontSize: 16,
        height: 56,
        lineHeight: '56px',
        paddingLeft: 18
    }

    return (
        <div style={style} {...rest}>
            <div style={titleStyle}>Layers</div>
            {children}
        </div>
    )
}

export default LayerList
