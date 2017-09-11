import React from 'react'
import ReactDOM from 'react-dom'

import PropTypes from 'prop-types'

import Anchor from './Anchor'
import Icon from './Icon'
import Popover from './Popover'

import { ProximityIcon } from '@rover/react-icons'
import { MessagesIcon } from '@rover/react-icons'
import { ExperiencesIcon } from '@rover/react-icons'
import { AnalyticsIcon } from '@rover/react-icons'
import { CustomersIcon } from '@rover/react-icons'
import { SettingsIcon } from '@rover/react-icons'

import { GimbalIcon } from '@rover/react-icons'
import { XenioIcon } from '@rover/react-icons'

import { graphite } from './styles/colors'
import { text, light, bold, uppercase } from './styles/typography'

const { Component } = React

class AppSwitcher extends Component { 
    
    constructor(props) {
        super(props)

        this.state = {
            isShowingPopover: false
        }

        this.showPopover = this.showPopover.bind(this)
        this.hidePopover = this.hidePopover.bind(this)
    }

    render() {
        const { active, isGimbalEnabled, isXenioEnabled, style, children } = this.props

        const { isShowingPopover } = this.state

        const containerStyle = {
            ...AppSwitcher.defaultStyles.container,
            ...style.container
        }

        const logoStyle = {
            ...AppSwitcher.defaultStyles.logo,
            ...style.logo
        }

        const nameStyle = {
            ...AppSwitcher.defaultStyles.name,
            ...style.name
        }

        const switchStyle = {
            ...AppSwitcher.defaultStyles.switch,
            ...style.switch
        }

        const chevronStyle = {
            ...AppSwitcher.defaultStyles.chevron,
            ...style.chevron
        }

        const popoverStyle = {
            ...AppSwitcher.defaultStyles.popover,
            ...style.popover
        }

        const listStyle = {
            ...AppSwitcher.defaultStyles.list,
            ...style.list
        }

        const listItemStyle = {
            ...AppSwitcher.defaultStyles.listItem,
            ...style.listItem
        }

        const iconLinkStyle = {
            ...AppSwitcher.defaultStyles.iconLink,
            ...style.iconLink
        }

        const activeIconLinkStyle = {
            ...AppSwitcher.defaultStyles.activeIconLink,
            ...style.activeIconLink
        }

        const iconStyle = {
            ...AppSwitcher.defaultStyles.icon,
            ...style.icon
        }

        const disabledIconStyle = {
            ...AppSwitcher.defaultStyles.disabledIcon,
            ...style.disabledIcon
        }

        const labelStyle = {
            ...AppSwitcher.defaultStyles.label,
            ...style.label
        }

        const comingSoonStyle = {
            ...AppSwitcher.defaultStyles.comingSoon,
            ...style.comingSoonStyle
        }

        const renderProximityIcon = () => {
            if (isGimbalEnabled) {
                return (
                    <div style={listItemStyle}>
                        <Anchor href="https://manager.gimbal.com/" target="_blank" onClick={this.hidePopover} style={iconLinkStyle}>
                            <GimbalIcon style={iconStyle}/>
                        </Anchor>
                        <Anchor href="https://manager.gimbal.com/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Gimbal</Anchor>
                    </div>
                )
            } else if (isXenioEnabled) {
                return (
                    <div style={listItemStyle}>
                        <Anchor href="https://planner.xenioapps.com/" target="_blank" onClick={this.hidePopover} style={iconLinkStyle}>
                            <XenioIcon style={iconStyle}/>
                        </Anchor>
                        <Anchor href="https://planner.xenioapps.com/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Xenio Planner</Anchor>
                    </div>
                )
            } else {
                return (
                    <div style={listItemStyle}>
                        <Anchor href="/proximity/" target="_blank" onClick={this.hidePopover} style={active === 'proximity' ? activeIconLinkStyle : iconLinkStyle}>
                            <ProximityIcon style={iconStyle}/>
                        </Anchor>
                        <Anchor href="/proximity/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Proximity</Anchor>
                    </div>
                )
            }
        }

        return (
            <div style={containerStyle}>
                <Anchor to="/" style={logoStyle}>{this.props.children[0]}</Anchor>

                <Anchor to="/" style={nameStyle}>{this.props.children[1]}</Anchor>

                <Popover ref={ref => this.popover = ref} attachment={'top left'} targetAttachment={'bottom center'} isOpen={isShowingPopover} hideCloseButton={true} onRequestClose={this.hidePopover} style={popoverStyle}>
                    <Anchor ref={ref => this.switch = ref} style={switchStyle} onClick={this.showPopover}>
                        <Icon style={chevronStyle} type="chevron-down"/>
                    </Anchor>

                    <div style={listStyle}>
                        {renderProximityIcon()}
                        <div style={listItemStyle}>
                            <Anchor href="/messages/" target="_blank" onClick={this.hidePopover} style={active === 'messages' ? activeIconLinkStyle : iconLinkStyle}>
                                <MessagesIcon style={iconStyle}/>
                            </Anchor>
                            <Anchor href="/messages/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Messages</Anchor>
                        </div>
                        <div style={listItemStyle}>
                            <Anchor href="/experiences/" target="_blank" onClick={this.hidePopover} style={active === 'experiences' ? activeIconLinkStyle : iconLinkStyle}>
                                <ExperiencesIcon style={iconStyle}/>
                            </Anchor>
                            <Anchor href="/experiences/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Experiences</Anchor>
                        </div>
                        <div style={listItemStyle}>
                            <Anchor href="/audience/" target="_blank" onClick={this.hidePopover} style={active === 'audience' ? activeIconLinkStyle : iconLinkStyle}>
                                <CustomersIcon style={iconStyle}/>
                            </Anchor>
                            <Anchor href="/audience/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Audience</Anchor>
                        </div>
                        <div style={listItemStyle}>
                            <Anchor href="/settings/" target="_blank" onClick={this.hidePopover} style={active === 'settings' ? activeIconLinkStyle : iconLinkStyle}>
                                <SettingsIcon style={iconStyle}/>
                            </Anchor>
                            <Anchor href="/settings/" target="_blank" onClick={this.hidePopover} style={labelStyle}>Settings</Anchor>
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }

    componentDidUpdate() {
        const switchElement = ReactDOM.findDOMNode(this.switch)
        const switchRect = switchElement.getBoundingClientRect()
        
        if (this.popover.contentElement) {
            this.popover.contentElement.style.marginLeft = `${0 - switchRect.left - 20 + 14}px`
        }

        if (this.popover.arrowElement) {
            this.popover.arrowElement.style.left = `${switchRect.left -14 + 10}px`
        }
    }

    showPopover() {
        this.setState({
            isShowingPopover: true
        })
    }

    hidePopover() {
        this.setState({
            isShowingPopover: false
        })
    }
}

AppSwitcher.propTypes = {
    isGimbalEnabled: PropTypes.bool.isRequired,
    isXenioEnabled: PropTypes.bool.isRequired
}

AppSwitcher.defaultProps = {
    isGimbalEnabled: false,
    isXenioEnabled: false,
    style: {}
}

AppSwitcher.defaultStyles = {
    container: {
        alignItems: 'center',
        display: 'flex'
    },
    logo: { 
    },
    name: {
        ...text,
        ...bold,
        ...uppercase,
        color: graphite,
        marginLeft: 14
    },
    switch: {
        borderLeft: '1px solid #D8D8D8',
        borderRight: '1px solid transparent',
        marginLeft: 12,
        outline: 'none',
        paddingTop: 2,
        paddingRight: 12,
        paddingBottom: 2,
        paddingLeft: 12
    },
    chevron: { 
        display: 'block'
    },
    popover: {
        background: '#343A4C',
        padding: '30px 10px',
        arrow: {
            borderColor: '#343A4C'
        }
    },
    list: {
        display: 'flex'
    },
    listItem: {
        alignItems: 'center',
        display: 'flex',
        flex: 'none',
        flexDirection: 'column',
        width: 108
    },
    iconLink: {
        borderColor: 'transparent',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        marginBottom: 5,
        padding: 3
    },
    icon: {
        display: 'block'
    },
    label: {
        ...text,
        color: 'white'
    },
    comingSoon: {
        ...text,
        ...light,
        color: '#BED0FF',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 6
    }
}

AppSwitcher.defaultStyles.activeIconLink = {
    ...AppSwitcher.defaultStyles.iconLink,
    borderColor: '#939EC2'
}

AppSwitcher.defaultStyles.disabledIcon = {
    ...AppSwitcher.defaultStyles.icon,
    opacity: '0.5'
}

export default AppSwitcher
