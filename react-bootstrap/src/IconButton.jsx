import React from 'react';

import Anchor from './Anchor'
import Icon from './Icon'

import { cloud } from './styles/colors'

export default ({ type, style = {}, hoverStyle, onClick = () => null }) => {

    let { icon, ...anchor } = style

    anchor = { 
        alignItems: 'center',
        borderRadius: 12,
        display: 'flex',
        height: 24,
        justifyContent: 'center',
        width: 24,
        ...anchor
    }

    hoverStyle = {
        background: cloud,
        ...hoverStyle
    }

    return (
        <Anchor style={anchor} hoverStyle={hoverStyle} onClick={onClick}>
            <Icon type={type} style={icon}/>
        </Anchor>
    )
}
