/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { silver, turquoise } from '../styles/colors'

type style = {
    innerStyle?: StringMap<string | number>
    outerStyle?: StringMap<string | number>
}

interface RadioButtonProps {
    selected: boolean
    style?: style
}

const RadioButton: React.SFC<RadioButtonProps> = ({ selected, style }) => {
    const outerStyle: StringMap<string | number> = {
        width: 18,
        height: 18,
        border: `2px solid ${silver}`,
        borderRadius: '50%',
        ...style.outerStyle
    }

    const innerStyle: StringMap<string | number> = {
        top: '14%',
        left: '14%',
        width: '72%',
        height: '72%',
        position: 'relative',
        borderRadius: '50%',
        backgroundColor: turquoise,
        ...style.innerStyle
    }

    return (
        <div style={outerStyle}>
            {selected === true ? <div style={innerStyle} /> : <div />}
        </div>
    )
}

RadioButton.defaultProps = {
    selected: false,
    style: {
        innerStyle: {},
        outerStyle: {}
    }
}

export default RadioButton
