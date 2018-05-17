/// <reference path="../typings/index.d.ts" />
import 'react-rangeslider/lib/index.css'
import * as React from 'react'
import { turquoise, cloud, silver } from '../styles/colors'

import Slider from 'react-rangeslider'

export interface SliderProps {
    min: number
    max: number
    value: number
    containerStyle?: React.CSSProperties
    fillStyle?: React.CSSProperties
    handleStyle?: React.CSSProperties
    onChange?: (val: number) => void
}

const getStyle = (
    style: React.CSSProperties,
    property: string,
    value: string | boolean
) => {
    if (style && style[property as keyof React.CSSProperties] !== undefined) {
        return style[property as keyof React.CSSProperties]
    }
    return value
}

const SliderComponent: React.SFC<SliderProps> = ({
    min,
    max,
    value,
    containerStyle,
    fillStyle,
    handleStyle,
    onChange
}) => {
    let container: React.CSSProperties = {
        width: 240,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        ...containerStyle
    }
    return (
        <div>
            <div className="roverSlider" style={container}>
                <style type="text/css">
                    {`
                    .roverSlider .rangeslider.rangeslider-horizontal {
                        display: block;
                        background: ${getStyle(
                            fillStyle,
                            'unfilledBackground',
                            cloud
                        )};
                        width: 100%;
                        height: ${getStyle(fillStyle, 'height', '2px')};
                        margin: 0;
                    }

                    .roverSlider .rangeslider__fill { 
                        background: ${getStyle(
                            fillStyle,
                            'filledBackground',
                            turquoise
                        )};
                        border-radius: none;
                        -webkit-box-shadow: none;
                       
                    }
                
                    .roverSlider .rangeslider__handle {
                        cursor: default;
                        height: ${getStyle(handleStyle, 'height', '12px')};
                        width: ${getStyle(handleStyle, 'width', '12px')};
                        border-radius: ${getStyle(
                            handleStyle,
                            'borderRadius',
                            '8px'
                        )};
                        border: ${getStyle(
                            handleStyle,
                            'border',
                            `2px solid ${silver}`
                        )};
                        
                        -webkit-box-shadow: none;
                        padding-right: 0px;
                        padding-left: 0px;
                    }

                    .rangeslider-horizontal .rangeslider__handle:after {
                        display: none;
                    }

                    .roverSlider :focus {
                        outline: 1px solid transparent;
                    }
                    .roverSlider .rangeslider  {
                        -webkit-box-shadow: none;
                        box-shadow: none;
                    }                
                `}
                </style>

                <Slider
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    tooltip={false}
                />
            </div>
        </div>
    )
}

export default SliderComponent
