/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { cloud, white, titanium } from '../styles/colors'
import { Popover } from 'reactstrap'
import NavBar from './NavBar'

interface PopoverProps {
    toggle?: () => void
    target: string
    placement?: Popper.Placement
    popoverOpen: boolean
    children?: JSX.Element
    popoverStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties

    navBarProperties?: StringMap<string | number | StringMap<StringMap<string>>>
    navBarBorderColors?: StringMap<string>
    toggleable?: boolean
}

class PopoverComponent extends React.Component<PopoverProps, {}> {
    static defaultProps: Partial<PopoverProps> = {
        placement: 'auto',
        popoverStyle: {
            popoverBorder: titanium
        },
        navBarBorderColors: {
            primary: white,
            secondary: white
        },
        toggleable: true
    }
    constructor(props: PopoverProps) {
        super(props)
        this.getElement = this.getElement.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    // tslint:disable-next-line:no-any
    handleKeyPress(e: any) {
        if (this.props.toggleable) {
            if (e.keyCode === 27) {
                this.props.toggle()
            }
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress, false)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress, false)
    }

    getElement(placement: string, navBarHeight: string) {
        let arrowPosition = (document.querySelector(
            'span.arrow'
        ) as HTMLElement).style.top
        let styleElem = document.head.appendChild(
            document.createElement('style')
        )
        styleElem.setAttribute('id', 'popoverCustomStyle')
        const { primary, secondary } = this.props.navBarBorderColors
        if (['left', 'right'].includes(placement)) {
            if (parseInt(navBarHeight, 10) > parseInt(arrowPosition, 10)) {
                styleElem.innerHTML = `
                .bs-popover-right .arrow::after {
                    border-right-color: ${primary};
                }
                .bs-popover-left .arrow::after {
                    border-left-color: ${primary};
                }
                `
            } else {
                styleElem.innerHTML = `
                .bs-popover-right .arrow::after {
                    border-right-color: ${secondary};
                }
                .bs-popover-left .arrow::after {
                    border-left-color: ${secondary};
                }
                `
            }
        } else if (placement === 'bottom') {
            styleElem.innerHTML = `.bs-popover-bottom .arrow::after {border-bottom-color: ${primary};}`
        } else if (placement === 'top') {
            styleElem.innerHTML = `.bs-popover-top .arrow::after {border-top-color: ${secondary};}`
        }
    }

    render() {
        const Fragment = React.Fragment
        const { primary, secondary } = this.props.navBarBorderColors
        let val
        if (this.props.navBarProperties !== undefined) {
            val = (
                <Fragment>
                    <NavBar
                        {...this.props.navBarProperties}
                        getElement={this.getElement}
                    />
                    {this.props.children}
                </Fragment>
            )
        } else {
            if (document.getElementById('popoverCustomStyle')) {
                var elem = document.getElementById('popoverCustomStyle')
                elem.parentNode.removeChild(elem)
            }

            let styleElem = document.head.appendChild(
                document.createElement('style')
            )
            styleElem.setAttribute('id', 'popoverCustomStyle')
            styleElem.innerHTML = `
                .bs-popover-right .arrow::after {
                    border-right-color: ${primary};
                }
                .bs-popover-left .arrow::after {
                    border-left-color: ${primary};
                }
                .bs-popover-bottom .arrow::after {
                    border-bottom-color: ${primary};
                }
                .bs-popover-top .arrow::after {
                    border-top-color: ${primary};
                }
            `
            val = <Fragment>{this.props.children}</Fragment>
        }

        return (
            <Fragment>
                <style type="text/css">
                    {`
                        .popover {
                            max-width: none;
                            border: 1px solid ${
                                this.props.popoverStyle.popoverBorder
                            };
                        }
                    `}
                </style>
                <Popover
                    placement={this.props.placement}
                    isOpen={this.props.popoverOpen}
                    target={this.props.target}
                    toggle={
                        this.props.toggleable
                            ? () => this.props.toggle()
                            : () => null
                    }
                >
                    <div
                        onKeyPress={this.handleKeyPress}
                        style={this.props.containerStyle}
                    >
                        {val}
                    </div>
                </Popover>
            </Fragment>
        )
    }
}

export default PopoverComponent
