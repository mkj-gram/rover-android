/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { NavBar, white, Text } from '@rover/ts-bootstrap/dist/src'

export interface OwnProps {
    child: JSX.Element
    onClose: () => void
    animation: string
    title?: string
}

const NotificationMobilePopoverContainer: React.SFC<OwnProps> = ({
    animation,
    child,
    title,
    onClose
}) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                animation: `${
                    animation === 'closing' ? 'close' : 'open'
                } 500ms ease`,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 3,
                background: white
            }}
        >
            <NavBar
                buttonLeft="Cancel"
                buttonLeftCallback={onClose}
                style={{
                    buttonLeftStyle: {
                        outerStyle: {
                            marginLeft: 24
                        }
                    }
                }}
            />
            {title !== undefined && (
                <div
                    style={{
                        padding: '24px 24px 0 24px'
                    }}
                >
                    <Text text={title} size="h2" />
                </div>
            )}
            {child}
        </div>
    )
}

export default NotificationMobilePopoverContainer
