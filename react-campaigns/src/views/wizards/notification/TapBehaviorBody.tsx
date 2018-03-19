/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import * as ReactDOM from 'react-dom'

import {
    Text,
    titanium,
    white,
    Button,
    turquoise,
    aquamarine,
    ChangeIcon,
    PopoverContainer,
    Alert
} from '@rover/ts-bootstrap/dist/src'
import TapBehaviorRow from './TapBehaviorRow'
import PopoverTextRadioButtonComponent from '../../utils/PopoverTextRadioButtonComponent'
import NotificationMobilePopoverContainer from './NotificationMobilePopoverContainer'

import {
    updateEditableCampaign,
    openTapBehaviorWebsitePresentation,
    closeTapBehaviorWebsitePresentation
} from '../../../actions'
import { getIsTapBehaviorWebsitePresentationOpen } from '../../../reducers'
import UpdateEditableUIStateProperty from '../../utils/UpdateEditableUIStateProperty'

export interface TapBehaviorBodyProps {
    device?: string
    selectedTapOption?: NotificationTapBehaviorType
    campaign?: ScheduledCampaign | AutomatedNotificationCampaign
}

export interface TapBehaviorBodyState {
    urlContentEditable: boolean
    displayName: StringMap<string>
    showWebsitePresentationPopover: boolean
}

export interface StateProps {
    editableCampaign: AutomatedNotificationCampaign | ScheduledCampaign
    isTapBehaviorWebsitePresentationOpen: string
}

export interface DispatchProps {
    updateEditableCampaign: (val: object) => void
    openTapBehaviorWebsitePresentation: () => void
    closeTapBehaviorWebsitePresentation: () => void
}

const Fragment = React.Fragment

class TapBehaviorBody extends React.Component<
    TapBehaviorBodyProps & StateProps & DispatchProps,
    TapBehaviorBodyState
