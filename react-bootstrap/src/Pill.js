import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { light, text } from './styles/typography'
import { silver, titanium, steel, graphite, straw, ash } from './styles/colors'

import { TagIcon, CancelIcon } from '@rover/react-icons'

class Pill extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteButtonColor: ''
        }
        this.isHighlightPill = this.isHighlightPill.bind(this)
    }

    handleMouseEventPill(type) {
        if (!this.isHighlightPill()) {
            if (type === 'over') {
                this.setState({
                    deleteButtonColor: steel
                })
            } else if (type === 'leave') {
                this.setState({
                    deleteButtonColor: ''
                })
            }
        }
    }

    isHighlightPill() {
        const { onHighlight, index, highlightIndex } = this.props
        return onHighlight && index === highlightIndex
    }

    render() {
        let {
            height,
            icon,
            backgroundColor,
            tagIconColor,
            textColor,
            deleteButtonBackground,
            deleteButtonColor,
            onHighlight,
            onHighlightBackgroundColor,
            onHighlightTagIconColor,
            onHighlightTextColor,
            onHighlightDeleteButtonBackground,
            onHighlightDeleteButtonColor,
            onHoverDeleteButtonBackground,
            onHoverDeleteButtonColor,
            maxWidth
        } = this.props

        const getIconFill = () => {
            return this.isHighlightPill()
                ? onHighlightTagIconColor
                : tagIconColor
        }
        const getBackgroundColor = () => {
            return this.isHighlightPill()
                ? onHighlightBackgroundColor
                : backgroundColor
        }

        const getTextColor = () => {
            return this.isHighlightPill() ? onHighlightTextColor : textColor
        }

        const getDeleteButtonColor = () => {
            return this.isHighlightPill()
                ? onHighlightDeleteButtonColor
                : deleteButtonColor
        }

        const tagIcon = () => {
            return (
                <div
                    style={{
                        marginLeft: 11,
                        marginRight: 8,
                        width: 12,
                        height: 12
                    }}
                >
                    {icon && (
                        <TagIcon
                            fill={getIconFill()}
                            style={{
                                pointerEvents: 'none',
                                transform: 'scale(.75)'
                            }}
                        />
                    )}
                </div>
            )
        }

        const getText = () => {
            return (
                <div
                    style={{
                        display: 'inline-block',
                        ...text,
                        ...light,
                        fontSize: 14,
                        color: getTextColor(),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        maxWidth: maxWidth - 65
                    }}
                >
                    {this.props.text}
                </div>
            )
        }

        const getDeleteButton = () => {
            return (
                <div
                    style={{
                        height: 16,
                        width: 16,
                        marginLeft: 8,
                        marginRight: 6,
                        background: this.state.deleteButtonColor,
                        borderRadius: 23,
                        display: 'flex',
                        flex: 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseDown={() =>
                        this.props.updateTags(null, 'delete', this.props.index)}
                >
                    <CancelIcon
                        fill={getDeleteButtonColor()}
                        style={{ pointerEvents: 'none' }}
                    />
                </div>
            )
        }
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height,
                    backgroundColor: getBackgroundColor(),
                    borderRadius: 23,
                    marginRight: 8,
                    marginTop: 4,
                    marginBottom: 4
                }}
                onMouseOver={e => this.handleMouseEventPill('over')}
                onMouseLeave={e => this.handleMouseEventPill('leave')}
            >
                {tagIcon()}
                {getText()}
                {getDeleteButton()}
            </div>
        )
    }
}

Pill.propTypes = {
    height: PropTypes.number,
    icon: PropTypes.bool,
    text: PropTypes.string.isRequired,
    maxWidth: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string,
    tagIconColor: PropTypes.string,
    textColor: PropTypes.string,
    deleteButtonBackground: PropTypes.string,
    deleteButtonColor: PropTypes.string,
    onHighlight: PropTypes.bool,
    onHighlightBackgroundColor: PropTypes.string,
    onHighlightTagIconColor: PropTypes.string,
    onHighlightTextColor: PropTypes.string,
    onHighlightDeleteButtonColor: PropTypes.string,
    onHighlightDeleteButtonBackground: PropTypes.string,
    onHoverDeleteButtonBackground: PropTypes.string,
    onHoverDeleteButtonColor: PropTypes.string,
    index: PropTypes.number,
    highlightIndex: PropTypes.number,
    updateTags: PropTypes.func
}

Pill.defaultProps = {
    height: 28,
    icon: true,
    text: 'Hiking',
    //defaultState
    backgroundColor: ash,
    tagIconColor: silver,
    textColor: titanium,
    deleteButtonBackground: null,
    deleteButtonColor: silver,
    //onHighlightState
    onHighlight: false,
    onHighlightBackgroundColor: straw,
    onHighlightTagIconColor: ash,
    onHighlightTextColor: graphite,
    onHighlightDeleteButtonBackground: null,
    onHighlightDeleteButtonColor: steel,
    //onHover
    onHoverDeleteButtonBackground: steel,
    onHoverDeleteButtonColor: 'white',
    maxWidth: 370,
    index: null,
    highlightIndex: null,
    updateTags: () => null
}

export default Pill
