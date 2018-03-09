/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'
import { white, Button } from '@rover/ts-bootstrap/dist/src'

import { getCampaign } from '../../reducers/campaigns'
import WizardModal from './WizardModal'

import {
    openNotificationDeliveryModal,
    updateEditableCampaign,
    createEditableCampaign,
    updateNotificationSettings,
    updateLastVewPage
} from '../../actions'

import { getLastViewPage } from '../../reducers'

export interface FormComponentProps {
    type: string
    jsxPages: StringMap<JSX.Element>
    isNotificationDeliveryModalOpen: string
}

export interface StateProps {
    campaigns: StringMap<Campaign>
    lastViewPage: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface FormComponentState {
    page?: string
    progress?: number
    campaignId: string
    campaign: Campaign
    pages: string[]
    lastViewedPage: string
}

export interface DispatchProps {
    openNotificationDeliveryModal: (open: boolean) => void
    updateEditableCampaign: (val: object, delay?: boolean) => void
    createEditableCampaign: (
        campaign: ScheduledCampaign | AutomatedNotificationCampaign
    ) => void
    updateNotificationSettings: (
        campaign: ScheduledCampaign | AutomatedNotificationCampaign,
        campaignId: string
    ) => void
    updateLastVewPage: (page: string) => void
}

class FormComponent extends React.Component<
    FormComponentProps & StateProps & DispatchProps,
    FormComponentState
> {
    constructor(props: StateProps & FormComponentProps & DispatchProps) {
        super(props)
        const campaignId = parse(location.search.substring(1)).campaignId
        const campaign = getCampaign(props.campaigns, campaignId)

        const pages = Object.keys(props.jsxPages)
        this.state = {
            page: pages[0],
            progress: 0,
            campaign,
            campaignId,
            pages,
            lastViewedPage: props.lastViewPage
        }

        this.getNextPrevious = this.getNextPrevious.bind(this)
        this.calculateNewUiState = this.calculateNewUiState.bind(this)
        this.updateLocalUIStateProgress = this.updateLocalUIStateProgress.bind(
            this
        )
        this.handleNotificationDeliveryUpdate = this.handleNotificationDeliveryUpdate.bind(
            this
        )
        this.getLeftHeader = this.getLeftHeader.bind(this)
        this.getRightHeader = this.getRightHeader.bind(this)
        this.getORValue = this.getORValue.bind(this)
        this.calculateSaveCloseUiState = this.calculateSaveCloseUiState.bind(
            this
        )
    }

    componentDidMount() {
        const {
            editableCampaign,
            type,
            isNotificationDeliveryModalOpen
        } = this.props
        const { pages, lastViewedPage } = this.state

        if (
            editableCampaign.UIState.length === 0 ||
            JSON.parse(editableCampaign.UIState)[type] === undefined
        ) {
            this.setState({
                progress: 0
            })
        } else {
            let parsedState = JSON.parse(editableCampaign.UIState)
            let foundPage = false
            Object.keys(parsedState[type]).forEach((page, index) => {
                if (parsedState[type][page] === false && !foundPage) {
                    foundPage = true
                    this.setState({
                        page,
                        progress: index / pages.length * 100
                    })
                }
            })
            if (!foundPage) {
                this.setState({
                    page:
                        isNotificationDeliveryModalOpen !== 'closing'
                            ? pages[0]
                            : lastViewedPage,
                    progress: 0
                })
            }
        }
    }

    componentWillReceiveProps(nextProps: StateProps & FormComponentProps) {
        const { type } = this.props
        const { pages, page } = this.state

        let parsedState = JSON.parse(nextProps.editableCampaign.UIState)
        if (parsedState !== JSON.parse(this.props.editableCampaign.UIState)) {
            const denominator: number = Object.keys(parsedState[type]).length
            let numerator: number = Object.values(
                parsedState[type]
                // tslint:disable-next-line:no-any
            ).filter((v: any) => v).length
            let progress
            if (numerator % denominator === 0) {
                // In 100% completion state
                numerator = pages.indexOf(page)
            }
            this.setState({
                progress: Math.round(numerator / denominator * 100)
            })
        }
    }

    calculateNewUiState(
        pageIndex: number,
        value: boolean,
        onFinish: boolean = false
    ) {
        const { pages, campaign } = this.state
        const { editableCampaign, type } = this.props

        let editableUIState = JSON.parse(editableCampaign.UIState)
        let campaignUIState
        if (campaign.UIState.length !== 0) {
            campaignUIState = JSON.parse(campaign.UIState)
        }

        let UIState
        if (!onFinish || campaignUIState == undefined) {
            UIState = JSON.stringify({
                ...editableUIState,
                [type]: {
                    ...editableUIState[type],
                    [pages[pageIndex]]: value
                }
            })
        } else {
            UIState = JSON.stringify({
                ...editableUIState,
                [type]: {
                    ...this.getORValue(
                        campaignUIState[type],
                        editableUIState[type]
                    ),
                    [pages[pageIndex]]:
                        value || campaignUIState.notification[pages[pageIndex]]
                }
            })
        }

        return UIState
    }

    updateLocalUIStateProgress(pageIndex: number, value: boolean) {
        let UIState = this.calculateNewUiState(pageIndex, value)

        this.props.updateEditableCampaign({
            UIState
        })
    }

    getORValue(
        campaignNotificationDelivery: StringMap<boolean>,
        uiStateNotificationDelivery: StringMap<boolean>
    ): object {
        let obj: StringMap<boolean> = {}
        Object.keys(campaignNotificationDelivery).forEach(item => {
            obj[item] =
                campaignNotificationDelivery[item] ||
                uiStateNotificationDelivery[item]
        })
        return obj
    }

    calculateSaveCloseUiState() {
        const { campaign } = this.state
        const { editableCampaign, type } = this.props
        const editableUIState = JSON.parse(editableCampaign.UIState)
        const campaignUIState =
            campaign.UIState.length !== 0
                ? JSON.parse(campaign.UIState)
                : undefined

        let UIState
        if (campaignUIState === undefined) {
            UIState = JSON.stringify({
                ...editableUIState
            })
        } else {
            UIState = JSON.stringify({
                ...editableUIState,
                [type]: {
                    ...this.getORValue(
                        campaignUIState[type],
                        editableUIState[type]
                    )
                }
            })
        }
        return UIState
    }

    handleNotificationDeliveryUpdate(
        currPage: string,
        saveAndClose: boolean = false
    ) {
        let { editableCampaign, type } = this.props
        const { pages, campaignId } = this.state

        const pageIndex = pages.indexOf(currPage)
        this.props.openNotificationDeliveryModal(false)

        const updatedEditableCampaign = {
            ...editableCampaign,
            UIState: !saveAndClose
                ? this.calculateNewUiState(pageIndex, true, true)
                : this.calculateSaveCloseUiState()
        }

        if (type === 'notification') {
            this.props.updateNotificationSettings(
                updatedEditableCampaign,
                campaignId
            )
        }

        this.props.updateEditableCampaign(updatedEditableCampaign, true)
    }

    getNextPrevious(direction: string, currPage: string) {
        const { editableCampaign } = this.props
        const { pages } = this.state

        const pageIndex = pages.indexOf(currPage)
        let view

        if (direction === 'next') {
            view = (
                <Button
                    text={pageIndex === pages.length - 1 ? 'Finish' : 'Next'}
                    size="large"
                    type="primary"
                    onClick={() => {
                        if (pageIndex !== pages.length - 1) {
                            this.setState(
                                {
                                    page: pages[pageIndex + 1]
                                },
                                () => {
                                    this.updateLocalUIStateProgress(
                                        pageIndex,
                                        true
                                    )
                                }
                            )
                        } else {
                            this.handleNotificationDeliveryUpdate(currPage)
                        }
                    }}
                />
            )
        } else {
            if (pageIndex === 0) {
                view = <div />
            } else {
                view = (
                    <Button
                        text="Back"
                        size="large"
                        type="secondary"
                        onClick={() => {
                            this.setState(
                                {
                                    page: pages[pageIndex - 1]
                                },
                                () =>
                                    this.updateLocalUIStateProgress(
                                        pageIndex - 1,
                                        false
                                    )
                            )
                        }}
                    />
                )
            }
        }

        return view
    }

    getLeftHeader() {
        const { campaign, page } = this.state
        const { type } = this.props
        return (
            <Button
                text="Cancel"
                type="regular"
                onClick={() => {
                    this.props.updateLastVewPage(page)
                    this.props.openNotificationDeliveryModal(false)

                    if (
                        campaign.UIState.length === 0 ||
                        JSON.parse(campaign.UIState)[type] === undefined
                    ) {
                        this.props.createEditableCampaign(campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign)
                    } else {
                        this.props.updateEditableCampaign(campaign, true)
                    }
                }}
            />
        )
    }

    getRightHeader(currPage: string) {
        const { pages, page } = this.state
        return (
            <Button
                text="Save and Close"
                type="regular"
                onClick={() => {
                    this.props.updateLastVewPage(page)

                    this.handleNotificationDeliveryUpdate(currPage, true)
                }}
            />
        )
    }

    render() {
        const Fragment = React.Fragment
        const { jsxPages } = this.props
        const { progress, page } = this.state

        const wizardProps = {
            progress,
            rightToolbarElement: this.getNextPrevious('next', page),
            leftToolbarElement: this.getNextPrevious('back', page),
            leftHeaderElement: this.getLeftHeader(),
            rightHeaderElement: this.getRightHeader(page)
        }

        return <WizardModal {...wizardProps}>{jsxPages[page]}</WizardModal>
    }
}

const mapStateToProps = (state: State): StateProps => ({
    campaigns: state.campaigns,
    editableCampaign: state.editableCampaign,
    lastViewPage: getLastViewPage(state)
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        openNotificationDeliveryModal: open => {
            dispatch(openNotificationDeliveryModal(open))
        },
        updateEditableCampaign: (campaign, delay = false) => {
            if (delay) {
                setTimeout(() => {
                    dispatch(updateEditableCampaign(campaign))
                }, 500)
            } else {
                dispatch(updateEditableCampaign(campaign))
            }
        },
        createEditableCampaign: campaign => {
            setTimeout(() => {
                dispatch(
                    createEditableCampaign(campaign as
                        | ScheduledCampaign
                        | AutomatedNotificationCampaign)
                )
            }, 500)
        },
        updateNotificationSettings: (campaign, campaignId) => {
            setTimeout(() => {
                dispatch(
                    updateNotificationSettings(
                        campaign as
                            | ScheduledCampaign
                            | AutomatedNotificationCampaign,
                        campaignId
                    )
                )
            }, 500)
        },
        updateLastVewPage: page => {
            dispatch(updateLastVewPage(page))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormComponent)
