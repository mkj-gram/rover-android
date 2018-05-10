/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import MediaQuery from 'react-responsive'

import { beige, titanium, Text, charcoal } from '@rover/ts-bootstrap/dist/src'

export interface HoverTextInputProps {
    children: JSX.Element | JSX.Element[]
    description: JSX.Element
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

    handleHover(isHovered: boolean) {
        if (window.innerWidth >= 1140) {
            this.setState({
                isHovered
            })
        }
    }

    componentDidUpdate() {
        const { field } = this.props
        const triangleChild = document.getElementById(
            `hoverTextInputTriangle_${field}`
        )
        const descriptionChild = document.getElementById(
            `hoverTextInputDescriptionChild_${field}`
        )
        const parent = document.getElementById(`hoverTextInputParent_${field}`)

        const bridgeHover = document.getElementById(`hoverTextBridge_${field}`)

        if (descriptionChild && triangleChild && parent && bridgeHover) {
            triangleChild.style.top = `${parent.getBoundingClientRect().top -
                (triangleChild.getBoundingClientRect().height -
                    parent.getBoundingClientRect().height) /
                    2}px`
            descriptionChild.style.top = `${parent.getBoundingClientRect().top -
                (descriptionChild.getBoundingClientRect().height -
                    parent.getBoundingClientRect().height) /
                    2}px`

            bridgeHover.style.top = `${parent.getBoundingClientRect().top}px`
            bridgeHover.style.height = `${
                parent.getBoundingClientRect().height
            }px`
        }
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

        const Fragment = React.Fragment
        return (
            <div
                style={{ ...style }}
                onMouseEnter={() => this.handleHover(true)}
                onMouseLeave={() => this.handleHover(false)}
            >
                <div
                    style={{
                        display: 'flex',
                        minHeight: 72,
                        position: 'relative',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    id={`hoverTextInputParent_${field}`}
                >
                    {children}
                    {isHovered && (
                        <MediaQuery minWidth={1140}>
                            {ReactDOM.createPortal(
                                <Fragment>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: 0,
                                            width: 64
                                        }}
                                        onMouseEnter={() =>
                                            this.handleHover(true)
                                        }
                                        id={`hoverTextBridge_${field}`}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: -10,
                                            height: 20,
                                            width: 20,
                                            transform: 'rotate(45deg)',
                                            background: beige,
                                            border: `1px solid ${titanium}`,
                                            borderBottom: 'none',
                                            borderLeft: 'none',
                                            borderRadius: '0 5px 0 0',
                                            zIndex: 2
                                        }}
                                        id={`hoverTextInputTriangle_${field}`}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 64,
                                            width: `calc(100vw - 832px)`
                                        }}
                                        id={`hoverTextInputDescriptionChild_${field}`}
                                    >
                                        <div
                                            style={{
                                                padding: '16px 12px',
                                                minWidth: 370,
                                                maxWidth: 556,
                                                borderLeft: `4px solid ${titanium}`
                                            }}
                                        >
                                            <div
                                                style={{
                                                    cursor: 'default',
                                                    fontFamily:
                                                        '"Source Sans Pro", sans-serif',
                                                    fontSize: 19,
                                                    fontWeight: 400,
                                                    color: charcoal,
                                                    display: 'inline-block',
                                                    lineHeight: '24px'
                                                }}
                                            >
                                                {description}
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>,
                                document.getElementById('mainModalRight')
                            )}
                        </MediaQuery>
                    )}
                </div>
            </div>
        )
    }
}
export default HoverTextInput
