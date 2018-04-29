/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

import { getIsOverviewModalOpen, getTriggeredAnimation } from '../../reducers'

export interface DeviceTransitionContainerProps {
    children?: JSX.Element
    device: string
}

export interface OwnProps {
    displayOverviewModal?: string
    triggeredAnimation: string
}

const DeviceTransitionContainer: React.SFC<
    DeviceTransitionContainerProps & OwnProps
> = ({ children, device, displayOverviewModal, triggeredAnimation }) => {
    const Fragment = React.Fragment

    let overviewContainerAnimation
    if (triggeredAnimation === 'duplicate') {
        overviewContainerAnimation = ''
    } else {
        overviewContainerAnimation =
            displayOverviewModal === 'open' ? 'fade' : 'fadeOut'
    }

    const overviewAnimationTime = triggeredAnimation === 'duplicate' ? 250 : 500

    if (device === 'Desktop') {
        return (
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: cloud,
                    display: 'flex',
                    overflowY: 'hidden',
                    animation: `${overviewContainerAnimation} 600ms ease`,
                    position: 'absolute',
                    zIndex: 2
                }}
                id="mainModalView"
            >
                <div
                    style={{
                        flex: '1 1 769px',
                        display:
                            displayOverviewModal !== 'closed' ? 'flex' : 'none',
                        animation: `${displayOverviewModal} ${overviewAnimationTime}ms ease`,
                        maxWidth: 769,
                        position: 'relative',
                        minWidth: 0,
                        overflowX: 'hidden'
                    }}
                    id="mainModalLeft"
                >
                    {children}
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
                />
            </div>
        )
    } else {
        return (
            <div
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    height: '100%',
                    width: '100%',
                    backgroundColor: cloud
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display:
                            displayOverviewModal !== 'closed' ? 'flex' : 'none',
                        animation: `${displayOverviewModal} ${overviewAnimationTime}ms ease`,
                        minWidth: 0
                    }}
                    id="mainModalLeft"
                >
                    {children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: State): OwnProps => ({
    displayOverviewModal: getIsOverviewModalOpen(state),
    triggeredAnimation: getTriggeredAnimation(state)
})

export default connect(mapStateToProps, {})(DeviceTransitionContainer)
