/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'

import {
    almostWhite,
    ProgressBarThin,
    titanium
} from '@rover/ts-bootstrap/dist/src'

export interface WizardModalProps extends InjectedProps {
    leftHeaderElement?: JSX.Element
    rightHeaderElement?: JSX.Element
    leftToolbarElement?: JSX.Element
    rightToolbarElement?: JSX.Element
    progress: number
    children?: JSX.Element
}

const WizardModal: React.SFC<WizardModalProps> = ({
    children,
    leftHeaderElement,
    rightHeaderElement,
    progress,
    leftToolbarElement,
    rightToolbarElement,
    device
}) => {
    const headerStyle: React.CSSProperties = {
        height: 56,
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: device !== 'Mobile' ? '0 32px' : '0 24px'
    }
    const toolbarStyle: React.CSSProperties = {
        height: 79,
        width: '100%',
        backgroundColor: almostWhite,
        borderTop: `1px solid ${titanium}`,
        flex: 'none',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: device !== 'Mobile' ? '0 32px' : '0 24px'
    }
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                border: `1px solid ${titanium}`
            }}
        >
            <div style={headerStyle}>
                {leftHeaderElement}
                {rightHeaderElement}
            </div>
            <ProgressBarThin
                progress={progress}
                barPropStyle={{
                    width: '100%',
                    flex: '0 0 auto'
                }}
            />

            <div style={{ flex: '1 1 auto' }}>{children}</div>
            <div style={toolbarStyle}>
                {rightToolbarElement}
                {leftToolbarElement}
            </div>
        </div>
    )
}

export default WizardModal
