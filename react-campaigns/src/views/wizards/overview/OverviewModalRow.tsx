/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Redirect } from 'react-router'
import {
    black,
    titanium,
    ChevronRightIcon,
    Button,
    silver,
    Text,
    ProgressBar,
    turquoise,
    white,
    Alert,
    CheckCircleIcon,
    green
} from '@rover/ts-bootstrap/dist/src'
import { InjectedProps } from '../../utils/ResponsiveContainer'

export interface OverviewModalRowProps extends InjectedProps {
    name?: string
    text?: string
    val?: boolean | number
    handlePageDirect?: (val?: string) => void
}

class OverviewModalRow extends React.Component<OverviewModalRowProps, {}> {
    constructor(props: OverviewModalRowProps) {
        super(props)

        this.getProgress = this.getProgress.bind(this)
    }

    getProgress() {
        const { val, device } = this.props

        const isValNumber = (x: boolean | number): x is number => {
            return (x as number) !== undefined
        }

        let ret
        if (isValNumber(val)) {
            if (val === 100) {
                ret = (
                    <div style={{ display: 'flex', marginTop: 8 }}>
                        <CheckCircleIcon fill={green} />
                    </div>
                )
            } else {
                ret = (
                    <div style={{ display: 'flex', marginTop: 8 }}>
                        <ProgressBar
                            progress={val}
                            style={{
                                progressStyle: {
                                    backgroundColor: turquoise
                                },
                                barStyle: {
                                    width: device === 'desktop' ? 240 : 176
                                }
                            }}
                        />

                        <div style={{ marginLeft: 16 }}>
                            <Text text={`${val}% complete`} size="small" />
                        </div>
                    </div>
                )
            }
        }
        return ret
    }
    render() {
        let { device, name, text, val, handlePageDirect } = this.props
        // Desktop as default
        let outerStyle: React.CSSProperties = {
            padding: '32px 32px 0 32px',
            display: 'flex',
            flexDirection: 'column'
        }
        let button = (
            <Button
                text="Next"
                size="small"
                type="primary"
                onClick={() => handlePageDirect(name)}
                style={{ outerStyle: { marginLeft: 32 } }}
            />
        )
        const experienceOff = name === 'Experience' && val === false
        let textStyle = experienceOff ? { color: silver } : { color: black }
        if (device === 'mobile') {
            outerStyle = {
                ...outerStyle,
                padding: '32px 16px 0 16px'
            }
        }
        if (device !== 'desktop') {
            button = (
                <div style={{ marginLeft: 16 }}>
                    <ChevronRightIcon fill={silver} />
                </div>
            )
        }
        return (
            <div
                style={{ background: white, width: '100%' }}
                onClick={
                    device !== 'desktop' && !experienceOff
                        ? () => handlePageDirect(name)
                        : () => null
                }
                key={name}
            >
                <div style={outerStyle}>
                    <Text text={name} size="h2" textStyle={textStyle} />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Text text={text} size="medium" textStyle={textStyle} />
                        {experienceOff ? (
                            <div
                                style={{
                                    width: 100,
                                    height: 28,
                                    marginLeft: 16
                                }}
                            />
                        ) : (
                            button
                        )}
                    </div>
                    {name !== 'Experience' && this.getProgress()}
                    {experienceOff && (
                        <div
                            style={{
                                display: 'flex',
                                marginTop: 16
                            }}
                        >
                            <Alert
                                message="Tap behavior is set to present website"
                                type="info"
                            />
                        </div>
                    )}
                    <div
                        style={{
                            marginTop: 24,
                            height: 1,
                            width: '100%',
                            background: titanium
                        }}
                    />
                </div>
            </div>
        )
    }
}
export default OverviewModalRow
