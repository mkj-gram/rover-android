/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { updateEditableCampaign } from '../../../actions'
import { getEditableCampaign } from '../../../reducers'

import PopoverModalForm from '../components/PopoverModalForm'
import { DatePicker } from '@rover/ts-bootstrap/dist/src'

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
}

export interface DispatchProps {
    updateEditableCampaign: (fields: object) => void
}

export interface DatePickerProps extends InjectedProps {
    field: keyof ScheduledCampaign
}

export interface DatePickerModalPopoverProps {
    handleSaveChange?: () => void
    key?: string
}

const DatePickerContainer: React.SFC<
    DispatchProps & StateProps & DatePickerProps
> = ({ field, device, editableCampaign, updateEditableCampaign }) => {
    const getFormatDate = () => {
        const isoStringDate = editableCampaign[field] as string
        const year = isoStringDate.substr(0, 4)
        const month = isoStringDate.substr(5, 2)
        const day = isoStringDate.substr(8, 2)

        return new Date(`${month}/${day}/${year}`)
    }

    const onSelect = (handleClosePopoverModal: () => void, time: Date) => {
        updateEditableCampaign({
            [field]: `${new Date(time)
                .toISOString()
                .substr(0, 10)}T00:00:00.000Z`
        })
        handleClosePopoverModal()
    }

    const getPopoverFormInputProps = () => {
        const formatDate = () =>
            getFormatDate().toLocaleString('en-us', {
                month: 'long',
                day: '2-digit',
                year: 'numeric'
            })

        return {
            id: `${field}_advanced_settings`,
            label: 'Date',
            media: device as Media,
            text: editableCampaign[field] == null ? '' : formatDate(),
            fieldStyle: {
                marginTop: 0,
                padding: device === 'Desktop' ? '24px 0 23px' : 0,
                minHeight: 'none',
                width: '100%'
            },
            isEditingText: false
        }
    }

    const getPopoverNavbarProps = (handleClosePopoverModal: () => void) => ({
        buttonLeftCallback: () => {
            handleClosePopoverModal()
        }
    })

    const getPopoverModalProps = (handleClosePopoverModal: () => void) => ({
        placement: 'left'
    })

    const getAddChangeButton = (text: string) => (
        <div key="date-picker-add-change">
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

    const PopoverModalChild: React.SFC<DatePickerModalPopoverProps> = ({
        handleSaveChange,
        key
    }) => {
        return (
            <div
                key="date-picker-component"
                style={{
                    width: device === 'Mobile' ? '100%' : 360
                }}
            >
                <DatePicker
                    onSelect={handleSaveChange}
                    defaultDate={
                        editableCampaign[field] == null
                            ? undefined
                            : getFormatDate()
                    }
                />
            </div>
        )
    }

    return (
        <PopoverModalForm
            popoverFormInputProps={getPopoverFormInputProps()}
            presentationType={device !== 'Mobile' ? 'popover' : 'modal'}
            field={`${field}_advanced_settings`}
            popoverModalProps={getPopoverModalProps}
            popoverNavbarProps={getPopoverNavbarProps}
            addButton={
                device === 'Desktop' ? (
                    getAddChangeButton('Add')
                ) : (
                    <PlusIcon fill={titanium} />
                )
            }
            editButton={
                device === 'Desktop' ? (
                    getAddChangeButton('Change')
                ) : (
                    <ChangeIcon fill={titanium} />
                )
            }
            handleSaveChange={onSelect}
        >
            <PopoverModalChild />
        </PopoverModalForm>
    )
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: getEditableCampaign(state) as ScheduledCampaign
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
export default connect(mapStateToProps, mapDispatchToProps)(DatePickerContainer)
