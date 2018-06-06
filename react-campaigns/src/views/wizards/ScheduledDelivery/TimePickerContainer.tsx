/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { updateEditableCampaign } from '../../../actions'
import {
    getEditableCampaign,
    getEditableCampaignDisplayTime
} from '../../../reducers'

import PopoverModalForm from '../components/PopoverModalForm'
import { TimePicker } from '@rover/ts-bootstrap/dist/src'

import {
    ChangeIcon,
    Button,
    turquoise,
    aquamarine,
    PlusIcon,
    titanium
} from '@rover/ts-bootstrap/dist/src'

export interface StateProps {
    editableCampaign: ScheduledCampaign
    getDisplayTime: (timeField: string) => string
}

export interface DispatchProps {
    updateEditableCampaign: (fields: object) => void
}

export interface TimePickerProps extends InjectedProps {
    field: 'scheduledTime'
}

export type TimePickerContainerProps = DispatchProps &
    StateProps &
    TimePickerProps

export interface TimePickerState {
    tempSeconds: number
}

class TimePickerContainer extends React.Component<
    TimePickerContainerProps,
    TimePickerState
> {
    constructor(props: TimePickerContainerProps) {
        super(props)
        const { editableCampaign, field } = props

        this.state = {
            tempSeconds: editableCampaign[field]
        }

        this.getPopoverFormInputProps = this.getPopoverFormInputProps.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.updateTempTime = this.updateTempTime.bind(this)
        this.getAddChangeButton = this.getAddChangeButton.bind(this)
    }

    getPopoverFormInputProps() {
        const { field, editableCampaign, device, getDisplayTime } = this.props

        return {
            id: `${field}_time_picker`,
            label: 'Time',
            media: device as Media,
            text:
                editableCampaign[field] == null
                    ? ''
                    : getDisplayTime('scheduledTime'),
            fieldStyle: {
                marginTop: 0,
                padding: device === 'Desktop' ? '24px 0 23px' : 0,
                minHeight: 'none',
                width: '100%'
            },
            isEditingText: false
        }
    }

    handleAdd() {
        const { field, updateEditableCampaign } = this.props
        updateEditableCampaign({
            [field]: this.state.tempSeconds
        })
    }

    handleClose() {
        const { editableCampaign, field } = this.props
        const dt = new Date()
        this.setState({
            tempSeconds:
                editableCampaign[field] == null
                    ? dt.getSeconds() +
                      60 * dt.getMinutes() +
                      60 * 60 * dt.getHours()
                    : editableCampaign[field]
        })
    }

    updateTempTime(seconds: number) {
        this.setState({
            tempSeconds: seconds
        })
    }

    getAddChangeButton(text: string) {
        return (
            <div key="time-picker-add-change">
                <Button
                    text={text}
                    type="regular"
                    style={{
                        innerStyle: {
                            fontSize: 17
                        },
                        outerStyle: {
                            height: null,
                            lineHeight: '24px'
                        }
                    }}
                    mouseDownColors={{
                        active: turquoise,
                        inactive: aquamarine
                    }}
                />
            </div>
        )
    }

    render() {
        const { device, field } = this.props
        const { tempSeconds } = this.state

        const getPopoverNavbarProps = (
            handleClosePopoverModal: () => void
        ) => ({
            buttonRight: 'Done',
            buttonRightCallback: () => {
                this.handleAdd()
                handleClosePopoverModal()
            },
            buttonLeftCallback: () => {
                this.handleClose()
                handleClosePopoverModal()
            }
        })

        const getPopoverModalProps = (handleClosePopoverModal: () => void) => {
            return {
                placement: 'left',
                navBarProperties: {
                    buttonLeft: 'Cancel',
                    id: 'navBarId',
                    style: {
                        containerStyle: {
                            borderRadius: '3px 3px 0px 0px'
                        }
                    },
                    ...getPopoverNavbarProps(handleClosePopoverModal)
                }
            }
        }

        return (
            <PopoverModalForm
                popoverFormInputProps={this.getPopoverFormInputProps()}
                presentationType={device !== 'Mobile' ? 'popover' : 'modal'}
                field={`${field}_time_picker`}
                popoverModalProps={getPopoverModalProps}
                popoverNavbarProps={getPopoverNavbarProps}
                handleShowPopoverForm={this.handleClose}
                addButton={
                    device === 'Desktop' ? (
                        this.getAddChangeButton('Add')
                    ) : (
                        <PlusIcon
                            key="time-picker-add-change"
                            fill={titanium}
                        />
                    )
                }
                editButton={
                    device === 'Desktop' ? (
                        this.getAddChangeButton('Change')
                    ) : (
                        <ChangeIcon
                            key="time-picker-add-change"
                            fill={titanium}
                        />
                    )
                }
            >
                <div
                    key="time-picker-component"
                    style={{
                        padding: device === 'Mobile' ? 24 : 16
                    }}
                >
                    <TimePicker
                        handleSecondsChange={this.updateTempTime}
                        seconds={tempSeconds}
                        containerStyle={{
                            width: device !== 'Mobile' ? 352 : 'none'
                        }}
                    />
                </div>
            </PopoverModalForm>
        )
    }
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign,
    getDisplayTime: (timeField: string) =>
        getEditableCampaignDisplayTime(state, timeField)
})
const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): DispatchProps => {
    return {
        updateEditableCampaign: fields => {
            dispatch(updateEditableCampaign(fields))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimePickerContainer)
