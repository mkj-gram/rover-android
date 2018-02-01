/* tslint:disable no-any */
/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { charcoal } from '../styles/colors'

export interface Props
    extends StringMap<
            string | StringMap<string | number> | Function | boolean
        > {
    html: string
    onChange: (val: string) => void
    onBlur?: (evt: any) => void
    style?: StringMap<string | number>
    placeholder: boolean
}

class ContentEditable extends React.Component<Props, {}> {
    private htmlEl: HTMLElement = undefined
    private lastHtml: string = undefined

    constructor(props: Props) {
        super(props)
        this.emitChange = this.emitChange.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onPaste = this.onPaste.bind(this)
    }

    shouldComponentUpdate(nextProps: Props) {
        let { props, htmlEl } = this

        // We need not rerender if the change of props simply reflects the user's edits.
        // Rerendering in this case would make the cursor/caret jump
        // Rerender if there is no element yet... (somehow?)
        if (!htmlEl) {
            return true
        }

        // ...or if html really changed... (programmatically, not by user edit)
        if (
            nextProps.html !== htmlEl.innerHTML &&
            nextProps.html !== props.html
        ) {
            return true
        }

        const optional = ['style', 'className', 'disable', 'tagName']

        // Handle additional properties
        return optional.some(name => props[name] !== nextProps[name])
    }

    componentDidUpdate() {
        if (this.htmlEl && this.props.html !== this.htmlEl.innerHTML) {
            // Perhaps React (whose VDOM gets outdated because we often prevent
            // rerendering) did not update the DOM. So we update it manually now.
            this.htmlEl.innerHTML = this.props.html
        }
    }

    emitChange(evt: any) {
        if (!this.htmlEl) {
            return
        }
        var html = this.htmlEl.innerHTML
        if (this.props.onChange && html !== this.lastHtml) {
            evt.target = { value: html }
            this.props.onChange(html as string)
        }
        this.lastHtml = html
    }

    onFocus(evt: any) {
        if (!this.htmlEl) {
            return
        }
        if (this.props.placeholder && this.lastHtml === undefined) {
            this.htmlEl.innerHTML = ''
            var html = this.htmlEl.innerHTML

            evt.target = { value: html }

            this.props.onChange(html as string)
            this.lastHtml = html
            this.htmlEl.style.color = charcoal
        }
    }

    onPaste(evt: any) {
        evt.preventDefault()
        var text = evt.clipboardData.getData('text')
        document.execCommand('insertText', false, text)
    }

    render() {
        var { html, ...props } = this.props
        return (
            <div>
                <style type="text/css">
                    {`
                    [contenteditable]:focus {outline: 1px solid transparent;}
                `}
                </style>
                {React.createElement(
                    'div',
                    {
                        ...props,
                        ref: (e: HTMLElement) => (this.htmlEl = e),
                        onInput: this.emitChange,
                        onBlur: this.props.onBlur || this.emitChange,
                        onPaste: this.onPaste,
                        onFocus: this.onFocus,
                        contentEditable: true,
                        dangerouslySetInnerHTML: { __html: html }
                    },
                    this.props.children
                )}
            </div>
        )
    }
}
export default ContentEditable
