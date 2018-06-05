/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import {
    AudienceIcon,
    ExternalLinkIcon,
    turquoise,
    aquamarine,
    Text,
    graphite
} from '@rover/ts-bootstrap/dist/src'

export interface AudienceLinkProps {
    style?: React.CSSProperties
    primaryText: string
    secondaryText: string
}

export interface AudienceLinkState {
    mouseEventDirection: 'up' | 'down'
}

class AudienceLink extends React.Component<
    AudienceLinkProps,
    AudienceLinkState
> {
    constructor(props: AudienceLinkProps) {
        super(props)
        this.state = {
            mouseEventDirection: 'up'
        }
    }

    render() {
        const { style, primaryText, secondaryText } = this.props
        const { mouseEventDirection } = this.state

        const environments: StringMap<string> = {
            production: 'https://app.rover.io/audience/',
            staging: 'https://app.staging.rover.io/audience/',
            development: 'http://' + process.env.HOST + ':9001/audience/'
        }

        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    ...style
                }}
            >
                <AudienceIcon />
                <Text
                    text={primaryText}
                    size="medium"
                    textStyle={{
                        fontWeight: 600,
                        marginTop: 16,
                        marginBottom: 8,
                        color: graphite,
                        textAlign: 'center'
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onMouseDown={() =>
                        this.setState({
                            mouseEventDirection: 'down'
                        })
                    }
                    onMouseUp={() => {
                        this.setState({
                            mouseEventDirection: 'up'
                        })
                        window.open(environments[process.env.NODE_ENV], 'tab')
                    }}
                >
                    <ExternalLinkIcon
                        fill={
                            mouseEventDirection === 'up'
                                ? turquoise
                                : aquamarine
                        }
                    />
                    <Text
                        text={secondaryText}
                        size="medium"
                        textStyle={{
                            marginLeft: 8,
                            fontWeight: 600,
                            color:
                                mouseEventDirection === 'up'
                                    ? turquoise
                                    : aquamarine
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default AudienceLink
