/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'

export interface FormSectionProps {
    children?: JSX.Element[] | JSX.Element
}

const FormSection: React.SFC<FormSectionProps> = ({ children }) => {
    return (
        <div
            style={{
                marginBottom: 48,
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {children}
        </div>
    )
}

export default FormSection
