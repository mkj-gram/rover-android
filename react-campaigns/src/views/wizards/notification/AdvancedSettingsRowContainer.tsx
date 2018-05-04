/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'

import { connect, Dispatch } from 'react-redux'
import {
    white,
    titanium,
    turquoise,
    Text,
    graphite,
    TextInput
} from '@rover/ts-bootstrap/dist/src'

import { updateEditableCampaign } from '../../../actions'

import { getEditableCampaign } from '../../../reducers'

import PopoverModalForm from '../components/PopoverModalForm'
import HoverTextInput from '../components/HoverTextInput'

export interface AdvancedSettingsRowContainerProps {
    children?: JSX.Element
    device: string
    displayText: string
    rowOnClick?: () => void
    description?: string
    field:
        | 'notificationIosSound'
        | 'notificationIosCategoryIdentifier'
        | 'notificationIosThreadIdentifier'
        | 'notificationAndroidChannelId'
        | 'notificationAndroidSound'
        | 'notificationAndroidTag'

    placeholderText?: string
    type: string
}

export interface AdvancedSettingsRowContainerState {
    urlContentEditable: boolean
    tempStrValue: string
}

export interface StateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface DispatchProps {
    updateEditableCampaign: (fields: object) => void
}

export interface PopoverModalChildProps {
    handleSaveChange?: () => void
    key?: string
}

class AdvancedSettingsRowContainer extends React.Component<
    AdvancedSettingsRowContainerProps & StateProps & DispatchProps,
    AdvancedSettingsRowContainerState
