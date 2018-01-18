import * as React from 'react'

type TabBarProps = {
    children: JSX.Element[] | JSX.Element
    containerStyle?: React.CSSProperties
}

const TabBar: React.SFC<TabBarProps> = ({ children, containerStyle }) => {
    const container: React.CSSProperties = {
        height: 56,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        ...containerStyle
    }

    return <div style={container}>{children}</div>
}

export default TabBar
