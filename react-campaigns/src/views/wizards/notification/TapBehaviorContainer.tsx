/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import { parse } from 'qs'

import { InjectedProps } from '../../utils/ResponsiveContainer'
import { getCampaign } from '../../../reducers/campaigns'
import { getIsTapBehaviorSelectorOpen } from '../../../reducers'

import {
    Text,
    Button,
    ChangeIcon,
    turquoise,
    aquamarine,
    titanium,
    PopoverContainer,
    white
} from '@rover/ts-bootstrap/dist/src'

import PopoverTextRadioButtonComponent from '../../utils/PopoverTextRadioButtonComponent'
import TapBehaviorBody from './TapBehaviorBody'
import TapBehaviorRow from './TapBehaviorRow'
import NotificationMobilePopoverContainer from './NotificationMobilePopoverContainer'
import UpdateEditableUIStateProperty from '../../utils/UpdateEditableUIStateProperty'

import {
    updateEditableCampaign,
    openTapBehaviorSelector,
    closeTapBehaviorSelector
} from '../../../actions'

export interface TapBehaviorProps extends InjectedProps {
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface TapBehaviorState {
    showTapNotificationOptions?: boolean

    displayName?: StringMap<string>
}

export interface StateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    campaigns: StringMap<Campaign>
    isTapBehaviorSelectorOpen: string
}

export interface DispatchProps {
    updateEditableCampaign: (val: object) => void
    openTapBehaviorSelector: () => void
    closeTapBehaviorSelector: () => void
}

class TapBehaviorContainer extends React.Component<
    TapBehaviorProps & StateProps & DispatchProps,
    TapBehaviorState
