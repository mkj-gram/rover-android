import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
    ModalWithHeader,
    graphite,
    text,
    violet,
    orchid,
    lavender,
    TextField,
    silver,
    RadioButton,
    bold,
    steel
} from '@rover/react-bootstrap'

import CreateSegmentMutation from '../../mutations/CreateSegmentMutation'
import UpdateSegmentPredicatesMutation from '../../mutations/UpdateSegmentPredicatesMutation'

class SegmentSave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            segmentName: '',
            segmentSaveValue: 'update',
            createNewSegment: false
        }
        this.segmentNameInput = this.segmentNameInput.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleRename = this.handleRename.bind(this)
        this.segmentUpdate = this.segmentUpdate.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.updateSegmentSaveValue = this.updateSegmentSaveValue.bind(this)
    }

    componentWillReceiveProps(nextProp) {
        if (nextProp.reset) {
            this.setState({
                segmentName: '',
                segmentSaveValue: 'update',
                createNewSegment: false
            })
        }
    }

    segmentNameInput() {
        return (
            <div>
                <div style={{ ...text, color: silver, marginBottom: 20 }}>
                    {' '}
                    Give this segment a name
                </div>
                <TextField
                    placeholder=""
                    value={this.state.segmentName}
                    style={{
                        width: 150,
                        fontSize: 14,
                        focus: { borderColor: silver },
                        color: 'white',
                        borderColor: silver
                    }}
                    onChange={this.handleRename}
                />
            </div>
        )
    }

    handleRename(e) {
        this.setState({
            segmentName: e.target.value
        })
    }

    handleSave(val) {
        const { setSegment, queryCondition } = this.props
        if (val) {
            // Write query + name to DB
            CreateSegmentMutation(
                this.state.segmentName,
                JSON.stringify(this.props.query),
                setSegment,
                queryCondition
            )
        }
        this.setState({
            segmentName: ''
        })
        this.props.onRequestClose('save')
    }

    segmentUpdate() {
        const { segment } = this.props
        return (
            <div style={{ width: 217 }}>
                <div style={{ ...text, color: silver }}>
                    Would you like to...
                </div>

                {this.renderRadioButton('update', segment.name)}
                {this.renderRadioButton('create')}
                <div style={{ marginTop: 30 }}>
                    {this.state.createNewSegment && this.segmentNameInput()}
                </div>
            </div>
        )
    }

    updateSegmentSaveValue(action) {
        this.setState({
            createNewSegment: action === 'create',
            segmentSaveValue: action
        })
    }

    renderRadioButton(action, val = null) {
        let buttonText
        if (action === 'create') {
            buttonText = (
                <span style={{ color: 'white' }}>Create a new segment</span>
            )
        } else {
            buttonText = (
                <span
                    style={{
                        color: 'white',
                        display: 'inline-block',
                        position: 'relative',
                        top: -2
                    }}
                >
                    Update{' '}
                    <span
                        style={{
                            ...bold,
                            minWidth: 0,
                            maxWidth: 82,
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            position: 'relative',
                            top: 3
                        }}
                    >
                        {val}
                    </span>{' '}
                    segment{' '}
                </span>
            )
        }
        return (
            <div style={{ marginTop: 25 }}>
                <RadioButton
                    label={buttonText}
                    onChange={() => this.updateSegmentSaveValue(action)}
                    isChecked={action === this.state.segmentSaveValue}
                    primaryColor={lavender}
                    style={{
                        fontSize: 14,
                        backgroundColor: graphite
                    }}
                />
            </div>
        )
    }

    handleUpdate(val) {
        const { segmentSaveValue } = this.state
        const { setSegment, queryCondition } = this.props
        if (val) {
            if (segmentSaveValue === 'create') {
                CreateSegmentMutation(
                    this.state.segmentName,
                    JSON.stringify(this.props.query),
                    setSegment,
                    queryCondition
                )
            } else {
                UpdateSegmentPredicatesMutation(
                    this.props.segment.segmentId,
                    JSON.stringify(this.props.query),
                    setSegment,
                    queryCondition
                )
            }
        }
        this.setState({
            segmentName: '',
            segmentSaveValue: 'update',
            createNewSegment: false
        })
        this.props.onRequestClose('save')
    }

    render() {
        const { isOpen, modalCoordinates, saveStates } = this.props
        const { segmentSaveValue } = this.state
        const { isSegmentUpdate } = saveStates

        let modal

        if (isSegmentUpdate) {
            modal = (
                <ModalWithHeader
                    contentLabel="SegmentCompletionUpdate"
                    backgroundColor={graphite}
                    modalHeaderStyle={{
                        height: 0
                    }}
                    modalChildrenStyle={{ marginTop: 40 }}
                    children={this.segmentUpdate()}
                    successFn={() => this.handleUpdate(true)}
                    successText={
                        segmentSaveValue === 'update' ? (
                            'Update Segment'
                        ) : (
                            'Create Segment'
                        )
                    }
                    cancelFn={() => this.handleUpdate()}
                    cancelText="Cancel"
                    primaryColor={violet}
                    hoverColor={orchid}
                    secondaryColor={lavender}
                    isOpen={isOpen}
                    bodyOpenClassName="SegmentCompletionUpdate"
                    modalContentStyle={{
                        top: null,
                        padding: 0,
                        right: null,
                        bottom: modalCoordinates[1] - 50,
                        left: modalCoordinates[0] + 25,
                        transform: null,
                        overflow: 'hidden'
                    }}
                    hoverStyle={{
                        backgroundColor: steel
                    }}
                    modalOverlayStyle={{
                        zIndex: 2
                    }}
                    successButtonIsDisabled={
                        this.state.segmentName.length === 0 &&
                        segmentSaveValue !== 'update'
                    }
                    buttonStyle={{
                        disabledBackgroundColor: steel,
                        disabledTextColor: silver
                    }}
                />
            )
        } else {
            modal = (
                <ModalWithHeader
                    contentLabel="SegmentCompletionSave"
                    backgroundColor={graphite}
                    modalHeaderStyle={{ height: 0 }}
                    modalChildrenStyle={{ marginTop: 40 }}
                    children={this.segmentNameInput()}
                    successFn={() => this.handleSave(true)}
                    successText="Save Segment"
                    cancelFn={() => this.handleSave()}
                    cancelText="Cancel"
                    primaryColor={violet}
                    hoverColor={orchid}
                    secondaryColor={lavender}
                    isOpen={isOpen}
                    bodyOpenClassName="SegmentCompletionSave"
                    modalContentStyle={{
                        top: null,
                        padding: 0,
                        right: null,
                        bottom: modalCoordinates[1] - 50,
                        left: modalCoordinates[0] + 25,
                        transform: null
                    }}
                    hoverStyle={{
                        backgroundColor: steel
                    }}
                    modalOverlayStyle={{
                        zIndex: 2
                    }}
                    successButtonIsDisabled={
                        this.state.segmentName.length === 0
                    }
                    buttonStyle={{
                        disabledBackgroundColor: steel,
                        disabledTextColor: silver
                    }}
                />
            )
        }
        return modal
    }
}

SegmentSave.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    modalCoordinates: PropTypes.array.isRequired,
    query: PropTypes.array.isRequired,
    segment: PropTypes.object.isRequired,
    setSegment: PropTypes.func.isRequired,
    saveStates: PropTypes.object.isRequired,
    queryCondition: PropTypes.string.isRequired
}

SegmentSave.defaultProps = {
    isOpen: false,
    onRequestClose: () => null,
    modalCoordinates: [0, 0],
    query: [],
    segment: {},
    setSegment: () => null,
    saveStates: {},
    queryCondition: 'ALL'
}

export default SegmentSave
