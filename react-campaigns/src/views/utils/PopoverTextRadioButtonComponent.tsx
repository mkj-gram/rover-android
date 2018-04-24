/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'

import {
    steel,
    Text,
    titanium,
    beige,
    white,
    RadioButton
} from '@rover/ts-bootstrap/dist/src'

export interface PopoverTextRadioButtonComponentProps {
    names?: string[]
    onClick?: (name: string) => void
    selectedTapOption?: string
    displayName?: StringMap<string>
    device: string
}

export interface PopoverTextRadioButtonComponentState {
    onHoverName?: string
}

class PopoverTextRadioButtonComponent extends React.Component<
    PopoverTextRadioButtonComponentProps,
    PopoverTextRadioButtonComponentState
> {
    constructor(props: PopoverTextRadioButtonComponentProps) {
        super(props)
        ;(this.state = {
            onHoverName: ''
        }),
            (this.handleHover = this.handleHover.bind(this))
    }

    handleHover(onHoverName: string) {
        this.setState({
            onHoverName
        })
    }

    render() {
        const {
            names,
            onClick,
            selectedTapOption,
            displayName,
            device
        } = this.props
        const Fragment = React.Fragment

        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly'
                }}
            >
                {names.map((name, index) => (
                    <div
                        key={index}
                        style={{
                            padding: device !== 'Mobile' ? '0 16px' : '0 24px',
                            background:
                                this.state.onHoverName === name &&
                                device !== 'Mobile'
                                    ? beige
                                    : white
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',

                                height: device !== 'Mobile' ? 55 : 71,
                                background:
                                    this.state.onHoverName === name &&
                                    device !== 'Mobile'
                                        ? beige
                                        : white,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseOver={() => this.handleHover(name)}
                            onClick={e => {
                                e.stopPropagation()
                                onClick(name)
                            }}
                        >
                            <Text text={displayName[name]} size="medium" />

                            <RadioButton
                                selected={selectedTapOption === name}
                                style={{
                                    outerStyle: { height: 18, width: 18 }
                                }}
                            />
                        </div>
                        {(index !== names.length - 1 ||
                            device === 'Mobile') && (
                            <div
                                style={{
                                    height: 1,
                                    background: titanium
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        )
    }
}

export default PopoverTextRadioButtonComponent
