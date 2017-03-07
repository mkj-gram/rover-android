import React from 'react'

import { text, truncate } from '../../styles/typography'

const TableCell = ({ isFirst, isLast, isHead, style, children }) => {
    
    let { first: firstStyle, last: lastStyle, head: headStyle, ...containerStyle } = style

    containerStyle = { 
        ...TableCell.defaultStyles.container, 
        ...containerStyle
    }

    firstStyle = { 
        ...TableCell.defaultStyles.first, 
        ...firstStyle
    }

    lastStyle = { 
        ...TableCell.defaultStyles.last, 
        ...lastStyle
    }

    headStyle = {
        ...TableCell.defaultStyles.head,
        ...headStyle
    }
    
    if (isFirst) {
        containerStyle = {
            ...containerStyle,
            ...firstStyle
        }
    }

    if (isLast) {
        containerStyle = {
            ...containerStyle,
            ...lastStyle
        }
    }

    if (isHead) {
        containerStyle = {
            ...containerStyle,
            ...headStyle
        }
    }

    return <div className="TableCell" style={containerStyle}>{children}</div>
}

TableCell.defaultStyles = {
    container: {
        ...text,
        ...truncate,
        lineHeight: '60px',
        padding: '0 10px'
    },
    first: {
        paddingLeft: 60
    },
    last: {
        paddingRight: 60
    },
    head: {
        lineHeight: '50px'
    }
}

TableCell.defaultProps = {
    isFirst: false,
    isLast: false,
    isHead: false,
    style: {}
}

export default TableCell
