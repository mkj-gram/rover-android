/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import { almostWhite, Button, titanium } from '@rover/ts-bootstrap/dist/src'
import { Link } from 'react-router-dom'

export interface Props {
    media: Media
    style?: React.CSSProperties
    onCreate: () => void
}

const NavBar: React.SFC<Props> = ({ media, onCreate, style }) => {
    const baseStyle = {
        width: '100%',
        backgroundColor: almostWhite,
        borderBottom: `1px solid ${titanium}`,
        flex: 'none'
    }

    return (
        <div style={{ height: 97, ...baseStyle }}>
            {media}

            <Button
                onClick={onCreate}
                text="create campaign"
                type="primary"
                size="large"
            />
        </div>
    )
}

export default NavBar
