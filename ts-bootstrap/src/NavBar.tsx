import * as React from 'react'
import Button from './Button'

import { charcoal, cloud } from '../styles/colors'
import { text, medium } from '../styles/typography'

export interface NavBarProps {
    buttonLeft?: string
    title?: string
    buttonRight?: string
    buttonLeftCallback?: () => void
    buttonRightCallback?: () => void
    style?: {
        containerStyle?: React.CSSProperties
        buttonLeftStyle?: StringMap<string | number | React.CSSProperties>
        buttonRightStyle?: StringMap<string | number | React.CSSProperties>
        titleStyle?: React.CSSProperties
    }
    id?: string
    getElement?: (val: string, val1: string) => void
    customLeftElem?: JSX.Element
}

class NavBar extends React.Component<NavBarProps, {}> {
    static defaultProps: Partial<NavBarProps> = {
        style: {
            containerStyle: {},
            buttonLeftStyle: {},
            buttonRightStyle: {},
            titleStyle: {}
        }
    }

    constructor(props: NavBarProps) {
        super(props)
    }

    componentDidUpdate() {
        if (this.props.id) {
            this.props.getElement(
                (document.getElementsByClassName('popper')[0] as HTMLElement)
                    .dataset.placement,
                document.getElementById(this.props.id).style.height
            )
        }
    }

    render() {
        let {
            buttonLeft,
            title,
            buttonRight,
            style,
            id,
            buttonLeftCallback,
            buttonRightCallback,
            customLeftElem
        } = this.props

        const container: React.CSSProperties = {
            background: cloud,
            height: 56,
            width: '100%',
            display: 'flex',
            ...style.containerStyle
        }
        let buttonLeftStyle: StringMap<
            string | number | React.CSSProperties
        > = {
            outerStyle: {
                marginLeft: 16
            },
            ...style.buttonLeftStyle
        }
        const buttonRightStyle: StringMap<
            string | number | React.CSSProperties
        > = {
            outerStyle: {
                marginRight: 16
            },
            ...style.buttonRightStyle
        }

        let innerStyle: StringMap<number | string> = {
            flex: 1,
            display: 'flex',
            alignItems: 'center'
        }

        const renderLeftNavbar = () => {
            if (customLeftElem) {
                return customLeftElem
            } else {
                return (
                    <Button
                        text={buttonLeft}
                        type="regular"
                        style={buttonLeftStyle}
                        onClick={buttonLeftCallback}
                    />
                )
            }
        }

        return (
            <div style={container} id={id}>
                <div
                    style={{
                        ...innerStyle
                    }}
                >
                    {renderLeftNavbar()}
                </div>
                <div
                    style={{
                        ...text,
                        ...medium,
                        ...style.titleStyle,
                        ...innerStyle,
                        flex: 2,
                        justifyContent: 'center',
                        color: charcoal
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        ...innerStyle,
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        text={buttonRight}
                        type="regular"
                        style={{ ...buttonRightStyle }}
                        onClick={buttonRightCallback}
                    />
                </div>
            </div>
        )
    }
}

export default NavBar
