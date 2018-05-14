/// <reference path="../../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'
import {
    Button,
    CircleCloseIcon,
    PlusIcon,
    Text,
    titanium,
    turquoise,
    aquamarine
} from '@rover/ts-bootstrap/dist/src'
import { updateEditableCampaign } from '../../../../actions/'
import {
    getActivePopover,
    getEditableCampaign,
    getEditableUIState
} from '../../../../reducers/'
import editableUIState from '../../../../reducers/editableUIState'

interface RichMediaUpdateButtonsProps {
    device: Media
}

interface RichMediaUpdateButtonsStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    editableUIState: editableUIState
}

interface RichMediaUpdateButtonsDispatchProps {
    updateEditableCampaign: (editedField: object) => void
}

const RichMediaUpdateButtons: React.SFC<
    RichMediaUpdateButtonsProps &
        RichMediaUpdateButtonsStateProps &
        RichMediaUpdateButtonsDispatchProps
> = ({ activePopover, editableCampaign, device, updateEditableCampaign }) => {
    const { notificationAttachment } = editableCampaign

    if (device === 'Tablet' && !notificationAttachment) {
        return <PlusIcon fill={titanium} />
    }
    if (
        activePopover !== 'notification-attachment-picker' &&
        device !== 'Desktop' &&
        notificationAttachment
    ) {
        return (
            <CircleCloseIcon
                fill={turquoise}
                onClick={e => {
                    e.stopPropagation()
                    updateEditableCampaign({ notificationAttachment: null })
                }}
            />
        )
    }
    if (device === 'Desktop' && !notificationAttachment) {
        return (
            <Button
                text="Add"
                type="regular"
                style={{
                    innerStyle: {
                        fontSize: 15
                    }
                }}
                mouseDownColors={{
                    active: turquoise,
                    inactive: aquamarine
                }}
            />
        )
    }
    if (device === 'Desktop' && notificationAttachment) {
        return (
            <div style={{ display: 'flex' }}>
                <Button
                    onClick={() =>
                        updateEditableCampaign({
                            notificationAttachment: null
                        })
                    }
                    text="Remove"
                    type="regular"
                    style={{
                        innerStyle: {
                            fontSize: 15,
                            marginRight: 8
                        }
                    }}
                    mouseDownColors={{
                        active: turquoise,
                        inactive: aquamarine
                    }}
                />
                <Button
                    text="Edit"
                    type="regular"
                    style={{
                        innerStyle: {
                            fontSize: 15
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
    return <div />
}

const mapStateToProps = (state: State): RichMediaUpdateButtonsStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state),
    editableUIState: getEditableUIState(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): RichMediaUpdateButtonsDispatchProps => ({
    updateEditableCampaign: (x: object) => dispatch(updateEditableCampaign(x))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    RichMediaUpdateButtons
)
