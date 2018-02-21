/// <reference path="../typings/index.d.ts" />
import { Manager, Target } from 'react-popper'
import * as React from 'react'
import Popover from './Popover'

export interface PopoverContainerProps {
    id?: string
    children?: JSX.Element[]
    popoverProps?: object
    targetParent?: string
    onClick?: () => void
    showPopover?: boolean
}

class PopoverContainer extends React.Component<PopoverContainerProps, {}> {
    constructor(props: PopoverContainerProps) {
        super(props)
    }

    render() {
        const Fragment = React.Fragment
        const { id, children, popoverProps, targetParent, onClick } = this.props
        return (
            <Fragment>
                <Manager>
                    <Target>
                        <div id={id} onClick={onClick}>
                            {children[0]}
                        </div>
                    </Target>
                    {this.props.showPopover && (
                        <Popover
                            {...popoverProps}
                            toggle={onClick}
                            targetId={id}
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
