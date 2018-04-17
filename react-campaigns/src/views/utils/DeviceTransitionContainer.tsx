/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

import { getIsOverviewModalOpen } from '../../reducers'

export interface DeviceTransitionContainerProps {
    children?: JSX.Element
    device: string
}

export interface OwnProps {
    displayOverviewModal?: string
}

class DeviceTransitionContainer extends React.Component<
    DeviceTransitionContainerProps & OwnProps,
    {}
> {
    constructor(props: DeviceTransitionContainerProps & OwnProps) {
        super(props)
    }

    render() {
        const { children, device, displayOverviewModal } = this.props
        const Fragment = React.Fragment

        const overviewContainerAnimation =
            displayOverviewModal === 'close' ? 'fadeOut' : 'fade'

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
                            display: 'flex',
                            animation: `${displayOverviewModal} 500ms ease`,
                            maxWidth: 769,
                            position: 'relative',
                            minWidth: 0
                        }}
                        id="mainModalLeft"
                    >
                        {children}
                    </div>
                    <div
                        style={{
                            flex: '1 1 auto',
                            height: '100vh',
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
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        animation: `${displayOverviewModal} 500ms ease`,
                        position: 'absolute',
                        zIndex: 2,
                        minWidth: 0
                    }}
                    id="mainModalLeft"
                >
                    {children}
                </div>
            )
        }
    }
}

const mapStateToProps = (state: State): OwnProps => ({
    displayOverviewModal: getIsOverviewModalOpen(state)
})

export default connect(mapStateToProps, {})(DeviceTransitionContainer)
