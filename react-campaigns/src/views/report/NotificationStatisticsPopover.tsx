/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { closePopoverModalForm, updateActivePopover } from '../../actions/'

import {
    getActivePopover,
    getCampaign,
    getIsPopoverModalFormOpen
} from '../../reducers/'

import {
    AlertInfoIcon,
    Button,
    ChevronLeftIcon,
    PopoverContainer,
    Statistic,
    steel,
    turquoise,
    cloud,
    white,
    titanium
} from '@rover/ts-bootstrap/dist/src'
import activePopover from '../../reducers/app/activePopover'
import SelectableList from '../utils/SelectableList'

export interface NotificationStatisticsPopoverState {
    currentDetail: string | null
    detailAnimation: 'ltr' | 'rtl'
}

export interface NotificationStatisticsPopoverProps {
    campaignId: string
    children: JSX.Element[]
    device: Media
    label: string
    status?: 'good' | 'bad' | 'ok'
    value: string
}

export interface NotificationStatisticsPopoverStateProps {
    activePopover: string
    campaign: Campaign
    isPopoverModalFormOpen: string
}
export interface NotificationStatisticsPopoverDispatchProps {
    closePopoverModalForm: () => void
    updateActivePopover: (activePopover: string) => void
}

class NotificationStatisticsPopover extends React.PureComponent<
    NotificationStatisticsPopoverProps &
        NotificationStatisticsPopoverStateProps &
        NotificationStatisticsPopoverDispatchProps,
    NotificationStatisticsPopoverState
> {
    constructor(
        props: NotificationStatisticsPopoverProps &
            NotificationStatisticsPopoverStateProps &
            NotificationStatisticsPopoverDispatchProps
    ) {
        super(props)

        this.state = {
            currentDetail: null,
            detailAnimation: 'ltr'
        }

        this.closeDetail = this.closeDetail.bind(this)
        this.getButtonLeft = this.getButtonLeft.bind(this)
        this.getPopoverId = this.getPopoverId.bind(this)
        this.setState = this.setState.bind(this)
    }

    closeDetail(): void {
        this.setState({ detailAnimation: 'rtl' }, () =>
            setTimeout(
                () =>
                    this.setState({
                        currentDetail: null,
                        detailAnimation: 'ltr'
                    }),
                150
            )
        )
    }

    getButtonLeft(): JSX.Element | null {
        const { currentDetail } = this.state
        if (currentDetail === null) {
            return null
        }

        return (
            <div
                style={{
                    display: 'flex',
                    marginLeft: 16
                }}
                onClick={this.closeDetail}
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

    getPopoverId(): string {
        const { label } = this.props
        return `notification-statistic-${label.replace(/\s/g, '')}`
    }

    renderStats() {
        const { currentDetail, detailAnimation } = this.state
        const { children, device } = this.props
        return (
            <div style={{ overflowX: 'hidden' }}>
                {currentDetail && (
                    <div style={{ position: 'relative' }}>
                        <div
                            style={{
                                height: 324,
                                width: '100%',
                                backgroundColor: 'white',
                                animation: `${detailAnimation} 150ms ease-in-out`,
                                position: 'absolute'
                            }}
                        />
                    </div>
                )}
                <SelectableList device={device}>
                    {children.map((child, index) =>
                        React.cloneElement(child, {
                            key: index,
                            onClick: () =>
                                this.setState({
                                    currentDetail: child.props.name
                                })
                        })
                    )}
                </SelectableList>
            </div>
        )
    }

    render() {
        const {
            activePopover,
            device,
            label,
            status,
            updateActivePopover,
            value
        } = this.props
        const { currentDetail } = this.state
        if (device === 'Mobile') {
            return <div />
        }

        return (
            <PopoverContainer
                id={this.getPopoverId()}
                onClick={() =>
                    activePopover === this.getPopoverId()
                        ? updateActivePopover('')
                        : updateActivePopover(this.getPopoverId())
                }
                popoverProps={{
                    placement: 'bottom',
                    device: device,
                    navBarProperties: {
                        customLeftElem: this.getButtonLeft(),
                        title: currentDetail || label
                    },
                    arrowColors: {
                        primary: cloud,
                        secondary: white,
                        border: titanium
                    }
                }}
                targetParent={
                    device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                }
                showPopover={activePopover === this.getPopoverId()}
            >
                <Statistic
                    label={label}
                    onClick={() => updateActivePopover(this.getPopoverId())}
                    status={status}
                    value={value}
                />
                <React.Fragment>{this.renderStats()}</React.Fragment>
            </PopoverContainer>
        )
    }
}

const mapStateToProps = (
    state: State,
    ownProps: NotificationStatisticsPopoverProps
): NotificationStatisticsPopoverStateProps => {
    const { campaignId } = ownProps

    return {
        activePopover: getActivePopover(state),
        campaign: getCampaign(state, campaignId),
        isPopoverModalFormOpen: getIsPopoverModalFormOpen(state)
    }
}

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): NotificationStatisticsPopoverDispatchProps => ({
    closePopoverModalForm: () => dispatch(closePopoverModalForm),
    updateActivePopover: (activePopover: string) => {
        return dispatch(updateActivePopover(activePopover))
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationStatisticsPopover)
