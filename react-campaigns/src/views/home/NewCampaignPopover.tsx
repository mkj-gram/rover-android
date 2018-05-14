/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { closeNewCampaignPopover, openNewCampaignPopover } from '../../actions'
import {
    getIsCreatingCampaign,
    getIsNewCampaignPopoverClosing,
    getIsNewCampaignPopoverOpen
} from '../../reducers'
import LoadingIndicator from './LoadingIndicator'

import {
    beige,
    Button,
    CalendarIcon,
    ChevronRightIcon,
    cloud,
    graphite,
    LinkIcon,
    NavBar,
    steel,
    Text,
    titanium,
    turquoise,
    PhoneIcon,
    PlusSquareIcon,
    white,
    ZapIcon,
    PopoverContainer,
    ChevronLeftIcon
} from '@rover/ts-bootstrap/dist/src'

export interface NewCampaignPopoverProps {
    media: Media
    onCreate: (name: string, type: CampaignType) => void
}

export interface NewCampaignPopoverState {
    contentState: 'campaign-types' | 'name-campaign' | 'loading'
    isEditingCampaignName: boolean
    newCampaignType?: CampaignType
    newCampaignName: string
}

export interface DispatchProps {
    closeNewCampaignPopover: () => void
    openNewCampaignPopover: () => void
}

export interface StateProps {
    isNewCampaignPopoverOpen: boolean
    isNewCampaignPopoverClosing: boolean
}

class NewCampaignPopover extends React.PureComponent<
    NewCampaignPopoverProps & DispatchProps & StateProps,
    NewCampaignPopoverState
