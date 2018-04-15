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
    closeMobileCampaignTypeSelector: () => void
}

export interface StateProps {
    isCampaignTypeSelectorClosing: boolean
    isCampaignTypeSelectorOpen: boolean
}

const CampaignTypeSelector: React.SFC<
    CampaignTypeSelectorProps & DispatchProps & StateProps
> = ({
    closeCampaignTypeSelector,
    closeMobileCampaignTypeSelector,
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
        const iconStyle = { marginLeft: 10 }
        switch (type) {
            case 'scheduled':
                return (
                    <CalendarIcon
                        fill={steel}
                        height={media === 'Desktop' ? '20' : '24'}
                        width={media === 'Desktop' ? '20' : '24'}
                        viewBox="0 0 24 24"
                        style={iconStyle}
                    />
                )
            case 'automated':
                return (
                    <ZapIcon
                        fill={steel}
                        height={media === 'Desktop' ? '20' : '24'}
                        width={media === 'Desktop' ? '20' : '24'}
                        viewBox="0 0 24 24"
                        style={iconStyle}
                    />
                )
            case 'web':
                return (
                    <LinkIcon
                        fill={steel}
                        height={media === 'Desktop' ? '20' : '24'}
                        width={media === 'Desktop' ? '20' : '24'}
                        viewBox="0 0 24 24"
                        style={iconStyle}
                    />
                )
            case 'interstitial':
                return (
                    <PhoneIcon
                        fill={steel}
                        height={media === 'Desktop' ? '20' : '24'}
                        width={media === 'Desktop' ? '20' : '24'}
                        viewBox="0 0 24 24"
                        style={iconStyle}
                    />
                )
            case 'all':
            default:
                return (
                    <CheckIcon
                        fill={steel}
                        height={media === 'Desktop' ? '20' : '24'}
                        width={media === 'Desktop' ? '20' : '24'}
                        viewBox="0 0 24 24"
                        style={iconStyle}
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
                {getCampaignTypeIcon(type)}
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
                        {listType !== 'all' && getCampaignTypeIcon(listType)}
                        <Text
                            text={getFormattedListType(listType)}
                            size="medium"
                            textStyle={{ marginLeft: 8 }}
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
                                        closeMobileCampaignTypeSelector
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
                            <div
                                style={{
                                    height: 280,
                                    width: 384,
                                    flexDirection: 'column',
                                    paddingLeft: 16,
                                    paddingRight: 16
                                }}
                            >
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

// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
    closeMobileCampaignTypeSelector: () => {
        dispatch({ type: 'START_CLOSING_CAMPAIGN_TYPE_SELECTOR' })
        setTimeout(() => dispatch(closeCampaignTypeSelector()), 295)
    },
    closeCampaignTypeSelector: () => dispatch(closeCampaignTypeSelector()),
    openCampaignTypeSelector: () => dispatch(openCampaignTypeSelector())
})

const mapStateToProps = (state: State): StateProps => ({
    isCampaignTypeSelectorClosing: getIsCampaignTypeSelectorClosing(state),
    isCampaignTypeSelectorOpen: getIsCampaignTypeSelectorOpen(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(
    CampaignTypeSelector
)
