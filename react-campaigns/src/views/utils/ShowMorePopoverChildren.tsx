/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import {
    DuplicateIcon,
    ArchiveIcon,
    RenameIcon,
    steel,
    Text,
    titanium,
    beige,
    white
} from '@rover/ts-bootstrap/dist/src'

export interface ShowMorePopoverChildrenProps {
    names?: string[]
    onClick?: (name: string) => void
}

export interface ShowMorePopoverChildrenState {
    onHoverName?: string
}

class ShowMorePopoverChildren extends React.Component<
    ShowMorePopoverChildrenProps,
    ShowMorePopoverChildrenState
> {
    constructor(props: ShowMorePopoverChildrenProps) {
        super(props)
        this.state = {
            onHoverName: ''
        }
        this.handleHover = this.handleHover.bind(this)
        this.getIcon = this.getIcon.bind(this)
    }

    handleHover(onHoverName: string) {
        this.setState({
            onHoverName
        })
    }

    getIcon(val: string) {
        const icons: StringMap<JSX.Element> = {
            Rename: RenameIcon({ fill: steel }),
            Duplicate: DuplicateIcon({ fill: steel }),
            Archive: ArchiveIcon({ fill: steel })
        }
        return icons[val] || RenameIcon({ fill: steel })
    }

    render() {
        const { names, onClick } = this.props
        const Fragment = React.Fragment

        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    border: '1px solid transparent'
                }}
            >
                {names.map((name, index) => (
                    <Fragment key={index}>
                        <div
                            style={{
                                display: 'flex',
                                padding: '16px 16px 15px 13px',
                                background:
                                    this.state.onHoverName === name
                                        ? beige
                                        : white
                            }}
                            onMouseOver={() => this.handleHover(name)}
                            onClick={() => onClick(name)}
                        >
                            <div style={{ marginRight: 8 }}>
                                {this.getIcon(name)}
                            </div>
                            <Text text={name} size="medium" />
                        </div>

                        {index !== names.length - 1 && (
                            <div
                                style={{
                                    height: 1,
                                    background: titanium,
                                    marginLeft: 16,
                                    marginRight: 16
                                }}
                            />
                        )}
                    </Fragment>
                ))}
            </div>
        )
    }
}

export default ShowMorePopoverChildren
