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
import MobilePopover from '../components/MobilePopover'
import FormSection from '../../utils/FormSection'
import {
    updateEditableCampaign,
    openTapBehaviorSelector,
    closeTapBehaviorSelector
} from '../../../actions'
export interface TapBehaviorProps extends InjectedProps {
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
    wizardSection: keyof editableUIState
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
        this.getTapNotificationRowClickable = this.getTapNotificationRowClickable.bind(
            this
        )
    }
    handleShowNotificationOptions() {
        this.setState({
            showTapNotificationOptions: !this.state.showTapNotificationOptions
        })
    }
    handleSelectTapOption(
        notificationTapBehaviorType: NotificationTapBehaviorType
    ) {
        const {
            closeTapBehaviorSelector,
            device,
            updateEditableCampaign,
            campaign
        } = this.props
        let notificationTapBehaviorUrl
        let notificationTapPresentationType
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
        } else {
            notificationTapBehaviorUrl = ''
        }
        if (notificationTapBehaviorType === 'OPEN_WEBSITE') {
            notificationTapPresentationType =
                campaign.notificationTapPresentationType === 'UNKNOWN'
                    ? 'IN_APP'
                    : campaign.notificationTapPresentationType
        } else {
            notificationTapPresentationType = 'UNKNOWN'
        }
        updateEditableCampaign({
            notificationTapBehaviorType,
            notificationTapPresentationType,
            notificationTapBehaviorUrl
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
            placement: 'left'
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
                    <div
                        style={{
                            width: 384
                        }}
                        key="tapBehavior2"
                    >
                        <PopoverTextRadioButtonComponent
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
                    </div>
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
                        {row}
                        {isTapBehaviorSelectorOpen !== 'close' &&
                            ReactDOM.createPortal(
                                <MobilePopover
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

    getTapNotificationRowClickable() {
        const { device } = this.props
        switch (device) {
            case 'Mobile':
                return this.props.openTapBehaviorSelector()
            case 'Tablet':
                return this.handleShowNotificationOptions()
            case 'Desktop':
            default:
                return () => {}
        }
    }

    render() {
        const { device, campaign, editableCampaign } = this.props
        const { notificationTapBehaviorType } = editableCampaign
        const { Fragment } = React
        return (
            <FormSection device={device}>
                <Text
                    text="Tap Behavior"
                    size="h1"
                    textStyle={{ margin: '24px 0' }}
                />
                <TapBehaviorRow
                    handleClick={this.getTapNotificationRowClickable}
                >
                    {this.tapNotificationRow()}
                </TapBehaviorRow>
                <TapBehaviorBody
                    device={device}
                    selectedTapOption={notificationTapBehaviorType}
                    campaign={campaign}
                />
            </FormSection>
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