> {
    constructor(
        props: AdvancedSettingsRowContainerProps & StateProps & DispatchProps
    ) {
        super(props)
        const { editableCampaign, field } = props
        this.state = {
            urlContentEditable: false,
            tempStrValue: editableCampaign[field] as string
        }

        this.handleShowPopoverForm = this.handleShowPopoverForm.bind(this)
        this.handleSaveChange = this.handleSaveChange.bind(this)
        this.handleBlurChange = this.handleBlurChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleStartEditText = this.handleStartEditText.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleShowPopoverForm() {
        const { editableCampaign, field } = this.props

        this.setState({
            urlContentEditable: false,
            tempStrValue: editableCampaign[field] as string
        })
    }

    handleSaveChange(str: string) {
        const { device, field, updateEditableCampaign } = this.props
        updateEditableCampaign({
            [field]: str
        })
        switch (device) {
            case 'Desktop':
            case 'Tablet':
                this.setState({
                    urlContentEditable: false
                })
                break
            case 'Mobile':
                this.setState({
                    urlContentEditable: false,
                    tempStrValue: str
                })
                break
            default:
                return
        }
    }

    handleBlurChange(tempStrValue: string) {
        this.setState({
            urlContentEditable: false,
            tempStrValue
        })
    }

    handleClose() {
        const { field, editableCampaign, device } = this.props

        this.setState({
            urlContentEditable: false,
            tempStrValue: editableCampaign[field] as string
        })
    }

    handleAdd() {
        const { field, updateEditableCampaign } = this.props

        this.setState(
            {
                urlContentEditable: false
            },
            () =>
                updateEditableCampaign({
                    [field]: this.state.tempStrValue
                })
        )
    }

    handleStartEditText() {
        this.setState({
            urlContentEditable: true
        })
    }

    render() {
        const {
            device,
            displayText,
            description,
            placeholderText,
            field,
            editableCampaign,
            type
        } = this.props
        const { urlContentEditable, tempStrValue } = this.state

        const id = `${field}_advancedSettings`

        const commonChildComponentProps = {
            id: `${field}_advanced_settings`,
            label: displayText,
            media: device as Media,
            text: editableCampaign[field] as string,
            fieldStyle: {
                marginTop: 0,
                padding: device === 'Desktop' ? '24px 0 23px' : 0,
                minHeight: 'none',
                width: '100%'
            }
        }

        const handleSaveChangeClosePopover = (
            handleClosePopoverModal: () => void,
            str: string
        ) => {
            this.handleSaveChange(str)
            handleClosePopoverModal()
        }

        const popoverNavbarProps = (handleClosePopoverModal: () => void) => ({
            buttonRight:
                (editableCampaign[field] as string).length === 0
                    ? 'Add'
                    : 'Update',
            buttonRightCallback: () => {
                this.handleAdd()
                handleClosePopoverModal()
            },
            buttonLeftCallback: () => {
                this.handleClose()
                handleClosePopoverModal()
            }
        })

        const popoverModalProps = (handleClosePopoverModal: () => void) => {
            return {
                placement: 'left',
                device: device,
                navBarProperties: {
                    buttonLeft: 'Cancel',

                    id: 'navBarId',
                    style: {
                        containerStyle: {
                            borderRadius: '3px 3px 0px 0px'
                        },
                        buttonLeftStyle: {
                            innerStyle: {
                                color: graphite
                            }
                        },
                        buttonRightStyle: {
                            innerStyle: {
                                color: graphite
                            }
                        }
                    },
                    ...popoverNavbarProps(handleClosePopoverModal)
                }
            }
        }

        const PopoverModalChild: React.SFC<PopoverModalChildProps> = ({
            handleSaveChange,
            key
        }) => {
            const { device } = this.props

            const view = (
                <div
                    style={{
                        padding: device === 'Tablet' ? 16 : 24,
                        paddingTop: device === 'Tablet' ? 0 : 24
                    }}
                    key={key}
                >
                    {device === 'Mobile' ? (
                        <Text text={`${type} ${displayText}`} size="h1" />
                    ) : (
                        <div />
                    )}
                    <div
                        style={{
                            width: '100%',
                            padding:
                                device === 'Tablet'
                                    ? '16px 0 15px'
                                    : '24px 0 23px',
                            borderBottom: `1px solid ${titanium}`
                        }}
                        onClick={e => {
                            e.stopPropagation()
                            this.setState({
                                urlContentEditable: !urlContentEditable
                            })
                        }}
                    >
                        <Text
                            text={tempStrValue}
                            size={device === 'Tablet' ? 'medium' : 'large'}
                            contentEditable={urlContentEditable}
                            handleChange={handleSaveChange}
                            handleBlurChange={this.handleBlurChange}
                            placeholder={true}
                            id={`${field}_advancedSettings`}
                            onBlurChange={true}
                            placeholderText={placeholderText}
                            textStyle={{ width: 350 }}
                        />
                    </div>
                    {description.length !== 0 && (
                        <div
                            style={{
                                paddingTop: device === 'Tablet' ? 16 : 24
                            }}
                        >
                            <Text
                                size={device === 'Tablet' ? 'small' : 'medium'}
                                text={description}
                            />
                        </div>
                    )}
                </div>
            )
            switch (device) {
                case 'Tablet':
                    return (
                        <div
                            style={{
                                width: 384,
                                flexDirection: 'column'
                            }}
                        >
                            {view}
                        </div>
                    )
                case 'Mobile':
                default:
                    return view
            }
        }

        switch (device) {
            case 'Desktop':
            default:
                const textInputProps = {
                    ...commonChildComponentProps,
                    isEditingText: urlContentEditable,
                    placeholder: placeholderText,
                    startEditingText: this.handleStartEditText,
                    updateText: this.handleSaveChange,
                    deleteText: () => this.handleSaveChange(''),
                    isRequired: false
                }
                return (
                    <HoverTextInput description={description} field={field}>
                        <TextInput {...textInputProps} />
                    </HoverTextInput>
                )
            case 'Tablet':
            case 'Mobile':
                return (
                    <PopoverModalForm
                        popoverFormInputProps={{
                            ...commonChildComponentProps,
                            isEditingText: false,
                            textMode: true
                        }}
                        presentationType={
                            device === 'Mobile' ? 'modal' : 'popover'
                        }
                        field={field}
                        popoverModalProps={popoverModalProps}
                        popoverNavbarProps={popoverNavbarProps}
                        handleShowPopoverForm={this.handleShowPopoverForm}
                        handleSaveChange={handleSaveChangeClosePopover}
                    >
                        <PopoverModalChild />
                    </PopoverModalForm>
                )
        }
    }
}
const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: getEditableCampaign(state)
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
export default connect(mapStateToProps, mapDispatchToProps)(
    AdvancedSettingsRowContainer
)
