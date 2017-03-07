import React from 'react'

import TableCell from './TableCell'

import { cloud } from '../../styles/colors'

const EmptyTableCell = ({ style, ...rest }) => {

    let { loadingIndicator: loadingIndicatorStyle, ...containerStyle } = style

    loadingIndicatorStyle = {
        ...EmptyTableCell.defaultStyles.loadingIndicator,
        ...loadingIndicatorStyle
    }

    return (
        <TableCell style={containerStyle} {...rest}>
            <div style={loadingIndicatorStyle}></div>
        </TableCell>
    )
}

EmptyTableCell.defaultStyles = {
    loadingIndicator: {
        background: cloud,
        height: 16,
        margin: '22px 0'
    }
}

EmptyTableCell.defaultProps = {
    style: {}
}

export default EmptyTableCell
