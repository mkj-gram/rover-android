import React from 'react'

import Anchor from './Anchor'

import { steel } from './styles/colors'

const { Component } = React

class TabBar extends Component {

    render() {
        const { primaryColor, tabs = [], activeTab, onClick } = this.props

        let { style = {} } = this.props

        style = {
            root: {
                display: 'flex',
                justifyContent: 'center',
                height: 60,
                paddingBottom: 4,
                position: 'relative'
            },
            tab: {
                alignItems: 'center',
                color: steel,
                display: 'flex',
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '20px',
                padding: '3px 20px 0 20px'
            },
            count: {
                background: '#BCBCBC',
                borderRadius: 10,
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: '16px',
                marginLeft: 6,
                padding: '0 7px',
                transition: 'background-color 0.2s'
            },
            underline: {
                background: primaryColor,
                bottom: 0,
                display: 'block',
                height: 4,
                position: 'absolute',
                transition: 'left 0.2s, width 0.2s'
            }
        }

        style.activeCount = {
            ...style.count,
            background: primaryColor
        }

        const anchors = tabs.map(t => {
            let ref, countStyle = style.count
            if (t.id === activeTab) {
                ref = e => this.activeTab = e
                countStyle = style.activeCount
            }

            let count
            if (t.count > 0) {
                count = <span style={countStyle}>{t.count}</span>
            }

            return (
                <Anchor ref={ref} key={t.id} style={style.tab} onClick={() => onClick(t)}>
                    {t.name}
                    {count}
                </Anchor>
            )  
        })

        return (
            <div ref={e => this.root = e} style={style.root}>
                {anchors}
                <div ref={e => this.underline = e} style={style.underline}></div>
            </div>
        )
    }

    componentDidMount() {
        this.positionUnderline()
    }

    componentDidUpdate() {
        this.positionUnderline()
    }

    positionUnderline() {
        if (!this.activeTab) {
            return
        }

        const rootRect = this.root.getBoundingClientRect()
        const activeTabRect = this.activeTab.element.getBoundingClientRect()

        this.underline.style.left = `${activeTabRect.left - rootRect.left}px`
        this.underline.style.width = `${activeTabRect.width}px`
    }
}

TabBar.defaultProps = {
    primaryColor: 'tomato',
    onClick: () => null
}

export default TabBar
