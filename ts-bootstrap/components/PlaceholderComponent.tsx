/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import ContentEditable from './ContentEditable'

export interface Props {
    html?: string
    placeholderText?: string
    style?: React.CSSProperties
    onChange: (val: string) => void
    id?: string
    contentEditable?: boolean
}

export interface State {
    hidePlaceholder?: boolean
}

class PlaceholderComponent extends React.Component<Props, State> {
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
            contentEditable
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
                            ...this.props.style
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
                        onBlurChange={true}
                        style={this.props.style}
                        handlePlaceholderChange={this.handlePlaceholderChange}
                        placeholder={true}
                    />
                )}
            </div>
        )
    }
}

export default PlaceholderComponent
