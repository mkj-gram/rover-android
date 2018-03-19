/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import { InjectedProps } from '../../utils/ResponsiveContainer'
import { updateEditableCampaign } from '../../../actions'
import { turquoise } from '@rover/ts-bootstrap/dist/src'

import UpdateEditableUIStateProperty from '../../utils/UpdateEditableUIStateProperty'

export interface DispatchProps {
    updateEditableCampaign: (val: object, delay?: boolean) => void
}

export interface TempMediaAndQueryProps extends InjectedProps {
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface StateProps {
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface statez {
    isValid: boolean
}

class TempMediaAndQuery extends React.Component<
    TempMediaAndQueryProps & DispatchProps & StateProps,
    statez
> {
    constructor(props: TempMediaAndQueryProps & DispatchProps & StateProps) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
        let isValid = (props.editableCampaign.UIState as UIStateInterface)
            .notification.messageAndMedia.isValidContent
        this.state = {
            isValid
        }
    }

    handleClick() {
        this.setState({
            isValid: !this.state.isValid
        })

        const UIState = UpdateEditableUIStateProperty(
            'notification',
            this.props.editableCampaign.UIState as UIStateInterface,
            'isValidContent',
            'messageAndMedia',
            !this.state.isValid
        )

        this.props.updateEditableCampaign({ UIState })
    }

    render() {
        return (
            <div
                style={{
                    width: 200,
                    height: 200,
                    background: turquoise,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 16
                }}
                onClick={() => this.handleClick()}
            >
                isValidContent? : {this.state.isValid ? 'true' : 'false'}
            </div>
        )
    }
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: state.editableCampaign
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        updateEditableCampaign: (campaign, delay = false) => {
            if (delay) {
                setTimeout(() => {
                    dispatch(updateEditableCampaign(campaign))
                }, 500)
            } else {
                dispatch(updateEditableCampaign(campaign))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TempMediaAndQuery)
