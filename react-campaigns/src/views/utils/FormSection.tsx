/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'

export interface FormSectionProps {
    children?: JSX.Element | (JSX.Element | React.ReactPortal)[]
    device: Media
    style?: React.CSSProperties
}

const FormSection: React.SFC<FormSectionProps> = ({
    children,
    device,
    style
}) => {
    return (
        <div
            style={{
                marginBottom: 48,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: device !== 'Mobile' ? '0 32px' : '0 24px',
                ...style
            }}
        >
            {children}
        </div>
    )
}

export default FormSection
