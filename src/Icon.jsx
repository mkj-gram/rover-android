import React from 'react';

import { silver } from './styles/colors'

export default ({ type, style }) => {
    
    style = { 
        fill: silver,
        ...style
    }

    let path = null
    let size = 16

    switch (type) {
        case 'chevron-down':
            path = <path fillRule="evenodd" d="M3,9.98966968 L4.02439024,11 L9,6.0926813 L9,6 L9,5.9073187 L4.02439024,1 L3,2.01033032 L7.04519058,6 L3,9.98966968 Z" transform="rotate(90, 6, 6)"></path>
            size = 12
            break
        case 'chevron-right':
            path = <path d="M3,9.98966968 L4.02439024,11 L9,6.0926813 L9,6 L9,5.9073187 L4.02439024,1 L3,2.01033032 L7.04519058,6 L3,9.98966968 Z" transform="rotate(0, 6, 6)"></path>
            size = 12
            break
        case 'close':
            path = <polygon points="9.99282117 1 5.99946427 4.99228544 2.00610736 1 1 2.00717883 4.99228544 6.00053573 1 9.99282117 2.00610736 11 5.99946427 7.00664309 9.99282117 11 11 9.99282117 7.00771456 6.00053573 11 2.00717883"></polygon>
            size = 12
            break
        case 'plus-sign':
            path = <path d="M9,7 L9,2 L7,2 L7,7 L2,7 L2,9 L7,9 L7,14 L9,14 L9,9 L14,9 L14,7 L9,7 L9,7 Z"></path>
            break
    }

    const viewBox = `0 0 ${size} ${size}`;
    return <svg style={style} width={size} height={size} viewBox={viewBox}>{path}</svg>
};
