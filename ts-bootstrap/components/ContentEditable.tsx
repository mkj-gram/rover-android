/* tslint:disable no-any */
/// <reference path="../typings/index.d.ts" />
import * as React from 'react'
import { charcoal } from '../styles/colors'

export interface Props
    extends StringMap<
            | string
            | StringMap<string | number>
            | Function
            | boolean
            | React.CSSProperties
        > {
    html: string
    onChange: (val: string) => void
    onBlur?: (evt: any) => void
    style?: React.CSSProperties
    id?: string
    onBlurChange?: boolean
    handlePlaceholderChange?: (val: string) => void
    placeholder?: boolean
    handleBlurChange?: (val: string) => void
    onInputChange?: (input: string) => void
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

        if (document.activeElement === htmlEl) {
            return false
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
        const { html, id } = this.props
        if (this.htmlEl && html !== this.htmlEl.innerHTML) {
            this.htmlEl.innerHTML = html
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress, false)

        this.placeCaretAtEnd(document.getElementById(this.props.id))
    }

    handleTouchStart(e: Event) {
        this.emitChange(e, true)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress, false)
    }

    handleKeyPress(e: KeyboardEvent) {
        if (e.keyCode === 13) {
            this.props.onChange(this.sanitizeHTML(this.htmlEl.innerHTML))
        }
    }

    placeCaretAtEnd(el: any) {
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
        const { handleBlurChange, html, onChange, onBlurChange } = this.props

        if (!this.htmlEl || !onBlurChange) {
            if (!byPassTargetSet) {
                evt.target = { value: html }
            }
            if (handleBlurChange) {
                handleBlurChange(html as string)
            } else {
                onChange(html as string)
            }

            return
        }

        const sanitizedHtml: string = this.sanitizeHTML(this.htmlEl.innerHTML)

        if ((onChange || handleBlurChange) && sanitizedHtml !== this.lastHtml) {
            if (!byPassTargetSet) {
                evt.target = { value: sanitizedHtml }
            }

            if (handleBlurChange) {
                handleBlurChange(sanitizedHtml)
            } else {
                onChange(sanitizedHtml)
            }
        }
        this.lastHtml = sanitizedHtml
    }

    onInput(evt: any) {
        const { handlePlaceholderChange, onInputChange } = this.props
        if (!this.htmlEl) {
            return
        }

        const sanitizedHtml: string = this.htmlEl.innerHTML
            .replace(/&nbsp;/g, ' ')
            .replace(/<br>/g, '')
        if (handlePlaceholderChange) {
            handlePlaceholderChange(sanitizedHtml)
        }

        if (onInputChange) {
            onInputChange(sanitizedHtml)
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

    sanitizeHTML(html: string): string {
        return html
            .replace(/&nbsp;/g, ' ')
            .replace(/<br>/g, '')
            .replace(/\s*$/, '')
    }

    render() {
        var { html, id, ...props } = this.props

        return (
            <div id="contentEditableText">
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
