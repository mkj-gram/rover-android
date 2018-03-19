/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { parse } from 'qs'
import { connect, Dispatch } from 'react-redux'
import { white, Button } from '@rover/ts-bootstrap/dist/src'

import { getCampaign } from '../../reducers/campaigns'
import WizardModal from './WizardModal'
import UpdateEditableUIStateProperty from './UpdateEditableUIStateProperty'

import {
    openNotificationDeliveryModal,
    updateEditableCampaign,
    createEditableCampaign,
    updateNotificationSettings,
    updateLastVewPage
} from '../../actions'

import { getLastViewPage } from '../../reducers'

export interface FormComponentProps {
    type: UIStateType
    jsxPages: StringMap<JSX.Element>
    isNotificationDeliveryModalOpen: string
    device: string
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

        this.getNext = this.getNext.bind(this)
        this.getPrevious = this.getPrevious.bind(this)
        this.calculateNewUiState = this.calculateNewUiState.bind(this)
        this.updateLocalUIStateProgress = this.updateLocalUIStateProgress.bind(
            this
        )
        this.handleNotificationDeliveryUpdate = this.handleNotificationDeliveryUpdate.bind(
            this
        )
        this.getLeftHeader = this.getLeftHeader.bind(this)
        this.getRightHeader = this.getRightHeader.bind(this)
    }

    componentDidMount() {
        const {
            editableCampaign,
            type,
            isNotificationDeliveryModalOpen
        } = this.props
        const { pages, lastViewedPage } = this.state

        const { UIState } = editableCampaign

        if (
            Object.keys(UIState).length === 0 ||
            (UIState as UIStateInterface)[type] === undefined
        ) {
            this.setState({
                progress: 0
            })
        } else {
            let foundPage = false
            Object.keys(
                (editableCampaign.UIState as UIStateInterface)[type]
            ).forEach((page, index) => {
                let obj = (editableCampaign.UIState as UIStateInterface)[type][
                    page
                ]

                if (
                    (obj.seen === false || obj.isValidContent === false) &&
                    !foundPage
                ) {
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

        if (Object.keys(nextProps.editableCampaign.UIState).length !== 0) {
            const denominator: number = Object.keys(
                (nextProps.editableCampaign.UIState as UIStateInterface)[type]
            ).length

            const numerator = pages.indexOf(page)

            this.setState({
                progress: Math.round(numerator / denominator * 100)
            })
        }
    }

    calculateNewUiState(pageIndex: number, value: boolean) {
        const { pages } = this.state
        const { editableCampaign, type } = this.props

        return UpdateEditableUIStateProperty(
            type,
            editableCampaign.UIState as UIStateInterface,
            'seen',
            pages[pageIndex],
            (editableCampaign.UIState as UIStateInterface)[type][
                pages[pageIndex]
            ].seen || value
        )
    }

    updateLocalUIStateProgress(pageIndex: number, value: boolean) {
        const UIState = this.calculateNewUiState(pageIndex, value)

        this.props.updateEditableCampaign({
            UIState
        })
    }

    handleNotificationDeliveryUpdate(
        currPage: string,
        saveAndClose: boolean = false
    ) {
        let { editableCampaign, type } = this.props
        const { pages, campaignId } = this.state

        const pageIndex = pages.indexOf(currPage)
        this.props.openNotificationDeliveryModal(false)

        let UIState = JSON.stringify(
            !saveAndClose
                ? this.calculateNewUiState(pageIndex, true)
                : editableCampaign.UIState
        )
        const updatedEditableCampaign = {
            ...editableCampaign,
            UIState
        }

        if (type === 'notification') {
            this.props.updateNotificationSettings(
                updatedEditableCampaign as
                    | ScheduledCampaign
                    | AutomatedNotificationCampaign,
                campaignId
            )
        }

        this.props.updateEditableCampaign(updatedEditableCampaign, true)
    }

    getNext() {
        const { page, pages } = this.state
        const { editableCampaign, type } = this.props

        const pageIndex = pages.indexOf(page)
        const isValidContent =
            page.length !== 0
                ? (editableCampaign.UIState as UIStateInterface)[type][page]
                      .isValidContent
                : false

        return (
            <Button
                text={pageIndex === pages.length - 1 ? 'Finish' : 'Next'}
                size="large"
                type={isValidContent ? 'primary' : 'disabled'}
                overrideWidth={96}
                onClick={() => {
                    if (pageIndex !== pages.length - 1) {
                        this.setState(
                            {
                                page: pages[pageIndex + 1]
                            },
                            () => {
                                this.updateLocalUIStateProgress(pageIndex, true)
                            }
                        )
                    } else {
                        this.handleNotificationDeliveryUpdate(page)
                    }
                }}
            />
        )
    }

    getPrevious() {
        const { page, pages } = this.state
        const pageIndex = pages.indexOf(page)

        if (pageIndex === 0) {
            return <div />
        } else {
            return (
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
                        Object.keys(campaign.UIState).length === 0 ||
                        (campaign.UIState as UIStateInterface)[type] ===
                            undefined
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

    getRightHeader() {
        const { type, editableCampaign } = this.props
        const { pages, page, campaign } = this.state

        const showSaveAndClose = () => {
            const { UIState, ...rest } = campaign
            let keys = Object.keys(rest)
            for (let i = 0; i < keys.length; i++) {
                if (
                    ['string', 'number', 'boolean'].includes(
                        typeof (campaign as any)[keys[i]]
                    )
                ) {
                    if (
                        (campaign as any)[keys[i]] !==
                        (editableCampaign as any)[keys[i]]
                    ) {
                        return true
                    }
                } else {
                    if (
                        JSON.stringify((campaign as any)[keys[i]]) !==
                        JSON.stringify((editableCampaign as any)[keys[i]])
                    ) {
                        return true
                    }
                }
            }
            return false
        }
        let view
        if (showSaveAndClose()) {
            view = (
                <Button
                    text="Save and Close"
                    type="regular"
                    onClick={() => {
                        this.props.updateLastVewPage(page)
                        this.handleNotificationDeliveryUpdate(page, true)
                    }}
                />
            )
        } else {
            view = <div />
        }
        return view
    }

    render() {
        const Fragment = React.Fragment
        const { jsxPages, device } = this.props
        const { progress, page } = this.state

        const wizardProps = {
            progress,
            rightToolbarElement: this.getNext(),
            leftToolbarElement: this.getPrevious(),
            leftHeaderElement: this.getLeftHeader(),
            rightHeaderElement: this.getRightHeader(),
            device
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
