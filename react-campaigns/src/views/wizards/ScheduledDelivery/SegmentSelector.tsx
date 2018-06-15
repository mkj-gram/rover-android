/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    addEditableSegmentIds,
    closePopoverModalForm,
    fetchAudienceSizes,
    removeEditableSegmentId,
    updateActivePopover,
    updateEditableCampaign,
    updateEditableUIState
} from '../../../actions'

import {
    getActivePopover,
    getAllSegments,
    getAudience,
    getEditableCampaign,
    getEditableUIState,
    getIsAudienceSizeUpdating,
    getIsPopoverModalFormOpen,
    getUnselectedSegments
} from '../../../reducers'

import {
    aquamarine,
    Badge,
    Button,
    CheckBox,
    CircleCloseIcon,
    List,
    PlusIcon,
    PopoverContainer,
    silver,
    steel,
    Text,
    titanium,
    turquoise,
    quartz,
    Popover,
    white
} from '@rover/ts-bootstrap/dist/src'

import LoadingIndicator from '../../home/LoadingIndicator'
import MobilePopover from '../components/MobilePopover'
import SelectableList from '../../utils/SelectableList'
import FormSection from '../../utils/FormSection'
import editableUIState from '../../../reducers/editableUIState'

export interface SegmentSelectorProps {
    device: Media
}

export interface SegmentSelectorStateProps {
    activePopover: string
    audience: AudienceState
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    editableUIState: editableUIState
    isAudienceSizeUpdating: boolean
    isPopoverModalFormOpen: string
    segments: Array<Segment>
    unselectedSegments: Array<Segment>
}

export interface SegmentSelectorDispatchProps {
    addEditableSegmentIds: (newSegmentIds: Array<string>) => void
    closePopoverModalForm: () => void
    fetchAudienceSizes: () => void
    removeEditableSegmentId: (segmentId: string) => void
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (x: object) => void
    updateEditableUIState: (
        newUIStateGroup: keyof editableUIState,
        newUIStateValue: AudienceUIState
    ) => void
}

export interface SegmentSelectorState {
    selectedSegments: Array<string>
}

export type SegmentSelectorProperties = SegmentSelectorProps &
    SegmentSelectorStateProps &
    SegmentSelectorDispatchProps

class SegmentSelector extends React.Component<
    SegmentSelectorProperties,
    SegmentSelectorState
