import React, { cloneElement } from 'react'

const TableHead = ({ style, children }) => {
    
    const containerStyle = { 
        ...TableHead.defaultStyles.container, 
        ...style 
    }

    children = React.Children.map(children, element => {
        return cloneElement(element, {
            isHead: true
        })
    })

    return <div className="TableHead" style={containerStyle}>{children}</div>
}

TableHead.defaultStyles = {
    container: {
        flex: 'none',
        height: 65
    }
}

TableHead.defaultProps = {
    style: {}
}

export default TableHead
