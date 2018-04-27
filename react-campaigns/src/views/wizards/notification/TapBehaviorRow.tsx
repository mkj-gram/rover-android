/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { titanium } from '@rover/ts-bootstrap/dist/src'

export interface TapBehaviorRowProps {
    children?: JSX.Element
    handleClick: () => void
}

const TapBehaviorRow: React.SFC<TapBehaviorRowProps> = ({
    children,
    handleClick
}) => {
    return (
        <div
            style={{
                marginBottom: 24,
                paddingBottom: 23,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${titanium}`
            }}
            onClick={handleClick}
        >
            {children}
        </div>
    )
}

export default TapBehaviorRow
