import React from 'react'
import PropTypes from 'prop-types'

import {
    ash,
    graphite,
    lavender,
    light,
    silver,
    text
} from '@rover/react-bootstrap'

import { ProfileIcon, DeviceIconSmall, LocationIcon, TestDeviceIcon } from '@rover/react-icons'

const listItemStyle = {
    ...text,
    ...light,
    width: '100%',
    height: 40,
    borderTop: `1px solid ${ash}`,
    color: lavender,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    flex: '0 0 auto'
}

const getIcon = (type, group, attribute) => {
    let icon
    if (type === 'CUSTOM_PROFILE' || type === 'ROVER_PROFILE') {
        icon = <ProfileIcon fill={silver} />
    } else if (type === 'DEVICE') {
        if (group === 'location') {
            icon = <LocationIcon fill={silver} />
        } else if (attribute === 'is_test_device') {
            icon = <TestDeviceIcon />
        } else {
            icon = <DeviceIconSmall style={{ fill: silver }} />
        }
    }
    return icon
}

const onMouseOver = (e, id) => {
    document.getElementById(id).style.backgroundColor = ash
}

const onMouseOut = (e, id) => {
    document.getElementById(id).style.backgroundColor = graphite
}

const FilterListItem = ({ filter, onSelect }) =>
    <div
        style={listItemStyle}
        onMouseOver={e => onMouseOver(e, `${filter.attribute}_${filter.selector}`)}
        onMouseOut={e => onMouseOut(e, `${filter.attribute}_${filter.selector}`)}
        onClick={() => onSelect(filter)}
        id={`${filter.attribute}_${filter.selector}`}
    >
        {getIcon(filter.selector, filter.group, filter.attribute)}
        <span
            style={{
                marginLeft: 10,
                pointerEvents: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {filter.label}
        </span>
    </div>

export default FilterListItem
