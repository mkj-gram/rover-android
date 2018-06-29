import * as React from 'react'
import { Text, steel } from '@rover/ts-bootstrap/dist/src'

export interface InverseLabelProps {
    children?: JSX.Element
    title: string
}

const InverseLabel: React.SFC<InverseLabelProps> = ({ children, title }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
            <Text
                text={title}
                label={true}
                size="large"
                textStyle={{
                    color: steel
                }}
            />
            {children}
        </div>
    )
}

export default InverseLabel