> {
    constructor(props: SegmentSelectorProperties) {
        super(props)
        this.state = {
            selectedSegments: []
        }

        this.addSelectedSegments = this.addSelectedSegments.bind(this)
        this.cancelSegmentSelect = this.cancelSegmentSelect.bind(this)
        this.getIsSegmentChecked = this.getIsSegmentChecked.bind(this)
        this.renderAddButton = this.renderAddButton.bind(this)
        this.renderBadge = this.renderBadge.bind(this)
        this.setState = this.setState.bind(this)
        this.setSelectedSegment = this.setSelectedSegment.bind(this)
    }

    componentWillMount() {
        const { fetchAudienceSizes } = this.props
        fetchAudienceSizes()
    }

    addSelectedSegments() {
        const {
            addEditableSegmentIds,
            closePopoverModalForm,
            device,
            editableCampaign,
            updateActivePopover,
            updateEditableCampaign
        } = this.props

        const { selectedSegments } = this.state

        addEditableSegmentIds(selectedSegments)
        closePopoverModalForm()
        setTimeout(() => updateActivePopover(''), device === 'Mobile' ? 500 : 0)
        this.setState({ selectedSegments: [] })
    }

    cancelSegmentSelect() {
        const {
            closePopoverModalForm,
            device,
            updateActivePopover
        } = this.props
        this.setState({ selectedSegments: [] })
        closePopoverModalForm()
        setTimeout(() => updateActivePopover(''), device === 'Mobile' ? 500 : 0)
    }

    getIsSegmentChecked(segmentId: string): boolean {
        const { selectedSegments } = this.state

        return selectedSegments.includes(segmentId)
    }

    setSelectedSegment(segmentId: string): void {
        const { selectedSegments } = this.state

        if (this.getIsSegmentChecked(segmentId)) {
            return this.setState({
                selectedSegments: selectedSegments.filter(
                    segment => segment !== segmentId
                )
            })
        }

        return this.setState({
            selectedSegments: [...selectedSegments, segmentId]
        })
    }

    renderSegmentChecklist() {
        const { device, editableCampaign, unselectedSegments } = this.props
        const { segmentIds } = editableCampaign
        return (
            <div
                style={{
                    flex: '1 1 auto',
                    overflowY: device === 'Mobile' ? 'unset' : 'scroll',
                    paddingBottom: device === 'Mobile' ? 56 : 0
                }}
            >
                <SelectableList device={device}>
                    {unselectedSegments.map(({ name, segmentId }, index) => (
                        <div
                            key={index}
                            style={{
                                alignItems: 'center',
                                borderBottom:
                                    index !== unselectedSegments.length - 1
                                        ? `1px solid ${titanium}`
                                        : 'none',
                                display: 'flex',
                                height: device === 'Mobile' ? 72 : 56,
                                justifyContent: 'space-between',
                                width: device === 'Mobile' ? '100%' : 352
                            }}
                            onClick={() => this.setSelectedSegment(segmentId)}
                        >
                            <Text
                                text={name}
                                size={device === 'Mobile' ? 'large' : 'medium'}
                            />
                            <CheckBox
                                checked={this.getIsSegmentChecked(segmentId)}
                                onClick={this.setSelectedSegment}
                                value={segmentId}
                            />
                        </div>
                    ))}
                </SelectableList>
            </div>
        )
    }
    renderAddButton() {
        const { Fragment } = React
        const { editableUIState } = this.props
        const { audience } = editableUIState
        const { conditionSelected } = audience
        if (conditionSelected === 'ALL-DEVICES') {
            return
        }
        return (
            <Fragment>
                <div
                    style={{
                        height: 24,
                        width: 4,
                        background: quartz,
                        marginLeft: 24
                    }}
                />
                <div
                    style={{
                        width: 145,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: turquoise,
                            marginRight: 8,
                            marginLeft: 14
                        }}
                    >
                        <PlusIcon fill={white} />
                    </div>
                    <Button
                        text="Add Segment"
                        mouseDownColors={{
                            active: turquoise,
                            inactive: aquamarine
                        }}
                        type="regular"
                    />
                </div>
            </Fragment>
        )
    }
    renderAudienceList() {
        const {
            audience,
            editableCampaign,
            isAudienceSizeUpdating,
            removeEditableSegmentId,
            segments
        } = this.props
        const { segmentIds } = editableCampaign

        const { Fragment } = React

        return segmentIds.map((segment, index) => (
            <Fragment key={index}>
                <List separationElement={index > 0 && this.renderBadge()}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Text
                            text={
                                segments.filter(s => s.segmentId === segment)[0]
                                    .name
                            }
                            size="medium"
                        />
                        {!isAudienceSizeUpdating ? (
                            <Text
                                text={`${audience[segment]} devices`}
                                label={true}
                                size="small"
                            />
                        ) : (
                            <LoadingIndicator />
                        )}
                    </div>
                    <CircleCloseIcon
                        fill={silver}
                        onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                            e.stopPropagation()
                            removeEditableSegmentId(segment)
                        }}
                    />
                </List>
            </Fragment>
        ))
    }
    renderSegmentList() {
        const { editableCampaign } = this.props
        const { segmentIds } = editableCampaign

        return (
            <div>
                {segmentIds.map((segmentId, index, arr) => {
                    const segments = arr.slice(0, index + 1)
                    return <div key={index}>segmentId</div>
                })}
            </div>
        )
    }
    renderBadge() {
        const { editableCampaign } = this.props
        const { segmentCondition } = editableCampaign
        return (
            <Badge
                color={steel}
                text={segmentCondition === 'ANY' ? 'OR' : 'AND'}
            />
        )
    }
    render() {
        const {
            activePopover,
            audience,
            device,
            editableCampaign,
            isPopoverModalFormOpen,
            segments,
            updateActivePopover
        } = this.props
        const { selectedSegments } = this.state
        const { segmentIds } = editableCampaign
        const { Fragment } = React
        return device !== 'Mobile' ? (
            <div style={{ overflowY: 'scroll' }}>
                {this.renderAudienceList()}
                <PopoverContainer
                    id="segment-selector-popover"
                    popoverProps={{
                        placement: 'right',
                        device: device,
                        navBarProperties: {
                            buttonLeft: 'Cancel',
                            buttonLeftCallback: this.cancelSegmentSelect,
                            buttonRight:
                                selectedSegments.length > 0 ? 'Add' : '',
                            buttonRightCallback:
                                selectedSegments.length > 0
                                    ? this.addSelectedSegments
                                    : undefined
                        }
                    }}
                    targetParent={
                        device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                    }
                    onClick={() =>
                        updateActivePopover(
                            activePopover === 'segment-select'
                                ? ''
                                : 'segment-select'
                        )
                    }
                    showPopover={activePopover === 'segment-select'}
                >
                    {this.renderAddButton()}
                    <div style={{ height: 232, overflowY: 'scroll' }}>
                        {this.renderSegmentChecklist()}
                    </div>
                </PopoverContainer>
            </div>
        ) : (
            <div onClick={() => updateActivePopover('segment-select')}>
                {this.renderAudienceList()}
                {this.renderAddButton()}
                {activePopover === 'segment-select' &&
                    ReactDOM.createPortal(
                        <MobilePopover
                            animation={isPopoverModalFormOpen}
                            navbarProps={{
                                buttonLeft: 'Cancel',
                                buttonLeftCallback: this.cancelSegmentSelect,
                                buttonRight:
                                    selectedSegments.length > 0 ? 'Add' : '',
                                buttonRightCallback:
                                    selectedSegments.length > 0
                                        ? this.addSelectedSegments
                                        : undefined
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'scroll'
                                }}
                            >
                                <Text
                                    text="Add segments"
                                    size="h2"
                                    textStyle={{ margin: 24 }}
                                />
                                {this.renderSegmentChecklist()}
                            </div>
                        </MobilePopover>,
                        document.getElementById('mainModalLeft')
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state: State): SegmentSelectorStateProps => ({
    activePopover: getActivePopover(state),
    audience: getAudience(state),
    editableCampaign: getEditableCampaign(state),
    editableUIState: getEditableUIState(state),
    isAudienceSizeUpdating: getIsAudienceSizeUpdating(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state),
    segments: getAllSegments(state),
    unselectedSegments: getUnselectedSegments(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): SegmentSelectorDispatchProps => ({
    addEditableSegmentIds: (segmentIds: Array<string>) =>
        dispatch(addEditableSegmentIds(segmentIds)),
    closePopoverModalForm: () => dispatch(closePopoverModalForm()),
    fetchAudienceSizes: () => dispatch(fetchAudienceSizes()),
    removeEditableSegmentId: (segmentId: string) =>
        dispatch(removeEditableSegmentId(segmentId)),
    updateActivePopover: (activePopover: string) =>
        dispatch(updateActivePopover(activePopover)),
    updateEditableCampaign: (x: object) => dispatch(updateEditableCampaign(x)),
    updateEditableUIState: (
        newUIStateGroup: keyof editableUIState,
        newUIStateValue: AudienceUIState
    ) => dispatch(updateEditableUIState(newUIStateGroup, newUIStateValue))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SegmentSelector)
