/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'

import { beige, titanium, white } from '@rover/ts-bootstrap/dist/src'

export interface SelectableListProps {
    children: JSX.Element[]
    device: string
}

export interface SelectableListState {
    onHoverName?: React.ReactText
}

class SelectableList extends React.Component<
    SelectableListProps,
    SelectableListState
> {
    constructor(props: SelectableListProps) {
        super(props)
        this.state = {
            onHoverName: ''
        }
        this.handleHover = this.handleHover.bind(this)
    }

    handleHover(onHoverName: React.ReactText) {
        this.setState({
            onHoverName: onHoverName
        })
    }

    render() {
        const { children, device } = this.props

        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly'
                }}
                onMouseOut={() => this.handleHover('')}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        style={{
                            padding: device !== 'Mobile' ? '0 16px' : '0 24px',
                            background:
                                this.state.onHoverName === child.key &&
                                device !== 'Mobile'
                                    ? beige
                                    : white,
                            minHeight: device !== 'Mobile' ? 56 : 72
                        }}
                        onMouseOver={() =>
                            device === 'Desktop' && this.handleHover(child.key)
                        }
                    >
                        {child}

                        <div
                            style={{
                                height: 1,
                                background: titanium
                            }}
                        />
                    </div>
                ))}
            </div>
        )
    }
}

export default SelectableList
