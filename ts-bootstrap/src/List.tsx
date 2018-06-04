import * as React from 'react'
import { quartz } from '../styles/colors'

export interface ListProps {
    separationElement?: JSX.Element
    addElement?: JSX.Element
    children: JSX.Element[]
    containerStyle?: React.CSSProperties
}

export interface ListSeparatorProps {
    children?: JSX.Element
}

const ListSeparator: React.SFC<ListSeparatorProps> = ({ children }) => {
    return (
        <div
            style={{
                minHeight: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '8px 0',
                boxSizing: 'border-box'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 24,
                    height: '100%',
                    width: 4,
                    background: quartz
                }}
            />
            {children}
        </div>
    )
}

const List: React.SFC<ListProps> = ({
    separationElement,
    addElement,
    children,
    containerStyle
}) => {
    const { Fragment } = React

    return (
        <Fragment>
            <ListSeparator>{separationElement}</ListSeparator>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    background: quartz,
                    borderRadius: 4,
                    ...containerStyle
                }}
            >
                {children}
            </div>

            {addElement && (
                <Fragment>
                    <ListSeparator />
                    <div
                        style={{
                            marginLeft: 13
                        }}
                    >
                        {addElement}
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default List
