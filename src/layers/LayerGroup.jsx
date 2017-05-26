import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'

import { ArrowIconDown } from '@rover/react-icons'
import { ArrowIconRight } from '@rover/react-icons'

import { cloud, hexa, silver, steel, titanium } from '../styles/colors'
import { text, truncate } from '../styles/typography'

import TextField from '../forms/TextField'

class LayerGroup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            isOverArrow: false
        }
    }

    componentDidUpdate() {
        if (this.textField) {
            const input = this.textField.getInput()
            input.focus()
            input.setSelectionRange(0, input.value.length)
        }
    }

    render() {
        let { isCollapsed, isSelected, isEmpty, onMouseEnter, onMouseLeave, onClick, primaryColor, style } = this.props

        style = {
            alignItems: 'center',
            backgroundColor: isSelected ? hexa({ hex: primaryColor, alpha: 0.1 }) : 'transparent',
            borderWidth: (isCollapsed || isEmpty) ? '1px 0 0 0' : '1px 0',
            borderColor: cloud,
            borderStyle: 'solid',
            cursor: 'default',
            display: 'flex',
            height: 36,
            paddingLeft: 5,
            paddingBottom: (isCollapsed || isEmpty) ? 1 : 0,
            marginBottom: (isCollapsed || isEmpty) ? -1 : 0,
            ...style
        }

        return (
            <div>
                <div 
                    style={style}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onClick}
                    onDoubleClick={e => this.setState({ isEditing: true })}
                >
                    {this.renderArrow()}
                    {this.renderIcon()}
                    {this.renderName()}
                </div>
                {this.renderLayers()}
            </div>
        )
    }

    renderArrow() {
        const { isCollapsed, onRequestExpand, onRequestCollapse } = this.props
        const { isOverArrow } = this.state

        const style = {
            alignItems: 'center',
            backgroundColor: isOverArrow ? cloud : 'transparent',
            borderRadius: 7,
            display: 'flex',
            fill: steel,
            flex: 'none',
            height: 14,
            justifyContent: 'center',
            marginRight: 5,
            width: 14
        }

        const onClick = event => {
            event.stopPropagation()

            this.props.isCollapsed ? onRequestExpand() : onRequestCollapse()
        }

        const onMouseEnter = event => {
            this.setState({
                isOverArrow: true
            })
        }

        const onMouseLeave = event => {
            this.setState({
                isOverArrow: false
            })
        }

        const Icon = isCollapsed ? ArrowIconRight : ArrowIconDown

        return (
            <div 
                style={style}
                onClick={onClick} 
                onMouseEnter={onMouseEnter} 
                onMouseLeave={onMouseLeave}
            >
                <Icon/>
            </div>
        )
    }

    renderIcon() {
        const { icon, isHighlighted, isSelected, primaryColor } = this.props

        if (!icon) {
            return
        }

        return cloneElement(icon, {
            style: {
                fill: isHighlighted || isSelected ? primaryColor : silver,
                flex: 'none',
                marginRight: 7
            }
        })
    }

    renderName() {
        return this.state.isEditing ? this.renderTextField() : this.renderLabel()
    }

    renderTextField() {
        const { onRequestSetName } = this.props

        const style = {
            background: 'white',
            flex: '1 0 0',
            fontSize: 12,
            marginRight: 10,
            focus: {
                borderColor: titanium
            }
        }

        return (
            <TextField 
                ref={textField => this.textField = textField}
                defaultValue={this.props.name}
                style={style}
                onBlur={e => {
                    onRequestSetName(e.target.value)
                    this.setState({ isEditing: false })
                }}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        this.textField.getInput().blur()
                    }
                }}
            />
        )
    }

    renderLabel() {
        const { isHighlighted, isSelected, name, primaryColor } = this.props

        const style = {
            ...text,
            ...truncate,
            color: isHighlighted || isSelected ? primaryColor : steel,
            fontSize: 12,
            marginRight: 10
        }

        return <div style={style}>{name}</div>
    }

    renderLayers() {
        if (this.props.isCollapsed) {
            return
        }

        const { children } = this.props

        const style = {
            paddingLeft: 30
        }

        return <div style={style}>{children}</div>
    }
}

LayerGroup.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.element,
    isCollapsed: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    primaryColor: PropTypes.string,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onRequestSetName: PropTypes.func.isRequired,
    onRequestExpand: PropTypes.func.isRequired,
    onRequestCollapse: PropTypes.func.isRequired
}

LayerGroup.defaultProps = {
    isCollapsed: false,
    isEmpty: false,
    isHighlighted: false,
    isSelected: false,
    isLast: false,
    primaryColor: 'tomato',
    onMouseEnter: () => null,
    onMouseLeave: () => null,
    onClick: () => null,
    onRequestSetName: () => null,
    onRequestExpand: () => null,
    onRequestCollapse: () => null
}

export default LayerGroup
