import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { cloud, offwhite, Popover, purple, text, silver } from '@rover/react-bootstrap'
import { TestDeviceIcon, PencilIcon, VerticalEllipseIcon } from '@rover/react-icons'

const style = {
    height: 50,
    width: 24,
    background: 'white',
    border: `1px solid ${cloud}`,
    borderTop: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    right: 0,
    zIndex: 1
}

class RowActionButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ellipseColor: silver,
            listItemColor: 'white',
            isPopoverOpen: false
        }
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.setState({ isPopoverOpen: true })
    }

    onMouseOver() {
        this.setState({ ellipseColor: purple })
    }

    onMouseOut() {
        this.setState({ ellipseColor: silver })
    }

    onPopoverClose() {
        this.setState({ isPopoverOpen: false })
    }

    getListItem(val) {
             const listItemStyle = {
                ...text,
                color: silver,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 15,
                height: 40,
                position: 'relative'
            }
            const { currentListItem } = this.state
            const { handleClick } = this.props

            const getIcon = {
                device: PencilIcon({ fill: (currentListItem === 'device' ? purple : silver) }),
                test: TestDeviceIcon({ fill: (currentListItem === 'test' ? purple : silver) })
            }

            return (
                 <div
                    style={{
                        ...listItemStyle,
                        backgroundColor: currentListItem === val ? offwhite : 'white',
                        color: currentListItem === val ? purple : silver
                        }}
                    onClick={() => handleClick(val === 'device' ? 'Attributes' : 'Testing')}
                    onMouseOver={() => this.setState({ currentListItem: val })}
                >
                    {getIcon[val]}
                    <div
                        style={{
                            position: 'absolute',
                            left: 40
                        }}
                    >
                        {val === 'device' ? 'Device Info' : 'Testing'}
                    </div>
                </div>
            )
        }

    render() {
        const { rowId, isButtonShowing } = this.props
        const { ellipseColor, isPopoverOpen } = this.state

        const getOffSet = () => rowId > 5 ? '100 40' : '60 40'

        return (
            <div>
                <Popover
                    attachment={'top right'}
                    targetAttachment={'bottom center'}
                    offset={getOffSet()}
                    isOpen={isPopoverOpen}
                    onRequestClose={() => this.onPopoverClose()}
                    hideCloseButton
                    style={{
                        arrow: {
                            display: 'none'
                        },
                        padding: '0px 0px 0px 0px',
                        overflow: 'hidden'
                    }}
                >
                    {(isButtonShowing || isPopoverOpen)
                        ? <div
                            style={style}
                            onMouseOver={() => this.onMouseOver()}
                            onMouseOut={() => this.onMouseOut()}
                            onClick={this.onClick}
                        >
                            <VerticalEllipseIcon fill={ellipseColor} width="4px" height="16px" />
                        </div>
                        : <div style={{ ...style, zIndex: 0 }} />
                    }
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 235
                        }}
                        onMouseLeave={() => this.setState({ isPopoverOpen: false })}
                    >
                        {this.getListItem('device')}
                        {this.getListItem('test')}
                    </div>
                </Popover>
            </div>
        )
    }
}

RowActionButton.propTypes = {
    handleClick: PropTypes.func,
    isButtonShowing: PropTypes.bool.isRequired,
    rowId: PropTypes.number.isRequired
}

RowActionButton.defaultProps = {
    handleClick: () => console.log('RowActionButton Clicked')
}

export default RowActionButton
