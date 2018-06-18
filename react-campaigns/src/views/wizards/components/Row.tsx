/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { titanium } from '@rover/ts-bootstrap/dist/src'

export interface FormSectionRowProps {
    onClick?: () => void

    children?: JSX.Element[] | JSX.Element
}

const Row: React.SFC<FormSectionRowProps> = ({ onClick, children }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0 23px',
                borderBottom: `1px solid ${titanium}`
            }}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Row
