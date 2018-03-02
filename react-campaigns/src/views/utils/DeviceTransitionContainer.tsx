/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import { cloud } from '@rover/ts-bootstrap/dist/src'
import { connect } from 'react-redux'

export interface DeviceTransitionContainerProps {
    children?: JSX.Element
    device: string
}

export interface OwnProps {
    overviewModal?: StringMap<string | boolean>
}

class DeviceTransitionContainer extends React.Component<
    DeviceTransitionContainerProps & OwnProps,
    {}
> {
    constructor(props: DeviceTransitionContainerProps & OwnProps) {
        super(props)
    }

    shouldComponentUpdate(
        nextProps: DeviceTransitionContainerProps & OwnProps,
        nextState: {}
    ) {
        return !nextProps.overviewModal.overviewModalDisplayReset
    }

    render() {
        const { children, device, overviewModal } = this.props
        const Fragment = React.Fragment

        if (device === 'Desktop') {
            return (
                <div
                    style={{
                        height: '100vh',
                        width: '100%',
                        backgroundColor: cloud,
                        display: 'flex',
                        overflowY: 'hidden',
                        animation: `${
                            overviewModal.overviewContainerAnimation
                        } 600ms ease`,
                        position: 'absolute',
                        zIndex: 2
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            animation: `${
                                overviewModal.overviewModalDisplay
                            } 500ms ease`,
                            maxWidth: 769
                        }}
                    >
                        {children}
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    style={{
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        animation: `${
                            overviewModal.overviewModalDisplay
                        } 500ms ease`,
                        position: 'absolute',
                        zIndex: 2
                    }}
                >
                    {children}
                </div>
            )
        }
    }
}

const mapStateToProps = (state: State): OwnProps => ({
    overviewModal: state.modal
})

export default connect(mapStateToProps, {})(DeviceTransitionContainer)
