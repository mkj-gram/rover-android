/// <reference path="../typings/index.d.ts" />
import { Manager, Reference } from 'react-popper'
import * as React from 'react'
import Popover from './Popover'

export interface PopoverContainerProps {
    id?: string
    children?: JSX.Element[]
    popoverProps?: object
    targetParent?: string
    onClick?: (e?: any) => void
    showPopover?: boolean
    style?: React.CSSProperties
}

class PopoverContainer extends React.Component<PopoverContainerProps, {}> {
    constructor(props: PopoverContainerProps) {
        super(props)
    }

    render() {
        const Fragment = React.Fragment
        const {
            id,
            children,
            popoverProps,
            targetParent,
            onClick,
            style
        } = this.props

        return (
            <Fragment>
                <Manager>
                    <Reference>
                        {({ ref }) => (
                            <div
                                ref={ref}
                                id={id}
                                onClick={e => {
                                    e.stopPropagation()
                                    onClick()
                                }}
                                style={{
                                    display: 'inline-block',
                                    ...style
                                }}
                            >
                                {children[0]}
                            </div>
                        )}
                    </Reference>

                    {this.props.showPopover && (
                        <Popover
                            {...popoverProps}
                            toggle={onClick}
                            targetParent={targetParent}
                        >
                            {children[1]}
                        </Popover>
                    )}
                </Manager>
            </Fragment>
        )
    }
}

export default PopoverContainer
