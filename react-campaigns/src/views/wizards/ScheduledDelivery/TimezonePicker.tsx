/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import * as moment from 'moment-timezone'

import {
    closePopoverModalForm,
    updateActivePopover,
    updateEditableCampaign
} from '../../../actions'
import {
    getActivePopover,
    getIsPopoverModalFormOpen,
    getEditableCampaign
} from '../../../reducers'

import {
    aquamarine,
    Button,
    ChangeIcon,
    charcoal,
    PopoverContainer,
    PopoverSearch,
    Text,
    titanium,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import PopoverTextRadioButtonComponent from '../../utils/PopoverTextRadioButtonComponent'
import MobilePopover from '../components/MobilePopover'

export interface TimezonePickerProps {
    device: Media
}

export interface TimezonePickerState {
    isSearchFocused: boolean
    selectedTimezone: string
    timezoneSearch: string
}

export interface TimezonePickerStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign
    isPopoverModalFormOpen: string
}

export interface TimezonePickerDispatchProps {
    closePopoverModalForm: () => void
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (x: object) => void
}

class TimezonePicker extends React.Component<
    TimezonePickerProps &
        TimezonePickerStateProps &
        TimezonePickerDispatchProps,
    TimezonePickerState
> {
    constructor(
        props: TimezonePickerProps &
            TimezonePickerStateProps &
            TimezonePickerDispatchProps
    ) {
        super(props)

        this.state = {
            isSearchFocused: false,
            selectedTimezone: moment.tz.guess(),
            timezoneSearch: ''
        }
        this.cancelUpdateTimezone = this.cancelUpdateTimezone.bind(this)
        this.updatePopoverVisibility = this.updatePopoverVisibility.bind(this)
        this.updateTimezone = this.updateTimezone.bind(this)
    }

    cancelUpdateTimezone() {
        const { editableCampaign } = this.props
        const { scheduledTimeZone } = editableCampaign
        this.setState({
            selectedTimezone: scheduledTimeZone || moment.tz.guess()
        })
        this.updatePopoverVisibility()
    }

    getDisplayNames() {
        const { timezoneSearch } = this.state
        return moment.tz.names().reduce((prev: Array<string>, next: string) => {
            if (
                next.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                timezoneSearch === ''
            ) {
                return {
                    ...prev,
                    [next]: next
                }
            }
            return prev
        }, {})
    }
    updatePopoverVisibility() {
        const {
            activePopover,
            closePopoverModalForm,
            device,
            updateActivePopover
        } = this.props

        if (activePopover === 'scheduled-timezone-picker') {
            closePopoverModalForm()
            setTimeout(() => {
                this.setState({ timezoneSearch: '' })
                updateActivePopover('')
            }, device === 'Mobile' ? 500 : 0)
            return
        }

        updateActivePopover('scheduled-timezone-picker')
    }

    updateTimezone() {
        const { updateEditableCampaign } = this.props
        const { selectedTimezone } = this.state
        updateEditableCampaign({
            scheduledTimeZone: selectedTimezone
        })
        this.updatePopoverVisibility()
    }

    renderCurrentTimezone() {
        const { editableCampaign } = this.props
        const { scheduledTimeZone } = editableCampaign
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text text="Time zone" label={true} size="small" />
                <Text
                    text={scheduledTimeZone || moment.tz.guess()}
                    size="large"
                    textStyle={{ color: charcoal }}
                />
            </div>
        )
    }

    renderTimezones() {
        const { device, editableCampaign } = this.props
        const { selectedTimezone } = this.state
        const { scheduledTimeZone } = editableCampaign
        const displayNames = this.getDisplayNames()
        return (
            <PopoverTextRadioButtonComponent
                device={device}
                names={Object.keys(displayNames)}
                onClick={(scheduledTimeZone: string) =>
                    this.setState({ selectedTimezone: scheduledTimeZone })
                }
                selectedTapOption={selectedTimezone}
                displayName={displayNames}
            />
        )
    }

    render() {
        const {
            activePopover,
            device,
            editableCampaign,
            isPopoverModalFormOpen,
            updateEditableCampaign
        } = this.props
        const { scheduledTimeZone } = editableCampaign
        const { isSearchFocused, selectedTimezone, timezoneSearch } = this.state
        return device !== 'Mobile' ? (
            <div
                style={{
                    height: 96,
                    width: '100%',
                    borderBottom: `1px solid ${titanium}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={this.updatePopoverVisibility}
            >
                {this.renderCurrentTimezone()}
                <PopoverContainer
                    id="timezone-picker-popover"
                    popoverProps={{
                        placement: 'left',
                        device: device,
                        navBarProperties: {
                            buttonLeft: 'Cancel',
                            buttonLeftCallback: this.cancelUpdateTimezone,
                            buttonRight: 'Done',
                            buttonRightCallback: this.updateTimezone
                        }
                    }}
                    targetParent={
                        device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                    }
                    onClick={this.updatePopoverVisibility}
                    showPopover={activePopover === 'scheduled-timezone-picker'}
                >
                    {device === 'Desktop' ? (
                        <Button
                            text="Change"
                            type="regular"
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                            key="timezone-selector"
                        />
                    ) : (
                        <ChangeIcon fill={titanium} />
                    )}
                    <div
                        style={{
                            width: 384,
                            height: 296,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <PopoverSearch
                            device={device}
                            isSearchFocused={isSearchFocused}
                            removeFocus={() =>
                                this.setState({ isSearchFocused: false })
                            }
                            setFocus={() =>
                                this.setState({ isSearchFocused: true })
                            }
                            submitText={(timezoneSearch: string) =>
                                this.setState({ timezoneSearch })
                            }
                            text={timezoneSearch}
                        />
                        <div style={{ flex: '1 1 auto', overflowY: 'scroll' }}>
                            {this.renderTimezones()}
                        </div>
                    </div>
                </PopoverContainer>
            </div>
        ) : (
            <div
                style={{
                    height: 96,
                    width: '100%',
                    borderBottom: `1px solid ${titanium}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                onClick={this.updatePopoverVisibility}
            >
                {this.renderCurrentTimezone()}
                {activePopover === 'scheduled-timezone-picker' &&
                    ReactDOM.createPortal(
                        <MobilePopover
                            animation={isPopoverModalFormOpen}
                            navbarProps={{
                                buttonLeft: 'Cancel',
                                buttonLeftCallback: this.cancelUpdateTimezone,
                                buttonRight: 'Done',
                                buttonRightCallback: this.updateTimezone
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
                                <PopoverSearch
                                    device={device}
                                    isSearchFocused={isSearchFocused}
                                    removeFocus={() =>
                                        this.setState({
                                            isSearchFocused: false
                                        })
                                    }
                                    setFocus={() =>
                                        this.setState({ isSearchFocused: true })
                                    }
                                    submitText={(timezoneSearch: string) =>
                                        this.setState({ timezoneSearch })
                                    }
                                    text={timezoneSearch}
                                />
                                <div
                                    style={{
                                        flex: '1 1 auto',
                                        overflowY: 'scroll'
                                    }}
                                >
                                    {this.renderTimezones()}
                                </div>
                            </div>
                        </MobilePopover>,
                        document.getElementById('mainModalLeft')
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state: State): TimezonePickerStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): TimezonePickerDispatchProps => {
    return {
        closePopoverModalForm: () => dispatch(closePopoverModalForm()),
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        updateEditableCampaign: (x: object) =>
            dispatch(updateEditableCampaign(x))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimezonePicker)
