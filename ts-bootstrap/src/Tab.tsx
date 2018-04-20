import * as React from 'react'
import { turquoise, black } from '../styles/colors'
import { regular, text, semibold, medium } from '../styles/typography'

export type TabProps = {
    val: string
    selected: string
    onClick: (val: string) => void
    tabStyle?: {
        container?: React.CSSProperties
        selection?: React.CSSProperties
    }
}

const Tab: React.SFC<TabProps> = ({ val, selected, onClick, tabStyle }) => {
    const container: React.CSSProperties = {
        ...text,
        ...medium,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: selected === val ? regular.fontWeight : semibold.fontWeight,
        color: selected === val ? black : turquoise,
        position: 'relative',
        ...tabStyle.container
    }

    const selection: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 2,
        background: turquoise,
        ...tabStyle.selection
    }

    const onTabClick = () => {
        const contentEditableText = document.getElementById(
            'contentEditableText'
        )

        if (
            contentEditableText &&
            contentEditableText.children[1] === document.activeElement
        ) {
            (contentEditableText.children[1] as HTMLElement).blur()
        }

        onClick(val)
    }

    return (
        <div style={container} onClick={() => onTabClick()}>
            {val}
            {selected === val ? <div style={selection} /> : <div />}
        </div>
    )
}

Tab.defaultProps = {
    tabStyle: {
        container: {},
        selection: {}
    }
}

export default Tab
