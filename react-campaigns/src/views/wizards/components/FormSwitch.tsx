/// <reference path="../../../../typings/index.d.ts" />
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    Text,
    Switch,
    titanium,
    AlertInfoIcon,
    PopoverContainer,
    Popover,
    turquoise
} from '@rover/ts-bootstrap/dist/src'

import HoverTextInput from './HoverTextInput'
import MobilePopover from './MobilePopover'

import {
    updateEditableCampaign,
    openPopoverModalForm,
    updateActivePopover,
    closePopoverModalForm
} from '../../../actions'
import {
    getEditableCampaign,
    getIsPopoverModalFormOpen,
    getActivePopover
} from '../../../reducers'

export interface FormSwitchProps {
    field: 'notificationIosContentAvailable'
    displayText: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    hoverable?: boolean
    description: JSX.Element
    device: Media
}

export interface FormSwitchDispatchProps {
    updateEditableCampaign: (val: object) => void
    openPopoverModalForm: () => void
    closePopoverModalForm: () => void
    updateActivePopover: (field: string) => void
}

export interface FormSwitchStateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    activePopover: string
    isPopoverOpen: string
}

export interface FormSwitchState {
    showAlertIconDescription: boolean
}

const FormSwitch: React.SFC<
    FormSwitchProps & FormSwitchDispatchProps & FormSwitchStateProps
> = ({
    displayText,
    field,
    hoverable,
    description,
    device,
    editableCampaign,
    updateEditableCampaign,
    activePopover,
    isPopoverOpen,
    closePopoverModalForm,
    updateActivePopover
}) => {
    const activePopoverId = `form-switch-info-${field}`

    const handleUpdateSwitch = () => {
        updateEditableCampaign({
            [field]: !editableCampaign[field]
        })
    }

    const open = () => {
        updateActivePopover(activePopoverId)
        openPopoverModalForm()
    }

    const close = () => {
        switch (device) {
            case 'Mobile':
                closePopoverModalForm()
                setTimeout(() => {
                    updateActivePopover('')
                }, 500)
                break

            case 'Tablet':
            default:
                updateActivePopover('')
                break
        }
    }

    const getAlertIconModal = () => {
        const switchElem = (
            <Switch
                on={editableCampaign[field] as boolean}
                onClick={handleUpdateSwitch}
            />
        )

        switch (device) {
            case 'Desktop':
            default:
                return switchElem
            case 'Tablet':
                return (
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <PopoverContainer
                            id={`form-switch-info-popover`}
                            popoverProps={{
                                placement: 'left',
                                device: device
                            }}
                            targetParent="mainModalLeft"
                            onClick={
                                activePopover !== activePopoverId ? open : close
                            }
                            showPopover={activePopover === activePopoverId}
                        >
                            <AlertInfoIcon
                                fill={turquoise}
                                style={{ marginRight: 16 }}
                            />
                            <div
                                style={{
                                    width: 352,
                                    margin: 16
                                }}
                            >
                                <Text text={description} size="medium" />
                            </div>
                        </PopoverContainer>
                        {switchElem}
                    </div>
                )
            case 'Mobile':
                return (
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <AlertInfoIcon
                            fill={turquoise}
                            style={{ marginRight: 16 }}
                            onClick={e => {
                                e.stopPropagation()
                                open()
                            }}
                        />
                        {switchElem}
                        {activePopover === activePopoverId &&
                            ReactDOM.createPortal(
                                <MobilePopover
                                    children={
                                        <div
                                            style={{
                                                margin: 24,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Text
                                                size="h1"
                                                text={displayText}
                                                textStyle={{ marginBottom: 8 }}
                                            />
                                            <Text
                                                text={description}
                                                size="medium"
                                            />
                                        </div>
                                    }
                                    animation={isPopoverOpen}
                                    navbarProps={{
                                        buttonLeftCallback: () => close()
                                    }}
                                />,
                                document.getElementById('mainModalLeft')
                            )}
                    </div>
                )
        }
    }

    return (
        <HoverTextInput description={description} field={field}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    minHeight: 72,
                    borderBottom: `1px solid ${titanium}`,
                    position: 'relative',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                onClick={handleUpdateSwitch}
            >
                <Text text={displayText} size="large" />

                {getAlertIconModal()}
            </div>
        </HoverTextInput>
    )
}

const mapStateToProps = (state: State): FormSwitchStateProps => ({
    editableCampaign: getEditableCampaign(state),
    isPopoverOpen: getIsPopoverModalFormOpen(state),
    activePopover: getActivePopover(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): FormSwitchDispatchProps => {
    return {
        updateEditableCampaign: val => {
            dispatch(updateEditableCampaign(val))
        },
        openPopoverModalForm: () => {
            dispatch(openPopoverModalForm())
        },
        closePopoverModalForm: () => {
            dispatch(closePopoverModalForm())
        },
        updateActivePopover: field => {
            dispatch(updateActivePopover(field))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormSwitch)