> {
    constructor(props: TapBehaviorBodyProps & StateProps & DispatchProps) {
        super(props)

        this.state = {
            urlContentEditable: false,
            displayName: {
                IN_APP: 'Within my app',
                IN_BROWSER: 'In a browser'
            },
            showWebsitePresentationPopover: false
        }
        this.experienceAlert = this.experienceAlert.bind(this)
        this.deepLinkForm = this.deepLinkForm.bind(this)
        this.websiteForm = this.websiteForm.bind(this)
        this.handleURLChange = this.handleURLChange.bind(this)
        this.getClickableView = this.getClickableView.bind(this)
        this.handleShowPresentationPopover = this.handleShowPresentationPopover.bind(
            this
        )
        this.handleSelectPresentationType = this.handleSelectPresentationType.bind(
            this
        )
        this.websitePresentRow = this.websitePresentRow.bind(this)
        this.getWebsitePresentRowClickable = this.getWebsitePresentRowClickable.bind(
            this
        )
    }

    componentWillReceiveProps(nextProps: TapBehaviorBodyProps) {
        if (this.props.selectedTapOption !== nextProps.selectedTapOption) {
            this.setState({
                urlContentEditable: false
            })
        }
    }

    handleURLChange(notificationTapBehaviorUrl: string) {
        const { editableCampaign } = this.props
        this.props.updateEditableCampaign({
            notificationTapBehaviorUrl,
            UIState: UpdateEditableUIStateProperty(
                'notification',
                editableCampaign.UIState as UIStateInterface,
                'isValidContent',
                'tapBehavior',
                notificationTapBehaviorUrl.length !== 0
            )
        })
        this.setState({
            urlContentEditable: false
        })
    }

    handleShowPresentationPopover() {
        this.setState({
            showWebsitePresentationPopover: !this.state
                .showWebsitePresentationPopover
        })
    }

    handleSelectPresentationType(
        notificationTapPresentationType: NotificationTapPresentationType
    ) {
        const {
            updateEditableCampaign,
            device,
            closeTapBehaviorWebsitePresentation
        } = this.props

        updateEditableCampaign({
            notificationTapPresentationType
        })
        this.setState({
            showWebsitePresentationPopover: false
        })
        if (device === 'Mobile') {
            closeTapBehaviorWebsitePresentation()
        }
    }

    getClickableView() {
        const { device, editableCampaign } = this.props
        const { showWebsitePresentationPopover, displayName } = this.state

        const popoverProps = {
            placement: 'left',
            containerStyle: {
                width: 384,
                background: white,
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${titanium}`
            }
        }

        const getClickable = () => {
            switch (device) {
                case 'Desktop':
                    return (
                        <Button
                            text="Change"
                            type="regular"
                            mouseDownColors={{
                                active: turquoise,
                                inactive: aquamarine
                            }}
                            key="presentationType1"
                        />
                    )
                case 'Tablet':
                    return (
                        <ChangeIcon fill={titanium} key="presentationType1" />
                    )
                case 'Mobile':
                default:
                    return null
            }
        }

        return (
            <PopoverContainer
                id="presentationTypePopover"
                popoverProps={popoverProps}
                targetParent={
                    device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                }
                onClick={this.handleShowPresentationPopover}
                showPopover={showWebsitePresentationPopover}
            >
                {[
                    getClickable(),
                    <PopoverTextRadioButtonComponent
                        key="presentationType2"
                        names={['IN_APP', 'IN_BROWSER']}
                        onClick={this.handleSelectPresentationType}
                        selectedTapOption={
                            editableCampaign.notificationTapPresentationType
                        }
                        displayName={displayName}
                        device={device}
                    />
                ]}
            </PopoverContainer>
        )
    }

    experienceAlert() {
        return (
            <Alert
                message="Select the experience in a later step"
                type="info"
            />
        )
    }

    websitePresentRow() {
        const { displayName } = this.state
        const {
            editableCampaign,
            device,
            isTapBehaviorWebsitePresentationOpen
        } = this.props

        const row = (
            <Fragment>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text
                        text="How should it be presented?"
                        size="small"
                        label={true}
                    />
                    <Text
                        text={
                            displayName[
                                editableCampaign.notificationTapPresentationType
                            ]
                        }
                        size="large"
                    />
                </div>
                {this.getClickableView()}
            </Fragment>
        )

        switch (device) {
            case 'Mobile':
                const child = (
                    <PopoverTextRadioButtonComponent
                        key="presentationType2"
                        names={['IN_APP', 'IN_BROWSER']}
                        onClick={this.handleSelectPresentationType}
                        selectedTapOption={
                            editableCampaign.notificationTapPresentationType
                        }
                        displayName={displayName}
                        device={device}
                    />
                )
                return (
                    <Fragment>
                        <div
                            onClick={() =>
                                this.props.openTapBehaviorWebsitePresentation()
                            }
                        >
                            {row}
                        </div>
                        {isTapBehaviorWebsitePresentationOpen !== 'close' &&
                            ReactDOM.createPortal(
                                <NotificationMobilePopoverContainer
                                    title="How should the website be presented?"
                                    child={child}
                                    onClose={() =>
                                        this.props.closeTapBehaviorWebsitePresentation()
                                    }
                                    animation={
                                        isTapBehaviorWebsitePresentationOpen
                                    }
                                />,
                                document.getElementById('mainModalLeft')
                            )}
                    </Fragment>
                )
            case 'Desktop':
            case 'Tablet':
            default:
                return row
        }
    }

    websiteForm() {
        const { device, editableCampaign } = this.props

        const websiteURLRow = (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}
            >
                <Text text="Which website?" size="small" label={true} />
                <div
                    onClick={() =>
                        this.setState({
                            urlContentEditable: !this.state.urlContentEditable
                        })
                    }
                >
                    <Text
                        text={editableCampaign.notificationTapBehaviorUrl}
                        size="large"
                        contentEditable={this.state.urlContentEditable}
                        handleChange={this.handleURLChange}
                        placeholder={true}
                        id="websiteURL"
                        onBlurChange={true}
                        placeholderText="Enter website URL"
                    />
                </div>
            </div>
        )

        return (
            <Fragment>
                <TapBehaviorRow
                    handleClick={
                        device === 'Tablet'
                            ? () =>
                                  this.setState({
                                      urlContentEditable: !this.state
                                          .urlContentEditable
                                  })
                            : () => null
                    }
                >
                    {websiteURLRow}
                </TapBehaviorRow>
                <TapBehaviorRow
                    handleClick={this.getWebsitePresentRowClickable(device)}
                >
                    {this.websitePresentRow()}
                </TapBehaviorRow>

                <Alert
                    message="Android will always present in the browser"
                    type="warn"
                />
            </Fragment>
        )
    }

    getWebsitePresentRowClickable(device: string) {
        switch (device) {
            case 'Mobile':
                return this.props.openTapBehaviorWebsitePresentation
            case 'Tablet':
                return this.handleShowPresentationPopover
            case 'Desktop':
            default:
                return () => {}
        }
    }

    deepLinkForm() {
        const { device, editableCampaign } = this.props
        const deeplinkRow = (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}
            >
                <Text text="Which deep link?" size="small" label={true} />
                <div
                    onClick={() =>
                        this.setState({
                            urlContentEditable: !this.state.urlContentEditable
                        })
                    }
                >
                    <Text
                        text={editableCampaign.notificationTapBehaviorUrl}
                        size="large"
                        contentEditable={this.state.urlContentEditable}
                        handleChange={this.handleURLChange}
                        placeholder={true}
                        id="deeplinkView"
                        onBlurChange={true}
                        placeholderText="Enter deep link URL"
                    />
                </div>
            </div>
        )

        return (
            <Fragment>
                <TapBehaviorRow
                    handleClick={
                        device === 'Tablet'
                            ? () =>
                                  this.setState({
                                      urlContentEditable: !this.state
                                          .urlContentEditable
                                  })
                            : () => null
                    }
                >
                    {deeplinkRow}
                </TapBehaviorRow>
            </Fragment>
        )
    }

    render() {
        const { device, selectedTapOption } = this.props

        switch (selectedTapOption) {
            case 'OPEN_EXPERIENCE':
                return this.experienceAlert()
            case 'OPEN_WEBSITE':
                return this.websiteForm()
            case 'OPEN_DEEP_LINK':
                return this.deepLinkForm()
            default:
                return <div />
        }
    }
}

const mapStateToProps = (state: State): StateProps => ({
    editableCampaign: state.editableCampaign,
    isTapBehaviorWebsitePresentationOpen: getIsTapBehaviorWebsitePresentationOpen(
        state
    )
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
    return {
        updateEditableCampaign: val => {
            dispatch(updateEditableCampaign(val))
        },
        openTapBehaviorWebsitePresentation: () => {
            dispatch(openTapBehaviorWebsitePresentation())
        },
        closeTapBehaviorWebsitePresentation: () => {
            dispatch(closeTapBehaviorWebsitePresentation())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TapBehaviorBody)
