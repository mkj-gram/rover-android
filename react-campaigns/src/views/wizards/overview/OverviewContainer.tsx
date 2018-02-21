/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import OverviewComponent from './OverviewComponent'
import { cloud } from '@rover/ts-bootstrap/dist/src'

import DeviceTransitionContainer from '../../utils/DeviceTransitionContainer'

import { InjectedProps } from '../../utils/ResponsiveContainer'

export interface OverviewContainerProps extends InjectedProps {}

class OverviewContainer extends React.Component<OverviewContainerProps, {}> {
    render() {
        const { device } = this.props
        return (
            <DeviceTransitionContainer device={device}>
                <OverviewComponent />
            </DeviceTransitionContainer>
        )
    }
}

export default OverviewContainer
