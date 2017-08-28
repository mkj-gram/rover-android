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

import { ProfileIcon, DeviceIconSmall, LocationIcon } from '@rover/react-icons'

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

const getIcon = type => {
    switch (type) {
        case 'profile':
            return <ProfileIcon fill={silver} />
            break
        case 'device':
            return <DeviceIconSmall style={{ fill: silver }} />
        case 'location':
            return <LocationIcon fill={silver} />
        default:
            return
    }
}

const onMouseOver = e => (e.target.style.backgroundColor = ash)
const onMouseOut = e => (e.target.style.backgroundColor = graphite)

const FilterListItem = ({ filter, onSelect }) =>
    <div
        style={listItemStyle}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={() => onSelect(filter)}
    >
        {getIcon(filter.category)}
        <span
            style={{
                marginLeft: 10,
                pointerEvents: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {filter.attribute}
        </span>
    </div>

export default FilterListItem
