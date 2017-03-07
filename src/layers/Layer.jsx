import React, { Component, Children, PropTypes, cloneElement } from 'react'

import { slashes } from '../styles/backgrounds'
import { cloud, hexa, silver, steel, titanium } from '../styles/colors'
import { text, truncate } from '../styles/typography'

import TextField from '../forms/TextField'
import { PartialLockIcon } from '@rover/react-icons'
import { LockIcon } from '@rover/react-icons'

class Layer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isOver: false,
            isEditing: false
        }

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)
    }

    componentDidUpdate() {
        if (this.textField) {
            const input = this.textField.getInput()
            input.focus()
            input.setSelectionRange(0, input.value.length)
        }
    }

    render() {
        const { 
            name, 
            icon, 
            isHighlighted, 
            isSelected, 
            isLast, 
            lockStatus,
            onMouseEnter,
            onMouseLeave,
            onRequestSetLockStatus,
            onRequestSetName,
            primaryColor, 
            ...rest 
        } = this.props

        const style = {
            alignItems: 'center',
            background: lockStatus === 'locked' ? slashes : isSelected ? hexa({ hex: primaryColor, alpha: 0.1 }) : 'none',
            borderColor: cloud,
            borderStyle: 'solid',
            borderBottomWidth: isLast ? 0 : 1,
            cursor: 'default',
            display: 'flex',
            height: 36,
            paddingLeft: 10
        }

        return (
            <div 
                style={style} 
                onMouseEnter={this.onMouseEnter} 
                onMouseLeave={this.onMouseLeave} 
                onDoubleClick={this.onDoubleClick}
                {...rest}
            >
                {this.renderIcon()}
                {this.renderName()}
                {this.renderLockIcon()}
            </div>
        )
    }

    renderIcon() {
        const { icon, isHighlighted, isSelected, lockStatus, primaryColor } = this.props

        if (!icon) {
            return
        }

        const style = {
            flex: 'none',
            marginRight: 8,
            opacity: lockStatus === 'partial' || lockStatus === 'locked' ? 0.5 : 1,
            width: 12
        }

        const styledIcon = cloneElement(icon, {
            style: {
                display: 'block',
                fill: isHighlighted || isSelected ? primaryColor : silver,
                margin: '0 auto'
            }
        })

        return <div style={style}>{styledIcon}</div>
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
        const { isHighlighted, isSelected, lockStatus, name, primaryColor } = this.props

        const style = {
            ...text,
            ...truncate,
            color: isHighlighted || isSelected ? primaryColor : steel,
            flex: '1 0 0',
            fontSize: 12,
            opacity: lockStatus === 'partial' || lockStatus === 'locked' ? 0.5 : 1
        }

        return <div style={style}>{name}</div>
    }

    renderLockIcon() {
        const { lockStatus, primaryColor, onRequestSetLockStatus } = this.props
        const { isOver } = this.state

        const style = {
            flex: '0 0 auto',
            marginLeft: 8,
            marginRight: 10
        }

        const nextLockStatus = lockStatus === 'partial' ? 'locked' : lockStatus === 'locked' ? null : 'partial'

        const hasLock = Boolean(lockStatus)

        const iconStyle = {
            fill: isOver && !hasLock ? primaryColor : isOver ? steel : silver,
            opacity: isOver || hasLock ? 1 : 0
        }

        const Icon = lockStatus === 'locked' ? LockIcon : PartialLockIcon

        return (
            <div 
                style={style}
                onClick={e => {
                    e.stopPropagation()
                    onRequestSetLockStatus(nextLockStatus)
                }}
            >
                <Icon style={iconStyle}/>
            </div>
        )
    }

    onMouseEnter(event) {
        this.setState({
            isOver: true
        })
        this.props.onMouseEnter(event)
    }

    onMouseLeave(event) {
        this.setState({
            isOver: false
        })
        this.props.onMouseLeave(event)
    }

    onDoubleClick(event) {
        const { lockStatus } = this.props

        if (lockStatus === 'partial' || lockStatus === 'locked') {
            return
        }

        this.setState({
            isEditing: true
        })
    }
}

Layer.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.element,
    isHighlighted: PropTypes.bool,
    isLast: PropTypes.bool,
    primaryColor: PropTypes.string,
    lockStatus: PropTypes.oneOf(['locked', 'partial']),
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onRequestSetLockStatus: PropTypes.func.isRequired,
    onRequestSetName: PropTypes.func.isRequired
}

Layer.defaultProps = {
    isHighlighted: false,
    isLast: false,
    primaryColor: 'tomato',
    onMouseEnter: () => null,
    onMouseLeave: () => null,
    onRequestSetLockStatus: () => null,
    onRequestSetName: () => null
}

export default Layer
