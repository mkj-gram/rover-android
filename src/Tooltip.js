import React from 'react'
import { graphite } from '../../common/styles/colors'

const ToolTip = ({ message }) =>
    <div>
        <div
            style={{
                position: 'absolute',
                height: 14,
                width: 14,
                top: 23,
                left: '50%',
                backgroundColor: graphite,
                transform: 'rotate(45deg)'
            }}
        />
        <div
            style={{
                background: graphite,
                borderRadius: 3,
                color: 'white',
                fontSize: 12,
                fontFamily: 'Source Sans Pro',
                height: 28,
                right: -52,
                lineHeight: '28px',
                padding: '0 14px',
                position: 'absolute',
                textAlign: 'center',
                top: 12,
                whiteSpace: 'nowrap',
                width: 118,
                marginTop: 16
            }}
        >
            {message}
        </div>
    </div>

export default ToolTip
