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
    id?: string
    onBlurChange?: boolean
    handlePlaceholderChange?: (val: string) => void
    placeholder?: boolean
    handleBlurChange?: (val: string) => void
}

class ContentEditable extends React.Component<Props, {}> {
    private htmlEl: HTMLElement = undefined
    private lastHtml: string = undefined

    constructor(props: Props) {
        super(props)
        this.emitChange = this.emitChange.bind(this)
        this.onPaste = this.onPaste.bind(this)
        this.placeCaretAtEnd = this.placeCaretAtEnd.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.onInput = this.onInput.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.handleTouchStart = this.handleTouchStart.bind(this)
    }

    shouldComponentUpdate(nextProps: Props) {
        let { props, htmlEl } = this

        if (!htmlEl) {
            return true
        }

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
            this.htmlEl.innerHTML = this.props.html
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress, false)
        document.addEventListener('touchstart', this.handleTouchStart, false)

        this.placeCaretAtEnd(document.getElementById(this.props.id))
    }

    handleTouchStart(e: Event) {
        this.emitChange(e, true)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress, false)
        document.removeEventListener('touchstart', this.handleTouchStart, false)
    }

    handleKeyPress(e: KeyboardEvent) {
        if (e.keyCode === 13) {
            this.props.onChange(this.htmlEl.innerHTML
                .replace(/&nbsp;/g, ' ')
                .replace(/<br>/g, '')
                .replace(/\s*$/, '') as string)
        }
    }

    placeCaretAtEnd(el: any) {
        el.focus()
        if (
            typeof window.getSelection != 'undefined' &&
            typeof document.createRange != 'undefined'
        ) {
            var range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            var sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        } else if (typeof el.createTextRange != 'undefined') {
            var textRange = el.createTextRange()
            textRange.moveToElementText(el)
            textRange.collapse(false)
            textRange.select()
        }
    }

    emitChange(evt: any, byPassTargetSet: boolean = false) {
        if (!this.htmlEl || !this.props.onBlurChange) {
            if (!byPassTargetSet) {
                evt.target = { value: this.props.html }
            }
            if (this.props.handleBlurChange) {
                this.props.handleBlurChange(this.props.html as string)
            } else {
                this.props.onChange(this.props.html as string)
            }

            return
        }

        var html = this.htmlEl.innerHTML
            .replace(/&nbsp;/g, ' ')
            .replace(/<br>/g, '')
            .replace(/\s*$/, '')

        if (
            (this.props.onChange || this.props.handleBlurChange) &&
            html !== this.lastHtml
        ) {
            if (!byPassTargetSet) {
                evt.target = { value: html }
            }

            if (this.props.handleBlurChange) {
                this.props.handleBlurChange(html as string)
            } else {
                this.props.onChange(html as string)
            }
        }
        this.lastHtml = html
    }

    onInput(evt: any) {
        if (!this.htmlEl) {
            return
        }

        if (this.props.handlePlaceholderChange !== undefined) {
            this.props.handlePlaceholderChange(this.htmlEl.innerHTML
                .replace(/&nbsp;/g, ' ')
                .replace(/<br>/g, '')
                .replace(/\s*$/, '') as string)
        }
    }

    onPaste(evt: any) {
        evt.preventDefault()
        var text = evt.clipboardData.getData('text')
        document.execCommand('insertText', false, text)
    }

    onFocus(evt: any) {
        if (!this.htmlEl) {
            return
        }

        this.htmlEl.style.color = (this.props.style.color as string) || 'black'
    }

    render() {
        var { html, id, ...props } = this.props

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
                        style: props.style,
                        ref: (e: HTMLElement) => (this.htmlEl = e),
                        onInput: this.onInput,
                        onBlur: this.emitChange,
                        onPaste: this.onPaste,
                        contentEditable: true,
                        dangerouslySetInnerHTML: { __html: html },
                        id: id,
                        onFocus: this.onFocus
                    },
                    this.props.children
                )}
            </div>
        )
    }
}
export default ContentEditable
