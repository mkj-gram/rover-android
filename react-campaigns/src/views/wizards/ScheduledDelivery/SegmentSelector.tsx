/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    closePopoverModalForm,
    updateActivePopover,
    updateEditableCampaign,
    updateEditableUIState
} from '../../../actions'

import {
    getActivePopover,
    getUnselectedSegments,
    getEditableCampaign,
    getIsPopoverModalFormOpen
} from '../../../reducers'

import {
    CheckBox,
    PopoverContainer,
    Text,
    titanium,
    Popover
} from '@rover/ts-bootstrap/dist/src'

import MobilePopover from '../components/MobilePopover'
import SelectableList from '../../utils/SelectableList'
import FormSection from '../../utils/FormSection'

export interface SegmentSelectorProps {
    device: Media
}

export interface SegmentSelectorStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    isPopoverModalFormOpen: string
    segments: Array<Segment>
}

export interface SegmentSelectorDispatchProps {
    closePopoverModalForm: () => void
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
        this.setState = this.setState.bind(this)
        this.setSelectedSegment = this.setSelectedSegment.bind(this)
    }

    addSelectedSegments() {
        const {
            closePopoverModalForm,
            device,
            editableCampaign,
            updateActivePopover,
            updateEditableCampaign
        } = this.props
        const { segmentIds } = editableCampaign
        const { selectedSegments } = this.state

        updateEditableCampaign({
            segmentIds: [...segmentIds, ...selectedSegments]
        })
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
        const { device, editableCampaign, segments } = this.props
        const { segmentIds } = editableCampaign
        return (
            <div
                style={{
                    flex: '1 1 auto'
                }}
            >
                <SelectableList device={device}>
                    {segments.map(({ name, segmentId }, index) => (
                        <div
                            key={index}
                            style={{
                                alignItems: 'center',
                                borderBottom: `1px solid ${titanium}`,
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
    render() {
        const {
            activePopover,
            device,
            isPopoverModalFormOpen,
            updateActivePopover
        } = this.props
        const { selectedSegments } = this.state
        return device !== 'Mobile' ? (
            <PopoverContainer
                id="segment-selector-popover"
                popoverProps={{
                    placement: 'right',
                    device: device,
                    navBarProperties: {
                        buttonLeft: 'Cancel',
                        buttonLeftCallback: this.cancelSegmentSelect,
                        buttonRight: selectedSegments.length > 0 ? 'Add' : '',
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
                <div>select segment</div>
                <div style={{ height: 232, overflowY: 'scroll' }}>
                    {this.renderSegmentChecklist()}
                </div>
            </PopoverContainer>
        ) : (
            <div onClick={() => updateActivePopover('segment-select')}>
                <div>select segment</div>
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
    editableCampaign: getEditableCampaign(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state),
    segments: getUnselectedSegments(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): SegmentSelectorDispatchProps => ({
    closePopoverModalForm: () => dispatch(closePopoverModalForm()),
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
