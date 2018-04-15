/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import { beige, titanium, Text } from '@rover/ts-bootstrap/dist/src'

export interface HoverTextInputProps {
    children: JSX.Element | JSX.Element[]
    description: string
    field: string
}

export interface HoverTextInputState {
    isHovered: boolean
}

class HoverTextInput extends React.Component<
    HoverTextInputProps,
    HoverTextInputState
> {
    constructor(props: HoverTextInputProps) {
        super(props)
        this.state = {
            isHovered: false
        }
        this.handleHover = this.handleHover.bind(this)
    }

    handleHover() {
        this.setState({
            isHovered: !this.state.isHovered
        })
    }

    render() {
        const { children, description, field } = this.props
        const { isHovered } = this.state

        const style = isHovered
            ? {
                  marginLeft: -32,
                  marginRight: -32,
                  paddingRight: 32,
                  paddingLeft: 32,
                  background: beige
              }
            : {}

        const getTopAdjustment = () => {
            const child = document.getElementById(
                `hoverTextInputChild_${field}`
            )
            const parent = document.getElementById(
                `hoverTextInputParent_${field}`
            )

            if (child && parent) {
                child.style.top = `${parent.getBoundingClientRect().top -
                    (child.getBoundingClientRect().height -
                        parent.getBoundingClientRect().height) /
                        2}px`
            }
        }
        const Fragment = React.Fragment
        return (
            <div
                style={{ ...style }}
                onMouseEnter={() => this.handleHover()}
                onMouseLeave={() => this.handleHover()}
            >
                <div
                    style={{
                        display: 'flex',
                        minHeight: 72,
                        borderBottom: `1px solid ${titanium}`,
                        position: 'relative',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    id={`hoverTextInputParent_${field}`}
                >
                    {children}
                    {isHovered && (
                        <Fragment>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(50% - 10px)',
                                    left: 726,
                                    height: 20,
                                    width: 20,
                                    transform: 'rotate(45deg)',
                                    background: beige,
                                    border: `1px solid ${titanium}`,
                                    borderBottom: 'none',
                                    borderLeft: 'none',
                                    borderRadius: '0 5px 0 0'
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    left: 800,
                                    width: `calc(100vw - 832px)`
                                }}
                                id={`hoverTextInputChild_${field}`}
                            >
                                <div
                                    style={{
                                        padding: '16px 12px',
                                        minWidth: 370,
                                        maxWidth: 556,
                                        borderLeft: `4px solid ${titanium}`
                                    }}
                                >
                                    <Text
                                        text={description}
                                        size="large"
                                        label={true}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            </div>
        )
    }
}
export default HoverTextInput
