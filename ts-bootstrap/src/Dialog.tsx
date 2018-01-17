import * as React from 'react'
import MediaQuery from 'react-responsive'

import Button from './Button'
import { text, medium } from '../styles/typography'

interface DialogProps {
    children?: string
    buttonPrimaryText: string
    buttonSecondaryText?: string
    containerStyle?: React.CSSProperties
    childStyle?: React.CSSProperties
    buttonStyle?: React.CSSProperties
    primaryOnClick?: () => void
    secondaryOnClick?: () => void
}

const Dialog: React.SFC<DialogProps> = ({
    children,
    buttonPrimaryText,
    buttonSecondaryText,
    containerStyle,
    buttonStyle,
    childStyle,
    primaryOnClick,
    secondaryOnClick
}) => {
    let container: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
        outline: '1px solid black'
    }

    let button: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 80,
        width: '100%'
    }

    let child: React.CSSProperties = {
        ...text,
        ...medium
    }

    let buttons: JSX.Element
    const Fragment = React.Fragment
    let overRideWidth
    return (
        <Fragment>
            <MediaQuery maxWidth={375}>
                {matches => {
                    if (matches) {
                        child = {
                            ...child,
                            width: 295,
                            margin: '24px 24px 24px 24px'
                        }
                        container = {
                            ...container,
                            width: 343
                        }
                        overRideWidth =
                            buttonSecondaryText !== undefined ? 139 : 295
                    } else {
                        child = {
                            ...child,
                            width: 320,
                            margin: '24px 32px 24px 32px'
                        }
                        container = {
                            ...container,
                            width: 384
                        }
                        overRideWidth =
                            buttonSecondaryText !== undefined ? 152 : 320
                    }
                    child = {
                        ...child,
                        ...childStyle
                    }
                    container = {
                        ...container,
                        ...containerStyle
                    }
                    button = {
                        ...button,
                        ...buttonStyle
                    }

                    let childElem = <div style={child}>{children}</div>
                    if (buttonSecondaryText !== undefined) {
                        buttons = (
                            <div style={button}>
                                <Button
                                    text={buttonSecondaryText}
                                    size="large"
                                    type="secondary"
                                    onClick={secondaryOnClick}
                                    overrideWidth={overRideWidth}
                                />
                                <Button
                                    text={buttonPrimaryText}
                                    size="large"
                                    type="primary"
                                    onClick={primaryOnClick}
                                    overrideWidth={overRideWidth}
                                />
                            </div>
                        )
                    } else {
                        buttons = (
                            <div style={button}>
                                <Button
                                    text={buttonPrimaryText}
                                    size="large"
                                    type="primary"
                                    onClick={primaryOnClick}
                                    overrideWidth={overRideWidth}
                                />
                            </div>
                        )
                    }

                    return (
                        <div style={container}>
                            {childElem}
                            {buttons}
                        </div>
                    )
                }}
            </MediaQuery>
        </Fragment>
    )
}

export default Dialog
