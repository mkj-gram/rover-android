/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { closeNewCampaignPopover, openNewCampaignPopover } from '../../actions'
import {
    getIsCreatingCampaign,
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
    Popover,
    white,
    ZapIcon
} from '@rover/ts-bootstrap/dist/src'

import { Manager, Target } from 'react-popper'

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
        const { newCampaignName, newCampaignType } = this.state
        return () =>
            this.setState(
                {
                    contentState: 'loading'
                },
                () => this.props.onCreate(newCampaignName, newCampaignType)
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
            case 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION':
                return 'Delivered at a given date and time'
            case 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION':
                return 'Delivered when a specific event occurs'
            case 'CAMPAIGN_TYPE_INTERSTITIAL':
                return 'Presented when the app is opened'
            case 'CAMPAIGN_TYPE_WEB':
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
        // tslint:disable-next-line:switch-default
        switch (type) {
            case 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION':
                return <CalendarIcon fill={steel} />
            case 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION':
                return <ZapIcon fill={steel} />
            case 'CAMPAIGN_TYPE_INTERSTITIAL':
                return <PhoneIcon fill={steel} />
            case 'CAMPAIGN_TYPE_WEB':
                return <LinkIcon fill={steel} />
        }
    }

    getReadableCampaignName(type: CampaignType): string {
        // tslint:disable-next-line:switch-default
        switch (type) {
            case 'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION':
                return 'Scheduled Notification'
            case 'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION':
                return 'Automated Notification'
            case 'CAMPAIGN_TYPE_INTERSTITIAL':
                return 'Interstitial Experience'
            case 'CAMPAIGN_TYPE_WEB':
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
                style={{ width: '100%', padding: '0 24px' }}
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
                        height: 79,
                        borderBottom:
                            (type !== 'CAMPAIGN_TYPE_WEB' ||
                                media === 'Mobile') &&
                            `1px solid ${cloud}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}
                >
                    {this.renderCampaignIcon(type)}
                    <div>
                        <Text
                            size="medium"
                            text={this.getReadableCampaignName(type)}
                        />
                        <ChevronRightIcon
                            style={{
                                transform: `scale(${5 / 6})`,
                                position: 'absolute',
                                right: 24
                            }}
                            fill={titanium}
                        />
                        <Text
                            size="small"
                            label={true}
                            text={this.getCampaignSubtext(type)}
                        />
                    </div>
                </div>
            </div>
        )
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
                            'CAMPAIGN_TYPE_SCHEDULED_NOTIFICATION'
                        )}
                        {this.renderCampaignListElement(
                            'CAMPAIGN_TYPE_AUTOMATED_NOTIFICATION'
                        )}
                        {this.renderCampaignListElement(
                            'CAMPAIGN_TYPE_INTERSTITIAL'
                        )}
                        {this.renderCampaignListElement('CAMPAIGN_TYPE_WEB')}
                    </div>
                )}
                {contentState === 'name-campaign' && (
                    <div style={{ padding: 16 }}>
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
        const { media, onCreate, isNewCampaignPopoverOpen } = this.props
        const { contentState, newCampaignName, newCampaignType } = this.state
        return (
            <Manager>
                <Target>
                    <div id="desktop-new-campaign-button">
                        {media === 'Desktop' ? (
                            <Button
                                onClick={this.handleOpenClose}
                                text="New Campaign"
                                type="primary"
                                size="small"
                            />
                        ) : (
                            <PlusSquareIcon
                                fill={turquoise}
                                onClick={this.handleOpenClose}
                            />
                        )}
                    </div>
                </Target>
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
                                animation: `open 300ms ease`,
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
                                    buttonLeftCallback={this.getLeftButtonCallback()}
                                    buttonRightCallback={this.getRightButtonCallback()}
                                    style={{
                                        buttonLeftStyle: {
                                            color: graphite
                                        },
                                        buttonRightStyle: {
                                            color: graphite
                                        }
                                    }}
                                    title={this.getTitle()}
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
                {isNewCampaignPopoverOpen &&
                    media !== 'Mobile' && (
                        <Popover
                            placement={
                                media === 'Desktop'
                                    ? 'bottom-start'
                                    : 'bottom-end'
                            }
                            containerStyle={{
                                height: 'auto',
                                width: 384,
                                background: white,
                                flexDirection: 'column',
                                borderRadius: 3,
                                border: `1px solid ${titanium}`,
                                zIndex: 1
                            }}
                            toggle={this.handleOpenClose}
                            navBarProperties={{
                                title: this.getTitle(),
                                buttonRight: this.getRightButton(),
                                buttonLeft: this.getLeftButton(),
                                buttonLeftCallback: this.getLeftButtonCallback(),
                                buttonRightCallback: this.getRightButtonCallback(),
                                id: 'navBarId',
                                style: {
                                    containerStyle: {
                                        borderRadius: '3px 3px 0px 0px',
                                        padding: 16
                                    },
                                    buttonLeftStyle: {
                                        outerStyle: {
                                            height: 17
                                        },
                                        innerStyle: {
                                            color: graphite
                                        }
                                    }
                                }
                            }}
                            arrowColors={{
                                primary: cloud,
                                secondary: white,
                                border: titanium
                            }}
                            toggleable={true}
                            targetId="desktop-new-campaign-button"
                            targetParent="root"
                        >
                            {this.renderContent()}
                        </Popover>
                    )}
            </Manager>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
    closeNewCampaignPopover: () => dispatch(closeNewCampaignPopover()),
    openNewCampaignPopover: () => dispatch(openNewCampaignPopover())
})

const mapStateToProps = (state: State): StateProps => ({
    isNewCampaignPopoverOpen: getIsNewCampaignPopoverOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaignPopover)
