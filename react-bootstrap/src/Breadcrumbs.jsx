import React from 'react'

import Anchor from './Anchor'
import Icon from './Icon'

import { text, truncate } from './styles/typography'

const Breadcrumbs = ({ primaryColor, items, style }) => {

    let { anchor: anchorStyle, span: spanStyle, icon: iconStyle, ...containerStyle } = style

    containerStyle = {
        ...Breadcrumbs.deafultStyles.container,
        ...containerStyle
    }

    anchorStyle = {
        ...Breadcrumbs.deafultStyles.anchor,
        ...anchorStyle
    }

    spanStyle = {
        ...Breadcrumbs.deafultStyles.span,
        ...spanStyle
    }

    iconStyle = {
        ...Breadcrumbs.deafultStyles.icon,
        ...iconStyle
    }

    const children = []

    const isLast = i => i === items.length - 1

    items.forEach((item, index) => {
        if (item.to) {
            children.push(<Anchor key={`anchor-${index}`} to={item.to} primaryColor={primaryColor} style={anchorStyle}>{item.name}</Anchor>)
        } else {
            children.push(<span key={`span-${index}`} style={spanStyle}>{item.name}</span>)
        }

        if (!isLast(index)) {
            children.push(<Icon key={`icon-${index}`} type="chevron-right" style={iconStyle}/>)
        }
    })

    return <div style={containerStyle}>{children}</div>
}

Breadcrumbs.defaultProps = {
    items: [],
    style: {}
}

Breadcrumbs.deafultStyles = {
    container: {
        ...text,
        alignItems: 'center',
        display: 'flex',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    anchor: { 
        flex: '0 0 auto'
    },
    span: { 
        ...truncate,
        flex: '0 1 auto'
    },
    icon: { 
        flex: 'none',
        margin: '0 4px'
    }
}

export default Breadcrumbs
