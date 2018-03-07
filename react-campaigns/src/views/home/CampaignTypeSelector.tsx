/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { Manager, Target } from 'react-popper'

import {
    closeCampaignTypeSelector,
    openCampaignTypeSelector
} from '../../actions'
import {
    getIsCampaignTypeSelectorOpen,
    getIsCampaignTypeSelectorClosing
} from '../../reducers'

import {
    CalendarIcon,
    CheckIcon,
    FilterArrowIcon,
    graphite,
    LinkIcon,
    NavBar,
    PhoneIcon,
    Popover,
    RadioButton,
    steel,
    Text,
    titanium,
    white,
    ZapIcon
} from '@rover/ts-bootstrap/dist/src'

export interface CampaignTypeSelectorProps {
    setListType: (campaignType: QueryParams['campaignType']) => void
    listType: QueryParams['campaignType']
    media: Media
}

export interface DispatchProps {
    openCampaignTypeSelector: () => void
    closeCampaignTypeSelector: () => void
}

export interface StateProps {
    isCampaignTypeSelectorClosing: boolean
    isCampaignTypeSelectorOpen: boolean
}

const CampaignTypeSelector: React.SFC<
    CampaignTypeSelectorProps & DispatchProps & StateProps
> = ({
    closeCampaignTypeSelector,
    isCampaignTypeSelectorClosing,
    isCampaignTypeSelectorOpen,
    listType,
    media,
    openCampaignTypeSelector,
    setListType
}) => {
    const getCampaignTypeIcon = (
        type: QueryParams['campaignType']
    ): JSX.Element => {
        switch (type) {
            case 'scheduled':
                return (
                    <CalendarIcon
                        fill={steel}
                        style={
                            media === 'Desktop' && {
                                transform: `scale(${5 / 6})`
                            }
                        }
                    />
                )
            case 'automated':
                return (
                    <ZapIcon
                        fill={steel}
                        style={
                            media === 'Desktop' && {
                                transform: `scale(${5 / 6})`
                            }
                        }
                    />
                )
            case 'web':
                return (
                    <LinkIcon
                        fill={steel}
                        style={
                            media === 'Desktop' && {
                                transform: `scale(${5 / 6})`
                            }
                        }
                    />
                )
            case 'interstitial':
                return (
                    <PhoneIcon
                        fill={steel}
                        style={
                            media === 'Desktop' && {
                                transform: `scale(${5 / 6})`
                            }
                        }
                    />
                )
            case 'all':
            default:
                return (
                    <CheckIcon
                        fill={steel}
                        style={
                            media === 'Desktop' && {
                                transform: `scale(${5 / 6})`
                            }
                        }
                    />
                )
        }
    }

    const getFormattedListType = (type?: QueryParams['campaignType']) => {
        switch (type) {
            case 'scheduled':
                return 'Scheduled Notifications'
            case 'automated':
                return 'Automated Notifications'
            case 'web':
                return 'Web/Social Experiences'
            case 'interstitial':
                return 'Interstitial Experiences'
            case 'all':
            default:
                return 'All Campaigns'
        }
    }

    const handleOpenClose = () => {
        if (isCampaignTypeSelectorOpen) {
            closeCampaignTypeSelector()
        } else {
            openCampaignTypeSelector()
        }
    }

    const renderCampaignTypeRow = (type: QueryParams['campaignType']) => {
        const typeName = getFormattedListType(type)
        const style: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            height: media === 'Mobile' ? 72 : 56,
            width: '100%',
            borderBottom:
                typeName !== 'Web/Social Experiences' || media === 'Mobile'
                    ? `1px solid ${titanium}`
                    : 'none',
            boxSizing: 'border-box'
        }
        return (
            <div style={style} onClick={() => setListType(type)}>
                <div style={{ marginLeft: 10, flex: 'none', height: 24 }}>
                    {getCampaignTypeIcon(type)}
                </div>
                <div style={{ marginLeft: 26, flex: '1 1 auto' }}>
                    <Text text={typeName} size="medium" />
                </div>
                <div style={{ flex: 'none' }} onClick={() => setListType(type)}>
                    <RadioButton
                        selected={type === listType}
                        style={{ outerStyle: { height: 18, width: 18 } }}
                    />
                </div>
            </div>
        )
    }
    return (
        <React.Fragment>
            <Manager>
                <Target>
                    <div
                        id="campaign-type-selector"
                        onClick={handleOpenClose}
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {listType !== 'all' && (
                            <div style={{ height: 24, marginRight: 8 }}>
                                {getCampaignTypeIcon(listType)}
                            </div>
                        )}
                        <Text
                            text={getFormattedListType(listType)}
                            size="medium"
                        />
                        <div style={{ height: 16, marginLeft: 4 }}>
                            <FilterArrowIcon />
                        </div>
                    </div>
                </Target>
                {isCampaignTypeSelectorOpen &&
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
                                    isCampaignTypeSelectorClosing
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
                                    buttonRight="Done"
                                    buttonLeft="Cancel"
                                    buttonLeftCallback={
                                        closeCampaignTypeSelector
                                    }
                                    buttonRightCallback={
                                        closeCampaignTypeSelector
                                    }
                                    style={{
                                        buttonLeftStyle: {
                                            innerStyle: {
                                                color: graphite,
                                                marginTop: 3
                                            }
                                        },
                                        buttonRightStyle: {
                                            innerStyle: {
                                                color: graphite,
                                                marginTop: 3
                                            }
                                        }
                                    }}
                                    title=""
                                />
                                <div style={{ padding: 24 }}>
                                    <Text size="h1" text="Filter Campaigns" />
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginBottom: 24
                                        }}
                                    >
                                        {renderCampaignTypeRow('all')}
                                        {renderCampaignTypeRow('scheduled')}
                                        {renderCampaignTypeRow('automated')}
                                        {renderCampaignTypeRow('interstitial')}
                                        {renderCampaignTypeRow('web')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                {media !== 'Mobile' &&
                    isCampaignTypeSelectorOpen && (
                        <Popover
                            placement="top"
                            containerStyle={{
                                height: 280,
                                width: 384,
                                background: 'white',
                                flexDirection: 'column',
                                borderRadius: 3,
                                border: `1px solid ${titanium}`,
                                paddingLeft: 16,
                                paddingRight: 16,
                                zIndex: 1
                            }}
                            toggle={handleOpenClose}
                            arrowColors={{
                                primary: 'white',
                                secondary: titanium,
                                border: titanium
                            }}
                            toggleable={true}
                            targetId="campaign-type-selector"
                            targetParent="root"
                        >
                            <div>
                                {renderCampaignTypeRow('all')}
                                {renderCampaignTypeRow('scheduled')}
                                {renderCampaignTypeRow('automated')}
                                {renderCampaignTypeRow('interstitial')}
                                {renderCampaignTypeRow('web')}
                            </div>
                        </Popover>
                    )}
            </Manager>
        </React.Fragment>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
    closeCampaignTypeSelector: () => {
        dispatch({ type: 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR' })
        setTimeout(() => dispatch(closeCampaignTypeSelector()), 295)
    },
    openCampaignTypeSelector: () => dispatch(openCampaignTypeSelector())
})

const mapStateToProps = (state: State): StateProps => ({
    isCampaignTypeSelectorClosing: getIsCampaignTypeSelectorClosing(state),
    isCampaignTypeSelectorOpen: getIsCampaignTypeSelectorOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(
    CampaignTypeSelector
)
