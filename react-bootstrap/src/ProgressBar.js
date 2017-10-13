import React from 'react'

import { text, large } from './styles/typography'
import { turquoise, steel, titanium, silver, graphite, chalice } from './styles/colors'
import { CircleChecked, CircleUnchecked } from '@rover/react-icons'

const getStyle = (isCurrent, isComplete, isFirst, isLast) => {
    const baseStyle = {
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        ...text,
        color: 'white',
        backgroundColor: chalice
    }
    
    let declarations = {}
    
    if (isFirst) {
        
    }
    
    if (isLast) {
        declarations.backgroundColor = '#767676'
    }
    
    if (isCurrent) {
        declarations.color = 'white'
        declarations.backgroundColor = turquoise
        declarations.opacity = '100%'
    }
    
    if (isComplete) {
        declarations.color = turquoise
        declarations.backgroundColor = 'white'
        declarations.opacity = '100%'
    }

    return {
        ...baseStyle,
        ...declarations
    }
}

const getIcon = (isComplete, color) => isComplete ? <CircleChecked fill={color} stroke={color}/> : <CircleUnchecked stroke='white'/>

const renderProgressSteps = (color, onClick, steps) => {
    return steps.map(({ title, path, isCurrent, isComplete, isFirst, isLast }, index) =>
        <div
            key={index}
            style={getStyle(isCurrent, isComplete, isFirst, isLast)}
            onClick={e => onClick(path)}
        >
            {getIcon(isComplete, color)}
            <div style={{ marginLeft: 5, opacity: 1 }}>{title}</div>
        </div>
    )
}

const ProgressBar = ({ color, steps, onClick, style }) =>
    <div style={{
        display: 'flex',
        borderRadius: 4,
        overflow: 'hidden',
        ...style
    }}>
        {renderProgressSteps(color, onClick, steps)}
    </div>


export default ProgressBar
