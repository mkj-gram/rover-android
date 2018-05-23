/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import NavBar from './NavBar'
import { titanium, white } from '../styles/colors'
import { Popper } from 'react-popper'
import PopperJS from 'popper.js'
import ResponsiveContainer from '../components/ResponsiveContainer'

export type func = () => void

export interface PopoverProps extends InjectedProps {
    placement?: PopperJS.Placement
    children?: JSX.Element

    toggle?: () => void
    arrowColors?: StringMap<string>
    navBarProperties?: StringMap<string | number | object | func>

    toggleable?: boolean
    targetParent?: string
}

class PopoverComponent extends React.Component<PopoverProps, {}> {
    static defaultProps: Partial<PopoverProps> = {
        placement: 'left',
        arrowColors: {
            primary: white,
            secondary: white,
            border: titanium
        },
        toggleable: true
    }

    constructor(props: PopoverProps) {
        super(props)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.evalChild = this.evalChild.bind(this)
        this.getElement = this.getElement.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentDidMount() {
        const { device } = this.props

        switch (device) {
            case 'Desktop':
                document.addEventListener('mouseup', this.handleClickOutside)
                document.addEventListener('keydown', this.handleKeyPress, false)
                break
            case 'Tablet':
            case 'Mobile':
            default:
                document.addEventListener('touchend', this.handleClickOutside)
                break
        }
    }
    componentWillUnmount() {
        const { device } = this.props

        switch (device) {
            case 'Desktop':
                document.removeEventListener('mouseup', this.handleClickOutside)
                document.removeEventListener(
                    'keydown',
                    this.handleKeyPress,
                    false
                )
                break
            case 'Tablet':
            case 'Mobile':
            default:
                document.removeEventListener(
                    'touchend',
                    this.handleClickOutside
                )
                break
        }
    }

    handleKeyPress(e: KeyboardEvent) {
        if (this.props.toggleable) {
            if (e.keyCode === 27) {
                this.props.toggle()
            }
        }
    }

    getElement(placement: string, navBarHeight: string) {
        if (document.getElementById('popoverCustomStyle')) {
            let elem = document.getElementById('popoverCustomStyle')
            elem.parentNode.removeChild(elem)
        }

        let arrowPosition = (document.querySelector(
            'div.popper__arrow'
        ) as HTMLElement).style.top
        let styleElem = document.head.appendChild(
            document.createElement('style')
        )

        styleElem.setAttribute('id', 'popoverCustomStyle')
        const { primary, secondary, border } = this.props.arrowColors
        if (placement === 'left' || placement === 'right') {
            if (parseInt(navBarHeight, 10) > parseInt(arrowPosition, 10)) {
                styleElem.innerHTML = `
                .popper[data-placement^='right'] .popper__arrow {
                    background: ${primary} !important; 
                }
                .popper[data-placement^='left'] .popper__arrow {
                    background: ${primary} !important; 
                }
                `
            } else {
                styleElem.innerHTML = `
                .popper[data-placement^='right'] .popper__arrow {
                    background: ${secondary} !important; 
                }
                .popper[data-placement^='left'] .popper__arrow {
                    background: ${secondary} !important; 
                }
                `
            }
        } else if (placement === 'bottom') {
            styleElem.innerHTML = `.popper[data-placement^='bottom'] .popper__arrow {
                background: ${primary} !important; 
            }`
        } else if (placement === 'top') {
            styleElem.innerHTML = `.popper[data-placement^='top'] .popper__arrow {
                background: ${secondary} !important; 
            }`
        }
    }

    evalChild() {
        const Fragment = React.Fragment
        let val
        if (this.props.navBarProperties !== undefined) {
            val = (
                <Fragment>
                    {this.props.navBarProperties !== undefined && (
                        <NavBar
                            {...this.props.navBarProperties}
                            getElement={this.getElement}
                        />
                    )}
                </Fragment>
            )
        } else {
            const { primary } = this.props.arrowColors
            if (document.getElementById('popoverCustomStyle')) {
                let elem = document.getElementById('popoverCustomStyle')
                elem.parentNode.removeChild(elem)
            }
            val = (
                <Fragment>
                    <style type="text/css">
                        {`
                            .popper[data-placement^='top'] .popper__arrow {
                                background: ${primary}; !important;
                            }
                            .popper[data-placement^='bottom'] .popper__arrow {
                                background: ${primary}; !important;
                            }
                            .popper[data-placement^='left'] .popper__arrow {
                                background: ${primary}; !important;
                            }
                            .popper[data-placement^='right'] .popper__arrow {
                                background: ${primary}; !important;
                            }
                        `}
                    </style>
                </Fragment>
            )
        }

        return val
    }

    handleClickOutside(e: MouseEvent) {
        if ((e.target as HTMLElement).id === 'popover-overlay') {
            e.preventDefault()
            this.props.toggle()
        }
    }

    render() {
        let { placement, targetParent } = this.props
        let { primary, border } = this.props.arrowColors

        const Fragment = React.Fragment
        let node = (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    position: 'absolute',
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,0.02)'
                }}
                id="popover-overlay"
            >
                <style type="text/css">{`
                    .popper {                                            
                        background: ${white};
                        border: 1px solid ${titanium};
                        border-radius: 3px;
                    }
                    
                    .popper .popper__arrow {
                        width: 0;
                        height: 0;
                        border-style: solid;
                        position: absolute;
                        margin: 5px;
                    }
                    
                    .popper[data-placement^='top'] {
                        margin-bottom: 12px;
                    }
                    
                    .popper[data-placement^='top'] .popper__arrow {
                        bottom: -6px;
                        background: ${primary};
                        left: calc(50% - 5px);
                        margin-top: 0;
                        margin-bottom: 0;
                        position: absolute;
                        transform: rotate(45deg);
                        border: 1px solid ${border};
                        width: 10px;
                        height: 10px;
                        border-left: none;
                        border-top: none;
                    }
                    
                    .popper[data-placement^='right'] {
                        margin-left: 12px;
                    }
                    
                    .popper[data-placement^='right'] .popper__arrow {
                        left: -6px;
                        background: ${primary};
                        top: calc(50% - 5px);
                        margin-left: 0;
                        margin-right: 0;
                        position: absolute;
                        transform: rotate(45deg);
                        border: 1px solid ${border};
                        width: 10px;
                        height: 10px;
                        border-right: none;
                        border-top: none;
                    }
                    
                    .popper[data-placement^='left'] {
                        margin-right: 12px;
                    }
                    
                    .popper[data-placement^='left'] .popper__arrow {
                        right: -6px;
                        background: ${primary};
                        top: calc(50% - 5px);
                        margin-left: 0;
                        margin-right: 0;
                        position: absolute;
                        transform: rotate(45deg);
                        border: 1px solid ${border};
                        width: 10px;
                        height: 10px;
                        border-bottom: none;
                        border-left: none;
                    }

                    .popper[data-placement^='bottom'] {
                        margin-top: 12px;
                    }
                    
                    .popper[data-placement^='bottom'] .popper__arrow {
                        top: -6px;
                        background: ${primary};
                        left: calc(50% - 5px);
                        margin-top: 0px;
                        margin-bottom: 0px;
                        position: absolute;
                        transform: rotate(45deg);
                        border: 1px solid ${border};
                        width: 10px;
                        height: 10px;
                        border-right: none;
                        border-bottom: none;
                    }
                    
                `}</style>
                <Popper placement={placement}>
                    {({ ref, style, arrowProps }) => (
                        <div
                            className="popper"
                            ref={ref}
                            data-placement={placement}
                            style={{
                                ...style
                            }}
                        >
                            {this.evalChild()}
                            {this.props.children}
                            <div
                                className="popper__arrow"
                                ref={arrowProps.ref}
                                style={arrowProps.style}
                            />
                        </div>
                    )}
                </Popper>
            </div>
        )
        return ReactDOM.createPortal(
            node,
            document.getElementById(targetParent)
        )
    }
}
const Popover = (props: PopoverProps) => {
    const ResponsivePopoverContainer = ResponsiveContainer(props)(
        PopoverComponent
    )
    return ResponsivePopoverContainer
}
export default Popover
