import React from 'react'

import Anchor from './Anchor'
import Icon from './Icon'
import Popover from './Popover'

import { text, large, semibold, truncate } from '../styles/typography'
import { graphite } from '../styles/colors'

const { Component } = React

class AccountMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isShowingPopover: false
        }

        this.showPopover = this.showPopover.bind(this)
        this.hidePopover = this.hidePopover.bind(this)
        this.signOutDidClick = this.signOutDidClick.bind(this)
    }

    render() {

        const { style, children  } = this.props

        const { isShowingPopover } = this.state

        const { 
            popover: popoverStyle, 
            link: linkStyle, 
            linkHover: linkHoverStyle, 
            name: nameStyle, 
            chevron: chevronStyle, 
            container: containerStyle 
        } = this.styles(style)

        return (
            <Popover
                attachment={'top right'}
                targetAttachment={'bottom right'}
                targetOffset={'0 -6px'}
                hideCloseButton={true}
                isOpen={isShowingPopover}
                onRequestClose={this.hidePopover}
                style={popoverStyle}
            >
                <div style={containerStyle}>
                    <Anchor style={nameStyle} onClick={this.showPopover}>{children}</Anchor>
                    <Anchor style={chevronStyle} onClick={this.showPopover}>
                        <Icon type="chevron-down"/>
                    </Anchor>
                </div> 

                <div>
                    <Anchor style={linkStyle} hoverStyle={linkHoverStyle} href="/settings/" target="_blank" onClick={this.hidePopover}>Rover Settings</Anchor>
                    <Anchor style={linkStyle} hoverStyle={linkHoverStyle} onClick={this.signOutDidClick}>Sign Out</Anchor>
                </div>
            </Popover>
        )
    }

    styles(overrides) {
        const { popover, link, linkHover, name, chevron, ...container } = overrides

        const defaultPopover = {
            paddingBottom: 7,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 7,
            width: 170
        }

        const defaultLink = {
            ...text,
            ...large,
            ...truncate,
            display: 'block',
            height: 40,
            lineHeight: '40px',
            padding: '0 18px'
        }

        const defaultLinkHover = {    
            background: '#F5F5F5'
        }

        const defaultName = { 
            ...text,
            ...semibold,
            color: graphite,
            marginRight: 10
        }

        const defaultChevron = {
            outline: 'none'
        }

        const defaultContainer = {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'flex-end'
        }

        return {
            popover: { ...defaultPopover, ...popover },
            link: { ...defaultLink, ...link },
            linkHover: { ...defaultLinkHover, ...linkHover },
            name: { ...defaultName, ...name },
            chevron: { ...defaultChevron, ...chevron },
            container: { ...defaultContainer, ...container }
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

    signOutDidClick() {
        this.props.onRequestSignOut()
        this.hidePopover()
    }
}

AccountMenu.defaultProps = {
    style: {},
    onRequestSignOut: () => null
}

export default AccountMenu
