/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { silver, turquoise } from '../styles/colors'

export type propStyle = {
    innerStyle?: StringMap<string | number>
    outerStyle?: StringMap<string | number>
    containerStyle?: StringMap<string | number>
}

export interface RadioButtonProps {
    selected: boolean
    style?: propStyle
}

const RadioButton: React.SFC<RadioButtonProps> = ({ selected, style }) => {
    const outerStyle: StringMap<string | number> = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        border: `2px solid ${silver}`,
        borderRadius: '50%',
        pointerEvents: 'none',
        ...style.outerStyle
    }

    const innerStyle: StringMap<string | number> = {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: turquoise,
        pointerEvents: 'none',
        ...style.innerStyle
    }

    const containerStyle: StringMap<string | number> = {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        ...style.containerStyle
    }

    return (
        <div style={containerStyle}>
            <div style={outerStyle}>
                {selected === true ? <div style={innerStyle} /> : <div />}
            </div>
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