> {
    constructor(props: TapBehaviorProps & StateProps & DispatchProps) {
        super(props)
        this.state = {
            showTapNotificationOptions: false,

            displayName: {
                OPEN_EXPERIENCE: 'Present an experience',
                OPEN_WEBSITE: 'Present a website',
                OPEN_DEEP_LINK: 'Open a deep link',
                OPEN_APP: 'Open the app'
            }
        }
        this.getClickableView = this.getClickableView.bind(this)
        this.handleShowNotificationOptions = this.handleShowNotificationOptions.bind(
            this
        )
        this.handleSelectTapOption = this.handleSelectTapOption.bind(this)
        this.tapNotificationRow = this.tapNotificationRow.bind(this)
    }

    handleShowNotificationOptions() {
        this.setState({
            showTapNotificationOptions: !this.state.showTapNotificationOptions
        })
    }

    handleSelectTapOption(
        notificationTapBehaviorType: NotificationTapBehaviorType
    ) {
        const { editableCampaign, campaigns, device } = this.props
        const campaignId = parse(location.search.substring(1)).campaignId
        const campaign = getCampaign(campaigns, campaignId)

        let notificationTapBehaviorUrl = (campaign as
            | ScheduledCampaign
            | AutomatedNotificationCampaign).notificationTapBehaviorUrl
        let notificationTapPresentationType = (editableCampaign as
            | ScheduledCampaign
            | AutomatedNotificationCampaign).notificationTapPresentationType

        let isValidContent = true
        if (
            notificationTapBehaviorType === 'OPEN_DEEP_LINK' ||
            notificationTapBehaviorType === 'OPEN_WEBSITE'
        ) {
            notificationTapBehaviorUrl =
                (campaign as ScheduledCampaign | AutomatedNotificationCampaign)
                    .notificationTapBehaviorType === notificationTapBehaviorType
                    ? (campaign as
                          | ScheduledCampaign
                          | AutomatedNotificationCampaign)
                          .notificationTapBehaviorUrl
                    : ''
            isValidContent = notificationTapBehaviorUrl.length !== 0
        } else {
            notificationTapBehaviorUrl = ''
        }

        if (notificationTapBehaviorType === 'OPEN_WEBSITE') {
            notificationTapPresentationType =
                editableCampaign.notificationTapPresentationType === 'UNKNOWN'
                    ? 'IN_APP'
                    : editableCampaign.notificationTapPresentationType
        } else {
            notificationTapPresentationType = 'UNKNOWN'
        }

        this.props.updateEditableCampaign({
            notificationTapBehaviorType,
            notificationTapBehaviorUrl,
            notificationTapPresentationType,
            UIState: UpdateEditableUIStateProperty(
                'notification',
                editableCampaign.UIState as UIStateInterface,
                'isValidContent',
                'tapBehavior',
                isValidContent
            )
        })
        if (device === 'Mobile') {
            this.props.closeTapBehaviorSelector()
        } else {
            this.setState({
                showTapNotificationOptions: !this.state
                    .showTapNotificationOptions
            })
        }
    }

    getClickableView() {
        const { device, editableCampaign } = this.props
        const { showTapNotificationOptions, displayName } = this.state

        const popoverProps = {
            placement: 'left',
            containerStyle: {
                width: 384,
                background: white,
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${titanium}`
            }
        }

        const getClickable = () => {
            switch (device) {
                case 'Desktop':
                    return (
                        <Button
                            text="Change"
                            type="regular"
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                            key="tapBehavior1"
                        />
                    )
                case 'Tablet':
                    return <ChangeIcon fill={titanium} key="tapBehavior1" />
                case 'Mobile':
                default:
                    return null
            }
        }

        return (
            <PopoverContainer
                id="tapBehaviorNotificationPopover"
                popoverProps={popoverProps}
                targetParent={
                    device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                }
                onClick={this.handleShowNotificationOptions}
                showPopover={showTapNotificationOptions}
            >
                {[
                    getClickable(),
                    <PopoverTextRadioButtonComponent
                        key="tapBehavior2"
                        names={[
                            'OPEN_EXPERIENCE',
                            'OPEN_WEBSITE',
                            'OPEN_DEEP_LINK',
                            'OPEN_APP'
                        ]}
                        onClick={this.handleSelectTapOption}
                        selectedTapOption={
                            editableCampaign.notificationTapBehaviorType
                        }
                        displayName={displayName}
                        device={device}
                    />
                ]}
            </PopoverContainer>
        )
    }

    tapNotificationRow() {
        const {
            device,
            editableCampaign,
            isTapBehaviorSelectorOpen
        } = this.props
        const { displayName } = this.state
        const { notificationTapBehaviorType } = editableCampaign
        const Fragment = React.Fragment

        const row = (
            <Fragment>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text
                        text="What happens when the notification is tapped?"
                        size="small"
                        label={true}
                    />
                    <Text
                        text={displayName[notificationTapBehaviorType]}
                        size="large"
                    />
                </div>
                {this.getClickableView()}
            </Fragment>
        )

        switch (device) {
            case 'Mobile':
                const child = (
                    <PopoverTextRadioButtonComponent
                        key="tapBehavior2"
                        names={[
                            'OPEN_EXPERIENCE',
                            'OPEN_WEBSITE',
                            'OPEN_DEEP_LINK',
                            'OPEN_APP'
                        ]}
                        onClick={this.handleSelectTapOption}
                        selectedTapOption={
                            editableCampaign.notificationTapBehaviorType
                        }
                        displayName={displayName}
                        device={device}
                    />
                )
                return (
                    <Fragment>
                        <div
                            onClick={() => this.props.openTapBehaviorSelector()}
                        >
                            {row}
                        </div>
                        {isTapBehaviorSelectorOpen !== 'close' &&
                            ReactDOM.createPortal(
                                <NotificationMobilePopoverContainer
                                    title="What happens when the notification is tapped?"
                                    child={child}
                                    onClose={() =>
                                        this.props.closeTapBehaviorSelector()
                                    }
                                    animation={isTapBehaviorSelectorOpen}
                                />,
                                document.getElementById('mainModalLeft')
                            )}
                    </Fragment>
                )
            case 'Desktop':
            case 'Tablet':
            default:
                return row
        }
    }

    render() {
        const { device, campaign, editableCampaign } = this.props

        const { notificationTapBehaviorType } = editableCampaign

        return (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: device !== 'Mobile' ? '24px 32px' : 24
                }}
            >
                <div
                    style={{
                        paddingBottom: 24
                    }}
                >
                    <Text text="Tap Behavior" size="h1" />
                </div>
                <TapBehaviorRow
                    handleClick={
                        device === 'Tablet'
                            ? this.handleShowNotificationOptions
                            : () => null
                    }
                >
                    {this.tapNotificationRow()}
                </TapBehaviorRow>
                <TapBehaviorBody
                    device={device}
                    selectedTapOption={notificationTapBehaviorType}
                    campaign={campaign}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: state.editableCampaign,
    campaigns: state.campaigns,
    isTapBehaviorSelectorOpen: getIsTapBehaviorSelectorOpen(state)
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        updateEditableCampaign: val => {
            dispatch(updateEditableCampaign(val))
        },
        openTapBehaviorSelector: () => {
            dispatch(openTapBehaviorSelector())
        },
        closeTapBehaviorSelector: () => {
            dispatch(closeTapBehaviorSelector())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    TapBehaviorContainer
)
