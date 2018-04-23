/// <reference path="../../../../typings/index.d.ts" />
import * as React from 'react'
import { NavBar, white, Text, graphite } from '@rover/ts-bootstrap/dist/src'

export interface MobilePopoverProps {
    child: JSX.Element | JSX.Element[]
    onClose?: () => void
    animation: string
    title?: string
    navbarProps?: object
}

const MobilePopover: React.SFC<MobilePopoverProps> = ({
    animation,
    child,
    title,
    onClose,
    navbarProps
}) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
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
                        },
                        innerStyle: {
                            color: graphite
                        }
                    },
                    buttonRightStyle: {
                        outerStyle: {
                            marginRight: 24
                        },
                        innerStyle: {
                            color: graphite
                        }
                    }
                }}
                {...navbarProps}
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

export default MobilePopover
