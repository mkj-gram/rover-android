/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import ContentEditable from './ContentEditable'
import { silver } from '../styles/colors'

export interface Props {
    html?: string
    placeholderText?: string
    style?: React.CSSProperties
    onChange: (val: string) => void
    id?: string
    contentEditable?: boolean
    onBlurChange?: boolean
    handleBlurChange?: (val: string) => void
}

export interface State {
    hidePlaceholder?: boolean
}

class PlaceholderComponent extends React.Component<Props, State> {
    static defaultProps: Partial<Props> = {
        onBlurChange: true
    }
    constructor(props: Props) {
        super(props)
        this.state = {
            hidePlaceholder: false
        }
        this.handlePlaceholderChange = this.handlePlaceholderChange.bind(this)
    }

    handlePlaceholderChange(val: string) {
        this.setState({
            hidePlaceholder: val.length !== 0
        })
    }

    render() {
        const {
            html,
            placeholderText,
            style,
            onChange,
            id,
            contentEditable,
            onBlurChange,
            handleBlurChange
        } = this.props
        const { hidePlaceholder } = this.state

        return (
            <div
                style={{
                    position: 'relative',
                    height: this.props.style.lineHeight
                }}
            >
                {!hidePlaceholder && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            ...this.props.style,
                            color: silver
                        }}
                    >
                        {placeholderText}
                    </div>
                )}
                {contentEditable && (
                    <ContentEditable
                        html={html}
                        onChange={onChange}
                        id={id}
                        onBlurChange={onBlurChange}
                        style={this.props.style}
                        handlePlaceholderChange={this.handlePlaceholderChange}
                        placeholder={true}
                        handleBlurChange={handleBlurChange}
                    />
                )}
            </div>
        )
    }
}

export default PlaceholderComponent
