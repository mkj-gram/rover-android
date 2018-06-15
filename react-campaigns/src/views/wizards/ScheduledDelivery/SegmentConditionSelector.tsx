/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import { parse } from 'qs'

import {
    closePopoverModalForm,
    updateActivePopover,
    updateEditableCampaign,
    updateEditableUIState,
    updateSegmentCondition
} from '../../../actions'

import {
    getActivePopover,
    getAudience,
    getCampaign,
    getEditableCampaign,
    getEditableUIState,
    getIsPopoverModalFormOpen,
    getTotalAudienceSize
} from '../../../reducers'

import {
    aquamarine,
    Button,
    ChangeIcon,
    charcoal,
    PopoverContainer,
    RadioButton,
    semibold,
    steel,
    Text,
    titanium,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import LoadingIndicator from '../../home/LoadingIndicator'
import MobilePopover from '../components/MobilePopover'
import Row from '../components/Row'
import SelectableList from '../../utils/SelectableList'
export interface SegmentConditionSelectorProps {
    device: Media
}

export interface SegmentConditionSelectorStateProps {
    activePopover: string
    campaign: ScheduledCampaign | AutomatedNotificationCampaign
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    editableUIState: editableUIState
    isPopoverModalFormOpen: string
    totalAudienceSize: number | false
}

export interface SegmentConditionSelectorDispatchProps {
    closePopoverModalForm: () => void
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (x: object) => void
    updateEditableUIState: (
        newUIStateGroup: keyof editableUIState,
        newUIStateValue: AudienceUIState
    ) => void
    updateSegmentCondition: (condition: SegmentCondition) => void
}

const { Fragment } = React

const SegmentConditionSelector: React.SFC<
    SegmentConditionSelectorProps &
        SegmentConditionSelectorStateProps &
        SegmentConditionSelectorDispatchProps
> = ({
    activePopover,
    campaign,
    closePopoverModalForm,
    device,
    editableCampaign,
    editableUIState,
    isPopoverModalFormOpen,
    totalAudienceSize,
    updateActivePopover,
    updateEditableCampaign,
    updateEditableUIState,
    updateSegmentCondition
}) => {
    const { segmentCondition, segmentIds } = editableCampaign
    const { conditionSelected } = editableUIState.audience
    const updatePopoverVisibility = () => {
        if (activePopover === 'segment-selector') {
            closePopoverModalForm()
            setTimeout(() => {
                updateActivePopover('')
            }, device === 'Mobile' ? 500 : 0)
            return
        }

        updateActivePopover('segment-selector')
    }

    const renderCurrentSegmentCondition = () => {
        if (conditionSelected !== 'ALL-DEVICES') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text
                        text="Send notification to devices who belong to..."
                        label={true}
                        size="small"
                    />
                    <div>
                        <Text
                            text={segmentCondition}
                            size="large"
                            textStyle={{
                                ...semibold,
                                color: charcoal,
                                marginRight: 5
                            }}
                        />
                        <Text
                            text="of the following segments"
                            size="large"
                            textStyle={{ color: charcoal }}
                        />
                    </div>
                </div>
            )
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text
                    text="Send notification to all devices"
                    size="large"
                    textStyle={{ color: charcoal }}
                />
                {totalAudienceSize ? (
                    <Text
                        text={`${totalAudienceSize} devices`}
                        size="small"
                        label={true}
                        textStyle={{ color: steel }}
                    />
                ) : (
                    <LoadingIndicator />
                )}
            </div>
        )
    }

    const renderSegmentCondition = (condition: SegmentCondition) => (
        <div
            key={condition}
            onClick={e => {
                e.stopPropagation()
                updateSegmentCondition(condition)
                updateEditableUIState('audience', {
                    ...editableUIState.audience,
                    conditionSelected: condition
                })
                if (device === 'Mobile') {
                    updatePopoverVisibility()
                }
            }}
            style={{
                display: 'flex',
                height: device !== 'Mobile' ? 55 : 71,
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <div>
                <Text
                    text={condition}
                    size="large"
                    textStyle={{ ...semibold, marginRight: 5 }}
                />
                <Text text="of the following segments" size="large" />
            </div>
            <RadioButton
                selected={
                    !conditionSelected
                        ? condition === 'ALL'
                        : conditionSelected === condition
                }
                style={{
                    outerStyle: { height: 18, width: 18 }
                }}
            />
        </div>
    )

    const renderConditions = () => (
        <div style={{ flex: '1 1 auto', overflowY: 'scroll' }}>
            <SelectableList device={device}>
                {renderSegmentCondition('ANY')}
                {renderSegmentCondition('ALL')}
                <div
                    key="all-devices"
                    onClick={e => {
                        e.stopPropagation()
                        updateSegmentCondition('ANY')
                        updateEditableCampaign({
                            segmentIds: []
                        })
                        updateEditableUIState('audience', {
                            ...editableUIState.audience,
                            conditionSelected: 'ALL-DEVICES'
                        })
                        if (device === 'Mobile') {
                            updatePopoverVisibility()
                        }
                    }}
                    style={{
                        display: 'flex',
                        height: device !== 'Mobile' ? 55 : 71,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        text="Send notification to all devices"
                        size="large"
                    />

                    <RadioButton
                        selected={conditionSelected === 'ALL-DEVICES'}
                        style={{
                            outerStyle: { height: 18, width: 18 }
                        }}
                    />
                </div>
            </SelectableList>
        </div>
    )

    return (
        <Row onClick={updatePopoverVisibility}>
            {renderCurrentSegmentCondition()}
            {device !== 'Mobile' ? (
                <PopoverContainer
                    id="segment-selector-popover"
                    popoverProps={{
                        placement: 'left',
                        device: device,
                        navBarProperties: {
                            buttonLeft: 'Cancel',
                            buttonLeftCallback: () => {
                                updateSegmentCondition(
                                    campaign.segmentCondition
                                )
                                updateEditableUIState('audience', {
                                    ...editableUIState.audience,
                                    conditionSelected:
                                        campaign.UIState.length > 0
                                            ? JSON.parse(campaign.UIState)
                                                  .audience.conditionSelected
                                            : undefined
                                })
                                updatePopoverVisibility()
                            }
                        }
                    }}
                    targetParent={
                        device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                    }
                    onClick={updatePopoverVisibility}
                    showPopover={activePopover === 'segment-selector'}
                >
                    {device === 'Desktop' ? (
                        <Button
                            text="Change"
                            type="regular"
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                            key="segment-condition-selector"
                        />
                    ) : (
                        <ChangeIcon fill={titanium} />
                    )}
                    <div
                        style={{
                            width: 384,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {renderConditions()}
                    </div>
                </PopoverContainer>
            ) : (
                <Fragment>
                    {activePopover === 'segment-selector' &&
                        ReactDOM.createPortal(
                            <MobilePopover
                                animation={isPopoverModalFormOpen}
                                navbarProps={{
                                    buttonLeft: 'Cancel',
                                    buttonLeftCallback: updatePopoverVisibility
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Text
                                        size="h2"
                                        text="Send notification to devices who belong to…"
                                        textStyle={{ margin: 24 }}
                                    />
                                    {renderConditions()}
                                </div>
                            </MobilePopover>,
                            document.getElementById('mainModalLeft')
                        )}
                </Fragment>
            )}
        </Row>
    )
}
const mapStateToProps = (state: State): SegmentConditionSelectorStateProps => ({
    activePopover: getActivePopover(state),
    campaign: getCampaign(
        state,
        parse(location.search.substring(1)).campaignId
    ) as AutomatedNotificationCampaign | ScheduledCampaign,
    editableCampaign: getEditableCampaign(state) as
        | ScheduledCampaign
        | AutomatedNotificationCampaign,
    editableUIState: getEditableUIState(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state),
    totalAudienceSize: getTotalAudienceSize(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): SegmentConditionSelectorDispatchProps => {
    return {
        closePopoverModalForm: () => dispatch(closePopoverModalForm()),
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        updateEditableCampaign: (x: object) =>
            dispatch(updateEditableCampaign(x)),
        updateEditableUIState: (
            newUIStateGroup: keyof editableUIState,
            newUIStateValue: AudienceUIState
        ) => dispatch(updateEditableUIState(newUIStateGroup, newUIStateValue)),
        updateSegmentCondition: (condition: SegmentCondition) =>
            dispatch(updateSegmentCondition(condition))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SegmentConditionSelector)
