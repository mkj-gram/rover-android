/// <reference path="../../../../typings/index.d.ts" />
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    closePopoverModalForm,
    openPopoverModalForm,
    updateActivePopover
} from '../../../actions'
import { getIsPopoverModalFormOpen, getActivePopover } from '../../../reducers'

import {
    TextInput,
    PopoverFormInput,
    PopoverContainer,
    PlusIcon,
    ChangeIcon,
    titanium
} from '@rover/ts-bootstrap/dist/src'

import MobilePopover from './MobilePopover'

export interface PopoverModalFormProps {
    presentationType: 'popover' | 'modal' | 'regular'
    field: string
    // tslint:disable-next-line:no-any
    popoverFormInputProps: any
    popoverModalProps?: (handleClosePopoverModal: () => void) => object
    popoverNavbarProps?: (handleClosePopoverModal: () => void) => object

    handleShowPopoverForm?: () => void

    handleSaveChange?: (
        handleClosePopoverModal: () => void,
        fieldValue: string
    ) => void

    children?: JSX.Element

    addButton?: JSX.Element
    editButton?: JSX.Element
}
export interface StateProps {
    isPopoverModalFormOpen: string
    activePopover: string
}
export interface DispatchProps {
    closePopoverModalForm: () => void
    openPopoverModalForm: () => void
    updateActivePopover: (field: string) => void
}

const PopoverModalForm: React.SFC<
    PopoverModalFormProps & StateProps & DispatchProps
> = ({
    popoverModalProps,
    popoverNavbarProps,
    popoverFormInputProps,
    handleSaveChange,
    handleShowPopoverForm,
    children,
    presentationType,
    field,
    addButton,
    editButton,

    activePopover,
    isPopoverModalFormOpen,
    closePopoverModalForm,
    openPopoverModalForm,
    updateActivePopover
}) => {
    const handleClosePopoverModal = () => {
        switch (presentationType) {
            case 'popover':
            default:
                updateActivePopover('')
                break
            case 'modal':
                closePopoverModalForm()
                setTimeout(() => {
                    updateActivePopover('')
                }, 500)
                break
        }
    }

    const getClickableView = (mode: string) => {
        const clonedPopoverModalChild = React.cloneElement(children, {
            handleSaveChange: (fieldVal: string) =>
                handleSaveChange &&
                handleSaveChange(handleClosePopoverModal, fieldVal),
            key: `${field}_PopoverModalChild`
        })

        switch (presentationType) {
            case 'modal':
                return isPopoverModalFormOpen !== 'close' &&
                    field === activePopover
                    ? ReactDOM.createPortal(
                          <MobilePopover
                              child={clonedPopoverModalChild}
                              animation={isPopoverModalFormOpen}
                              navbarProps={popoverNavbarProps(
                                  handleClosePopoverModal
                              )}
                          />,
                          document.getElementById('mainModalLeft')
                      )
                    : null
            case 'popover':
            default:
                return (
                    <PopoverContainer
                        id={`PopoverModalForm_${field}`}
                        popoverProps={popoverModalProps(
                            handleClosePopoverModal
                        )}
                        targetParent="mainModalLeft"
                        onClick={showForm}
                        showPopover={activePopover === field}
                    >
                        {[
                            mode === 'add' ? addButton : editButton,
                            clonedPopoverModalChild
                        ]}
                    </PopoverContainer>
                )
        }
    }

    const handleOpenModal = () => {
        updateActivePopover(field)
        openPopoverModalForm()
    }

    const showForm = () => {
        const activeField = activePopover === field ? '' : field
        updateActivePopover(activeField)
        handleShowPopoverForm()
    }

    const getRowOnClickAction = () => {
        switch (presentationType) {
            case 'modal':
                return handleOpenModal
            case 'popover':
            default:
                return showForm
        }
    }

    const inputTypeProps = {
        ...popoverFormInputProps,
        startEditingText: getRowOnClickAction(),
        updateText: (fieldVal: string) =>
            handleSaveChange(handleClosePopoverModal, fieldVal),
        deleteText: () => handleSaveChange(handleClosePopoverModal, '')
    }

    return (
        <div
            style={{
                display: 'flex',
                minHeight: 72,
                borderBottom: `1px solid ${titanium}`
            }}
            id={`popoverModal_${field}`}
        >
            <PopoverFormInput
                {...inputTypeProps}
                addButton={getClickableView('add')}
                editButton={getClickableView('edit')}
            />
        </div>
    )
}

PopoverModalForm.defaultProps = {
    addButton: <PlusIcon fill={titanium} key="popoverModalForm1" />,
    editButton: <ChangeIcon key="popoverModalForm1" fill={titanium} />
}

const mapStateToProps = (state: State): StateProps => ({
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state),
    activePopover: getActivePopover(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): DispatchProps => {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(PopoverModalForm)
