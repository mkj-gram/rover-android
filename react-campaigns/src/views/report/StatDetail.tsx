/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import {
    AlertInfoIcon,
    steel,
    Text,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

export interface StatDetailProps {
    detail: string
    key?: string
    name: string
    onClick?: () => void
    value: string
}
const style: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    width: 362
}
const statStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
}
const StatDetail: React.SFC<StatDetailProps> = ({ name, onClick, value }) => (
    <div style={style} onClick={() => onClick()}>
        <div style={statStyle}>
            <Text
                label={true}
                size="small"
                text={name}
                textStyle={{ color: steel }}
            />
            <Text size="medium" text={value} />
        </div>
        <AlertInfoIcon fill={turquoise} />
    </div>
)

export default StatDetail
