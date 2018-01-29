/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { turquoise, titanium, white } from '../styles/colors'
import CheckmarkIcon from './Icons/CheckmarkIcon'

export interface CheckBoxProps {
    checked?: boolean
    onClick?: (val: string) => void
    value?: string
}

const CheckBox: React.SFC<CheckBoxProps> = ({ checked, onClick, value }) => {
    if (checked) {
        return (
            <div
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    background: turquoise,
                    margin: 4
                }}
                onClick={() => onClick(value)}
            >
                <CheckmarkIcon fill={white} />
            </div>
        )
    } else {
        return (
            <div
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: `2px solid ${titanium}`,
                    margin: 4
                }}
                onClick={() => onClick(value)}
            />
        )
    }
}

export default CheckBox
