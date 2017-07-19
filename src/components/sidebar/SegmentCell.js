import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    steel,
    lavender,
    text,
    silver,
    Tooltip,
    graphite,
    ModalWithHeader,
    TextField,
    violet,
    orchid,
    regular,
    bold,
    ash
} from '@rover/react-bootstrap'

import {
    PencilEditIcon,
    TrashIcon,
    CancelIcon,
    CheckmarkIcon
} from '@rover/react-icons'

class SegmentCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showIcons: false,
            hoverOverIcon: '',
            toolTip: {
                isToolTipShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            },
            isEdittingName: false,
            segmentName: '',
            isDeleteModalShowing: false
        }
        this.onCellHover = this.onCellHover.bind(this)
        this.onMouseClickEdit = this.onMouseClickEdit.bind(this)
        this.handleMouseOverIcon = this.handleMouseOverIcon.bind(this)
        this.handleMouseLeaveIcon = this.handleMouseLeaveIcon.bind(this)
        this.onMouseClickDelete = this.onMouseClickDelete.bind(this)
        this.setSegmentName = this.setSegmentName.bind(this)
        this.handleRename = this.handleRename.bind(this)
        this.displayIcons = this.displayIcons.bind(this)
        this.handleEditSave = this.handleEditSave.bind(this)
        this.handleEditCancel = this.handleEditCancel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.displayDeletionConfirmation = this.displayDeletionConfirmation.bind(
            this
        )
        this.deleteTextContent = this.deleteTextContent.bind(this)
    }

    onCellHover(val) {
        this.setState({ showIcons: val })
    }

    onMouseClickEdit() {
        const { segment } = this.props

        this.setState({
            isEdittingName: true,
            segmentName: segment
        })
    }

    handleMouseOverIcon(e, name) {
        const { showIcons, isEdittingName } = this.state
        const t = document.getElementById(name).getBoundingClientRect()

        this.setState({
            hoverOverIcon: name
        })
        setTimeout(() => {
            if (
                this.state.hoverOverIcon === name &&
                showIcons &&
                !isEdittingName
            ) {
                this.setState({
                    toolTip: {
                        isToolTipShowing: true,
                        message: name,
                        coordinates: {
                            x: t.left,
                            y: t.top + 12,
                            divWidth: t.width
                        }
                    }
                })
            }
        }, 500)
    }

    handleMouseLeaveIcon() {
        this.setState({
            hoverOverIcon: '',
            toolTip: {
                isToolTipShowing: false,
                message: '',
                coordinates: {
                    x: 0,
                    y: 0,
                    divWidth: 0
                }
            }
        })
    }

    handleRename(e) {
        this.setState({
            segmentName: e.target.value
        })
    }

    setSegmentName() {
        const { isEdittingName, segmentName } = this.state
        const { segment } = this.props
        let name

        if (isEdittingName) {
            name = (
                <TextField
                    placeholder={segment}
                    value={segmentName}
                    style={{
                        width: 150,
                        fontSize: 14,
                        focus: { borderColor: silver },
                        color: 'white',
                        borderColor: silver
                    }}
                    onChange={this.handleRename}
                />
            )
        } else {
            name = (
                <div
                    style={{
                        ...text,
                        ...regular,
                        fontSize: 15,
                        color: lavender,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {segment}
                </div>
            )
        }
        return name
    }

    handleEditSave() {
        const { updateSegmentCell, index } = this.props
        const { segmentName } = this.state

        updateSegmentCell(index, segmentName)
        this.setState({
            isEdittingName: false,
            segmentName: ''
        })
    }

    handleEditCancel() {
        this.setState({
            isEdittingName: false,
            segmentName: ''
        })
    }

    displayIcons() {
        const { showIcons, isEdittingName } = this.state
        const { index } = this.props
        let icons

        if (showIcons) {
            icons = (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        onClick={() => this.onMouseClickEdit(index)}
                        id="rename"
                        onMouseOver={e => this.handleMouseOverIcon(e, 'rename')}
                        onMouseLeave={this.handleMouseLeaveIcon}
                        style={{
                            pointerEvents: 'auto',
                            marginRight: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 6
                        }}
                    >
                        <PencilEditIcon
                            fill={silver}
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                    <div
                        style={{
                            marginRight: 19,
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        id="trash"
                        onMouseOver={e => this.handleMouseOverIcon(e, 'trash')}
                        onMouseLeave={this.handleMouseLeaveIcon}
                        onClick={() => this.onMouseClickDelete(index)}
                    >
                        <TrashIcon
                            fill={silver}
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                </div>
            )
        }

        if (isEdittingName) {
            icons = (
                <div
                    style={{
                        display: 'flex',
                        flex: 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{ marginRight: 4, marginTop: 2 }}>
                        <div
                            onClick={() => this.handleEditSave()}
                            style={{
                                height: 20,
                                width: 20,
                                backgroundColor: violet,
                                borderRadius: 4,
                                display: 'flex',
                                flex: 'none',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CheckmarkIcon fill="white" />
                        </div>
                    </div>
                    <div style={{ marginRight: 19, marginTop: 2 }}>
                        <div
                            onClick={() => this.handleEditCancel()}
                            style={{
                                height: 20,
                                width: 20,
                                backgroundColor: silver,
                                borderRadius: 4,
                                display: 'flex',
                                flex: 'none',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CancelIcon fill="white" />
                        </div>
                    </div>
                </div>
            )
        }
        return icons
    }

    onMouseClickDelete(index) {
        this.setState({
            isDeleteModalShowing: true
        })
    }

    handleDelete(val) {
        if (val) {
            this.props.removeSegmentCell(this.props.index)
        }
        this.setState({
            isDeleteModalShowing: false
        })
    }

    displayDeletionConfirmation() {
        const { isDeleteModalShowing } = this.state

        if (isDeleteModalShowing) {
            return (
                <ModalWithHeader
                    contentLabel="segmentDelete"
                    backgroundColor={graphite}
                    modalHeaderStyle={{
                        backgroundColor: graphite,
                        height: 20
                    }}
                    children={this.deleteTextContent()}
                    successFn={() => this.handleDelete(true)}
                    successText="Confirm"
                    cancelFn={() => this.handleDelete()}
                    cancelText="Cancel"
                    primaryColor={violet}
                    hoverColor={orchid}
                    secondaryColor={lavender}
                    isOpen={isDeleteModalShowing}
                    bodyOpenClassName="bodyClassName"
                    hoverStyle={{
                        backgroundColor: steel
                    }}
                />
            )
        }
    }

    deleteTextContent() {
        const { segment } = this.props
        return (
            <div style={{ ...text, ...regular, color: 'white', fontSize: 16 }}>
                <span style={{ ...bold }}>{segment}</span> will be deleted
            </div>
        )
    }

    render() {
        const { showIcons, isEdittingName } = this.state
        const { isToolTipShowing, message, coordinates } = this.state.toolTip

        return (
            <div>
                {this.displayDeletionConfirmation()}
                <div
                    style={{
                        borderTop: '1px solid',
                        borderColor: steel,
                        paddingLeft: 18,
                        height: 42,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: (showIcons) ? ash : graphite
                    }}
                    onMouseOver={() => this.onCellHover(true)}
                    onMouseLeave={() => this.onCellHover(false)}
                >
                    {this.setSegmentName()}
                    {this.displayIcons()}
                    {isToolTipShowing &&
                        showIcons &&
                        !isEdittingName &&
                        <Tooltip
                            message={message}
                            coordinates={coordinates}
                            backgroundColor="black"
                            stylePosition="fixed"
                            position="bottom"
                        />}
                </div>
            </div>
        )
    }
}

SegmentCell.propTypes = {
    segment: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    removeSegmentCell: PropTypes.func.isRequired,
    updateSegmentCell: PropTypes.func.isRequired
}

SegmentCell.defaultProps = {
    updateSegmentCell: () => null,
    removeSegmentCell: () => null,
    index: 0,
    segment: ''
}

export default SegmentCell
