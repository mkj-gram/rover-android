import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MediaQuery from 'react-responsive'

import Button from './Button'
import { white } from '../styles/colors'
import { text, medium } from '../styles/typography'

export interface DialogProps {
    dialogText?: string
    buttonPrimaryText: string
    buttonSecondaryText?: string
    containerStyle?: React.CSSProperties
    childStyle?: React.CSSProperties
    buttonStyle?: React.CSSProperties
    primaryOnClick?: () => void
    secondaryOnClick?: () => void
    isOpen?: boolean
    targetParent?: string
}

class Dialog extends React.Component<DialogProps, {}> {
    private node: JSX.Element = undefined
    constructor(props: DialogProps) {
        super(props)
    }

    render() {
        let {
            dialogText,
            buttonPrimaryText,
            buttonSecondaryText,
            containerStyle,
            buttonStyle,
            childStyle,
            primaryOnClick,
            secondaryOnClick,
            isOpen,
            targetParent
        } = this.props

        let container: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: white
        }

        let button: React.CSSProperties = {
            display: 'flex',
            justifyContent: 'center',
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

        this.node = (
            <Fragment>
                <MediaQuery maxDeviceWidth={767}>
                    {matches => {
                        if (matches) {
                            child = {
                                ...child,
                                width: 295,
                                lineHeight: '24px',
                                margin: '24px 24px 8px 24px'
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
                                lineHeight: '24px',
                                margin: '24px 32px 8px 32px'
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

                        let childElem = <div style={child}>{dialogText}</div>
                        if (buttonSecondaryText !== undefined) {
                            buttons = (
                                <div style={button}>
                                    <Button
                                        text={buttonSecondaryText}
                                        size="large"
                                        type="secondary"
                                        onClick={secondaryOnClick}
                                        overrideWidth={overRideWidth}
                                        style={{
                                            outerStyle: {
                                                marginRight: 8
                                            }
                                        }}
                                    />
                                    <Button
                                        text={buttonPrimaryText}
                                        size="large"
                                        type="primary"
                                        onClick={primaryOnClick}
                                        overrideWidth={overRideWidth}
                                        style={{
                                            outerStyle: {
                                                marginLeft: 8
                                            }
                                        }}
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
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.2)'
                                }}
                            >
                                <div style={container}>
                                    {childElem}
                                    {buttons}
                                </div>
                            </div>
                        )
                    }}
                </MediaQuery>
            </Fragment>
        )
        return ReactDOM.createPortal(
            this.node,
            document.getElementById(targetParent)
        )
    }
}

export default Dialog
