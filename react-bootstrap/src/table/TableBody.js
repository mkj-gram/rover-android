import React from 'react'

import { scrollContainer } from '../styles/layout'

const TableBody = ({ style, children }) => {
    
    const containerStyle = { 
        ...TableBody.defaultStyles.container, 
        ...style 
    }

    return <div className="TableBody" style={containerStyle}>{children}</div>
}

TableBody.defaultStyles = {
    container: {
        ...scrollContainer,
        position: 'relative'
    }
}

TableBody.defaultProps = {
    style: {}
}

export default TableBody
