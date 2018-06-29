/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

import {
    getShouldShowPhonePreview,
    getIsOverviewModalOpen,
    getTriggeredAnimation
} from '../../reducers'
import PhonePreview from '../wizards/PhonePreview'
import MediaQuery from 'react-responsive'

export interface DeviceTransitionContainerProps {
    children?: JSX.Element
    device: string
}

export interface OwnProps {
    displayOverviewModal?: string
    triggeredAnimation: string
    showPhonePreview: boolean
}

const DeviceTransitionContainer: React.SFC<
    DeviceTransitionContainerProps & OwnProps
> = ({
    children,
    device,
    displayOverviewModal,
    showPhonePreview,
    triggeredAnimation
}) => {
    const Fragment = React.Fragment
    const overviewContainerAnimation =
        triggeredAnimation === 'duplicate' ? '' : displayOverviewModal
    const overviewAnimationTime = 350

    if (device === 'Desktop') {
        return (
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: cloud,
                    display: 'flex',
                    overflow: 'hidden',
                    animation: `${overviewContainerAnimation} 350ms ease-out`,
                    position: 'absolute',
                    zIndex: 2
                }}
                id="mainModalView"
            >
                <div
                    style={{ flex: '1 1 769px', height: '100%', maxWidth: 769 }}
                >
                    <div
                        style={{
                            animation: `${displayOverviewModal} ${overviewAnimationTime}ms ease-out`,
                            display:
                                displayOverviewModal !== 'closed'
                                    ? 'flex'
                                    : 'none',
                            height: '100%',
                            maxWidth: 769,
                            position: 'relative',
                            minWidth: 0,
                            overflowX: 'hidden'
                        }}
                        id="mainModalLeft"
                    >
                        {children}
                    </div>
                </div>
                <div
                    style={{
                        flex: '1 1 auto',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        position: 'relative'
                    }}
                    id="mainModalRight"
                >
                    <div
                        id="phone-bezel"
                        style={{
                            position: 'absolute',
                            top: (window.innerHeight - 755) / 2,
                            transform: `translateX(${
                                showPhonePreview
                                    ? '0%'
                                    : `${(window.innerWidth - 784) / 2 + 368}px`
                            })`,
                            transition: '350ms ease-out'
                        }}
                    >
                        <MediaQuery minWidth={1140}>
                            <PhonePreview device={device} />
                        </MediaQuery>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div
                style={{
                    zIndex: 2,
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    display:
                        displayOverviewModal !== 'closed' ? 'flex' : 'none',
                    animation: `${displayOverviewModal} ${overviewAnimationTime}ms ease-out`,
                    minWidth: 0
                }}
                id="mainModalLeft"
            >
                {children}
            </div>
        )
    }
}

const mapStateToProps = (state: State): OwnProps => ({
    displayOverviewModal: getIsOverviewModalOpen(state),
    triggeredAnimation: getTriggeredAnimation(state),
    showPhonePreview: getShouldShowPhonePreview(state)
})

export default connect(
    mapStateToProps,
    {}
)(DeviceTransitionContainer)
