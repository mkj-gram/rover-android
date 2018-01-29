import * as React from 'react'
import Button from './Button'
import { cloud } from '../styles/colors'
import { text, medium } from '../styles/typography'

interface NavBarProps {
    buttonLeft?: string
    title?: string
    buttonRight?: string
    buttonLeftCallback?: () => void
    buttonRightCallback?: () => void
    style?: {
        containerStyle?: React.CSSProperties
        buttonLeftStyle?: React.CSSProperties
        buttonRightStyle?: React.CSSProperties
        titleStyle?: React.CSSProperties
    }
    id?: string
    getElement?: (val: string, val1: string) => void
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
            buttonRightCallback
        } = this.props

        const container: React.CSSProperties = {
            background: cloud,
            height: 56,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...style.containerStyle
        }
        const buttonLeftStyle: StringMap<
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
            ...style.buttonLeftStyle
        }

        return (
            <div style={container} id={id}>
                <Button
                    text={buttonLeft}
                    type="regular"
                    style={buttonLeftStyle}
                    onClick={buttonLeftCallback}
                />
                <div
                    style={{
                        ...text,
                        ...medium,
                        ...style.titleStyle
                    }}
                >
                    {title}
                </div>
                <Button
                    text={buttonRight}
                    type="regular"
                    style={{ ...buttonRightStyle }}
                    onClick={buttonRightCallback}
                />
            </div>
        )
    }
}

export default NavBar