> {
    constructor(props: NewCampaignPopoverProps & DispatchProps & StateProps) {
        super(props)

        this.state = {
            contentState: 'campaign-types',
            isEditingCampaignName: false,
            newCampaignName: ''
        }
        this.handleOpenClose = this.handleOpenClose.bind(this)
        this.getRightButtonCallback = this.getRightButtonCallback.bind(this)
    }

    componentWillReceiveProps(
        nextProps: NewCampaignPopoverProps & DispatchProps & StateProps
    ) {
        const { isNewCampaignPopoverOpen } = this.props

        if (isNewCampaignPopoverOpen && !nextProps.isNewCampaignPopoverOpen) {
            this.setState({
                contentState: 'campaign-types',
                newCampaignName: '',
                isEditingCampaignName: false
            })
        }
    }

    getLeftButtonCallback(): () => void {
        const { contentState } = this.state
        switch (contentState) {
            case 'campaign-types':
                return () => this.handleOpenClose()
            case 'name-campaign':
                return () =>
                    this.setState({
                        contentState: 'campaign-types',
                        isEditingCampaignName: false
                    })
            case 'loading':
            default:
                return () => null
        }
    }

    getRightButtonCallback() {
        const { newCampaignType } = this.state
        return () =>
            this.setState(
                {
                    contentState: 'loading'
                },
                () =>
                    this.props.onCreate(
                        this.state.newCampaignName,
                        newCampaignType
                    )
            )
    }

    getLeftButton() {
        const { contentState } = this.state
        switch (contentState) {
            case 'campaign-types':
                return 'Cancel'
            case 'name-campaign':
                return 'Back'
            case 'loading':
            default:
                return ''
        }
    }

    getRightButton(): string {
        const { contentState } = this.state

        switch (contentState) {
            case 'campaign-types':
                return ''
            case 'name-campaign':
                return 'Save'
            case 'loading':
            default:
                return ''
        }
    }

    getTitle(): string {
        const { contentState, newCampaignType } = this.state

        switch (contentState) {
            case 'campaign-types':
                return 'New Campaign Type'
            case 'name-campaign':
                return this.getReadableCampaignName(newCampaignType)
            case 'loading':
            default:
                return ''
        }
    }

    getCampaignSubtext(type: CampaignType): string {
        // tslint:disable-next-line:switch-default
        switch (type) {
            case 'SCHEDULED_NOTIFICATION':
                return 'Delivered at a given date and time'
            case 'AUTOMATED_NOTIFICATION':
                return 'Delivered when a specific event occurs'
            case 'INTERSTITIAL':
                return 'Presented when the app is opened'
            case 'WEB':
                return 'Presented manually through other channels'
        }
    }

    handleOpenClose(): void {
        const {
            closeNewCampaignPopover,
            isNewCampaignPopoverOpen,
            openNewCampaignPopover
        } = this.props
        if (isNewCampaignPopoverOpen) {
            this.setState(
                { contentState: 'campaign-types' },
                closeNewCampaignPopover
            )
        } else {
            openNewCampaignPopover()
        }
    }

    getCampaignIcon(type: CampaignType): JSX.Element {
        const { media } = this.props
        // tslint:disable-next-line:switch-default
        switch (type) {
            case 'SCHEDULED_NOTIFICATION':
                return (
                    <CalendarIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'AUTOMATED_NOTIFICATION':
                return (
                    <ZapIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'INTERSTITIAL':
                return (
                    <PhoneIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
            case 'WEB':
                return (
                    <LinkIcon
                        fill={steel}
                        height="20"
                        width="20"
                        viewBox="0 0 24 24"
                    />
                )
        }
    }

    getReadableCampaignName(type: CampaignType): string {
        // tslint:disable-next-line:switch-default
        switch (type) {
            case 'SCHEDULED_NOTIFICATION':
                return 'Scheduled Notification'
            case 'AUTOMATED_NOTIFICATION':
                return 'Automated Notification'
            case 'INTERSTITIAL':
                return 'Interstitial Experience'
            case 'WEB':
                return 'Web/Social Experience'
        }
    }

    renderCampaignIcon(type: CampaignType) {
        let style: React.CSSProperties = {
            height: 40,
            width: 40,
            borderRadius: 40,
            border: 'none',
            background: cloud,
            marginRight: 16,
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
        return <div style={style}>{this.getCampaignIcon(type)}</div>
    }

    renderCampaignListElement(type: CampaignType) {
        const { media } = this.props
        return (
            <div
                id={`newCampaign-${type}`}
                style={{
                    width: '100%',
                    padding: media === 'Mobile' ? '0 24px' : '0 16px'
                }}
                onMouseOver={() =>
                    (document.getElementById(
                        `newCampaign-${type}`
                    ).style.backgroundColor = beige)
                }
                onMouseOut={() =>
                    (document.getElementById(
                        `newCampaign-${type}`
                    ).style.backgroundColor = white)
                }
                onClick={() =>
                    this.setState({
                        contentState: 'name-campaign',
                        newCampaignType: type
                    })
                }
            >
                <div
                    style={{
                        width: '100%',
                        height: media === 'Mobile' ? 96 : 80,
                        borderBottom:
                            (type !== 'WEB' || media === 'Mobile') &&
                            `1px solid ${cloud}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        boxSizing: 'border-box'
                    }}
                >
                    {this.renderCampaignIcon(type)}
                    <div
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        <Text
                            size="medium"
                            text={this.getReadableCampaignName(type)}
                        />
                        <Text
                            size="small"
                            label={true}
                            text={this.getCampaignSubtext(type)}
                            textStyle={{
                                display: 'block',
                                width: 270,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                overflowWrap: 'break-word',
                                textOverflow: 'ellipsis'
                            }}
                        />
                    </div>
                    <ChevronRightIcon
                        style={{
                            transform: `scale(${5 / 6})`,
                            flex: 'none'
                        }}
                        fill={titanium}
                    />
                </div>
            </div>
        )
    }

    getNavbarLeftElem() {
        const { media } = this.props
        const { contentState } = this.state

        if (contentState === 'name-campaign') {
            return (
                <div
                    style={{
                        display: 'flex',
                        marginLeft: media === 'Mobile' ? 16 : -8
                    }}
                    onClick={this.getLeftButtonCallback()}
                >
                    <ChevronLeftIcon fill="#000" />
                    <Button
                        text="Back"
                        type="disabled"
                        style={{
                            innerStyle: {
                                fontSize: 17,
                                padding: 0,
                                color: steel
                            },
                            outerStyle: {
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                background: 'none'
                            }
                        }}
                    />
                </div>
            )
        }
        return null
    }

    renderContent() {
        const { onCreate, media } = this.props
        const {
            contentState,
            isEditingCampaignName,
            newCampaignName,
            newCampaignType
        } = this.state
        return (
            <div>
                {contentState === 'campaign-types' && (
                    <div>
                        {this.renderCampaignListElement(
                            'SCHEDULED_NOTIFICATION'
                        )}
                        {this.renderCampaignListElement(
                            'AUTOMATED_NOTIFICATION'
                        )}
                        {this.renderCampaignListElement('INTERSTITIAL')}
                        {this.renderCampaignListElement('WEB')}
                    </div>
                )}
                {contentState === 'name-campaign' && (
                    <div
                        style={{
                            padding: media === 'Mobile' ? '0 24px' : '0 16px'
                        }}
                    >
                        <div
                            style={{
                                height: media === 'Mobile' ? 71 : 56,
                                borderBottom:
                                    media === 'Mobile'
                                        ? `1px solid ${titanium}`
                                        : undefined,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={() =>
                                this.setState({ isEditingCampaignName: true })
                            }
                        >
                            <Text
                                text={newCampaignName}
                                textStyle={{ width: 350 }}
                                id="new-campaigns-popover-name"
                                contentEditable={isEditingCampaignName}
                                handleChange={(str: string) => {
                                    if (str.length !== 0) {
                                        this.setState(
                                            {
                                                contentState: 'loading'
                                            },
                                            () => onCreate(str, newCampaignType)
                                        )
                                    } else {
                                        this.setState({
                                            isEditingCampaignName: false
                                        })
                                    }
                                }}
                                handleBlurChange={(newCampaignName: string) => {
                                    this.setState({
                                        newCampaignName,
                                        isEditingCampaignName: false
                                    })
                                }}
                                onBlurChange={true}
                                placeholder={true}
                                placeholderText="Enter campaign name"
                                size="medium"
                            />
                        </div>
                    </div>
                )}
                {contentState === 'loading' && (
                    <div
                        style={{
                            height: media === 'Mobile' ? '100%' : 56,
                            padding: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <LoadingIndicator />
                    </div>
                )}
            </div>
        )
    }

    render() {
        const {
            media,
            onCreate,
            isNewCampaignPopoverOpen,
            isNewCampaignPopoverClosing
        } = this.props
        const { contentState, newCampaignName, newCampaignType } = this.state

        const popoverProps = {
            placement: media === 'Desktop' ? 'bottom-start' : 'bottom-end',
            toggle: this.handleOpenClose,
            navBarProperties: {
                title: this.getTitle(),
                buttonRight: this.getRightButton(),
                buttonLeft: this.getLeftButton(),
                buttonLeftCallback: this.getLeftButtonCallback(),
                buttonRightCallback: this.getRightButtonCallback(),
                customLeftElem: this.getNavbarLeftElem(),
                id: 'navBarId',
                style: {
                    containerStyle: {
                        borderRadius: '3px 3px 0px 0px',
                        padding: 16
                    },
                    buttonLeftStyle: {
                        outerStyle: {
                            height: 17
                        }
                    },
                    buttonRightStyle: {
                        outerStyle: {
                            marginRight: 0
                        }
                    }
                }
            },
            arrowColors: {
                primary: cloud,
                secondary: white,
                border: titanium
            }
        }

        const targetId = 'desktop-new-campaign-button'
        const Fragment = React.Fragment

        return (
            <Fragment>
                <PopoverContainer
                    id="desktop-new-campaign-button"
                    popoverProps={popoverProps}
                    onClick={this.handleOpenClose}
                    targetParent="root"
                    showPopover={isNewCampaignPopoverOpen && media !== 'Mobile'}
                >
                    {media === 'Desktop' ? (
                        <Button
                            text="New Campaign"
                            type="primary"
                            size="small"
                        />
                    ) : (
                        <PlusSquareIcon fill={turquoise} />
                    )}
                    <div
                        style={{
                            display: 'flex',
                            height: 'auto',
                            width: 384,
                            flexDirection: 'column'
                        }}
                    >
                        {this.renderContent()}
                    </div>
                </PopoverContainer>

                {isNewCampaignPopoverOpen &&
                    media === 'Mobile' && (
                        <div
                            id="sendTestId"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                zIndex: 2,
                                position: 'absolute',
                                background: white,
                                top: 0,
                                left: 0,
                                animation: `${
                                    isNewCampaignPopoverClosing
                                        ? 'close'
                                        : 'open'
                                } 300ms ease`,
                                overflowY: 'scroll'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <NavBar
                                    buttonRight={this.getRightButton()}
                                    buttonLeft={this.getLeftButton()}
                                    buttonRightCallback={this.getRightButtonCallback()}
                                    buttonLeftCallback={this.getLeftButtonCallback()}
                                    style={{
                                        buttonLeftStyle: {
                                            outerStyle: {
                                                marginLeft: 24
                                            }
                                        },
                                        buttonRightStyle: {
                                            outerStyle: {
                                                marginRight: 24
                                            }
                                        }
                                    }}
                                    title={this.getTitle()}
                                    customLeftElem={this.getNavbarLeftElem()}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginBottom: 24
                                    }}
                                >
                                    {this.renderContent()}
                                </div>
                            </div>
                        </div>
                    )}
            </Fragment>
        )
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>,
    ownProps: NewCampaignPopoverProps
): DispatchProps => {
    const { media } = ownProps
    return {
        closeNewCampaignPopover: () => {
            if (media === 'Mobile') {
                dispatch({ type: 'START_CLOSING_NEW_CAMPAIGN_POPOVER' })
                setTimeout(() => dispatch(closeNewCampaignPopover()), 295)
            } else {
                dispatch(closeNewCampaignPopover())
            }
        },
        openNewCampaignPopover: () => dispatch(openNewCampaignPopover())
    }
}

const mapStateToProps = (state: State): StateProps => ({
    isNewCampaignPopoverClosing: getIsNewCampaignPopoverClosing(state),
    isNewCampaignPopoverOpen: getIsNewCampaignPopoverOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaignPopover)
