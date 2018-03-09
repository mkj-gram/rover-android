/// <reference path="../../../typings/index.d.ts"/>
import * as React from 'react'
import Responsive from 'react-responsive'

// 767 max for mobile
// 768 - 1280 for tablet
// 1281 ~ max for desktop
// tslint:disable-next-line:no-any
const Desktop = (props: any) => <Responsive {...props} minDeviceWidth={1281} />
// tslint:disable-next-line:no-any
const Tablet = (props: any) => (
    <Responsive {...props} minDeviceWidth={768} maxDeviceWidth={1280} />
)
// tslint:disable-next-line:no-any
const Mobile = (props: any) => <Responsive {...props} maxDeviceWidth={767} />

type funcType = () => void

export interface InjectedProps {
    device?: string
}

// tslint:disable-next-line:no-any
const responsiveContainer = (wrappedComponentProps: StringMap<any> = {}) => <
    TOriginalProps extends {}
>(
    Component: React.ComponentType<TOriginalProps & InjectedProps>
) => {
    const res = class ResponsiveContainer extends React.Component<
        TOriginalProps,
        {}
    > {
        render(): JSX.Element {
            const Fragment = React.Fragment

            return (
                <Fragment>
                    <Desktop>
                        <Component
                            {...wrappedComponentProps}
                            device="Desktop"
                        />
                    </Desktop>
                    <Tablet>
                        <Component {...wrappedComponentProps} device="Tablet" />
                    </Tablet>
                    <Mobile>
                        <Component {...wrappedComponentProps} device="Mobile" />
                    </Mobile>
                </Fragment>
            )
        }
    }
    return res
}

export default responsiveContainer
