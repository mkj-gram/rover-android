import * as React from 'react'

import { Alert, Text, Button, RadioButton, Switch, ProgressBar } from '../src'

import {
    black,
    charcoal,
    graphite,
    steel,
    silver,
    titanium,
    mercury,
    cloud,
    almostWhite,
    white,
    turquoise,
    aquamarine,
    foam,
    paleblue,
    beige,
    red,
    yellow,
    green
} from '../styles/colors'

import {
    text,
    regular,
    semibold,
    large,
    medium,
    small
} from '../styles/typography'

import { storiesOf } from '@storybook/react'

storiesOf('Alert', module)
    .add('Info', () => (
        <Alert
            message="Mutable Content must be enabled because you have attached rich media to your notification"
            type="info"
        />
    ))
    .add('Warning', () => (
        <Alert
            message="Android devices will always present the website in a web browser"
            type="warn"
        />
    ))

storiesOf('Button', module)
    .add('rounded-large-primary', () => (
        <Button text="Next" size="large" type="primary" onClick={() => null} />
    ))
    .add('rounded-large-primary-override', () => {
        return (
            <div style={{ width: 130, display: 'inline' }}>
                <Button
                    text="Next"
                    size="large"
                    type="primary"
                    style={{ outerStyle: { marginRight: 10 } }}
                />
                <Button
                    text="NextOne"
                    size="large"
                    type="primary"
                    overrideWidth={95.47}
                    style={{ outerStyle: { marginRight: 10 } }}
                />
            </div>
        )
    })

    .add('rounded-small-primary', () => (
        <Button text="Next" size="small" type="primary" />
    ))
    .add('rounded-small-primary-override', () => {
        return (
            <div style={{ width: 130, display: 'inline' }}>
                <Button
                    text="Next"
                    size="small"
                    type="primary"
                    style={{ outerStyle: { marginRight: 10 } }}
                />
                <Button
                    text="Next"
                    size="small"
                    type="primary"
                    overrideWidth={60}
                />
            </div>
        )
    })

    .add('rounded-large-secondary', () => (
        <Button text="Next" size="large" type="secondary" />
    ))
    .add('rounded-small-secondary', () => (
        <Button text="Next" size="small" type="secondary" />
    ))

    .add('rounded-large-disabled', () => (
        <Button text="Next" size="large" type="disabled" />
    ))
    .add('rounded-small-disabled', () => (
        <Button text="Next" size="small" type="disabled" />
    ))

    .add('regular', () => <Button text="Button" type="regular" />)

const shades: StringMap<string> = {
    black,
    charcoal,
    graphite,
    steel,
    silver,
    titanium,
    mercury,
    cloud,
    almostWhite,
    white
}
const campaignPalette: StringMap<string> = {
    turquoise,
    aquamarine,
    foam,
    paleblue,
    beige
}
const alertPalette: StringMap<string> = {
    red,
    yellow,
    green
}
const colorBlock = (key: number, name: string, hex: string) => (
    <div
        key={key}
        style={{
            ...text,
            ...small,
            width: 120,
            height: 120,
            marginRight: 10,
            backgroundColor: hex,
            color: black,
            textShadow:
                '0.05em 0 white, 0 0.05em white, -0.05em 0 white, 0 -0.05em white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}
    >
        <div>{hex}</div>
        <div>{name}</div>
    </div>
)
storiesOf('Colors', module)
    .add('Shades', () => (
        <div
            style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}
        >
            {Object.keys(shades).map((shade, index) =>
                colorBlock(index, shade, shades[shade])
            )}
        </div>
    ))
    .add('Campaigns Palette', () => (
        <div
            style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}
        >
            {Object.keys(campaignPalette).map((shade, index) =>
                colorBlock(index, shade, campaignPalette[shade])
            )}
        </div>
    ))
    .add('Alert Palette', () => (
        <div
            style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}
        >
            {Object.keys(alertPalette).map((shade, index) =>
                colorBlock(index, shade, alertPalette[shade])
            )}
        </div>
    ))

storiesOf('Switch', module)
    .add('all buttons', () => {
        interface XState {
            switched: boolean
        }

        class X extends React.Component<{}, XState> {
            // tslint:disable-next-line:no-any
            constructor(props: any) {
                super(props)
                this.state = {
                    switched: false
                }
                this.toggle = this.toggle.bind(this)
            }
            toggle() {
                this.setState({
                    switched: !this.state.switched
                })
            }
            render() {
                return (
                    <div>
                        <div>
                            <Switch
                                on={this.state.switched}
                                text="AM"
                                onClick={this.toggle}
                            />
                        </div>
                        <div>
                            <Switch
                                on={!this.state.switched}
                                text="PM"
                                onClick={this.toggle}
                            />
                        </div>
                        <div>
                            <Switch forceOn={true} />
                        </div>
                        <div>
                            <Switch
                                on={this.state.switched}
                                onClick={this.toggle}
                            />
                        </div>
                        <Switch
                            on={!this.state.switched}
                            onClick={this.toggle}
                        />
                    </div>
                )
            }
        }

        return <X />
    })
    .add('off', () => <Switch on={false} />)
    .add('on', () => <Switch on={true} />)
    .add('forceOn', () => <Switch forceOn={true} />)
    .add('text', () => {
        return (
            <div>
                <Switch on={true} text="AM" />
                <Switch on={false} text="PM" />
            </div>
        )
    })

storiesOf('Progress Bar', module)
    .add('0%', () => (
        <ProgressBar
            progress={0}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('20%', () => (
        <ProgressBar
            progress={20}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('25%', () => (
        <ProgressBar
            progress={25}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('33%', () => (
        <ProgressBar
            progress={33}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('40%', () => (
        <ProgressBar
            progress={40}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('50%', () => (
        <ProgressBar
            progress={50}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('60%', () => (
        <ProgressBar
            progress={60}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('66%', () => (
        <ProgressBar
            progress={66}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('75%', () => (
        <ProgressBar
            progress={75}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('80%', () => (
        <ProgressBar
            progress={80}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('100%', () => (
        <ProgressBar
            progress={100}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('120%', () => (
        <ProgressBar
            progress={120}
            style={{ progressStyle: { backgroundColor: turquoise } }}
        />
    ))
    .add('30% with children', () => (
        <ProgressBar
            progress={30}
            style={{
                progressStyle: {
                    backgroundColor: turquoise,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 8
                },
                barStyle: {
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: paleblue
                }
            }}
        >
            <div
                style={{
                    ...text,
                    fontSize: 13,
                    ...semibold,
                    color: almostWhite,
                    marginLeft: 8
                }}
            >
                3600
            </div>
        </ProgressBar>
    ))

storiesOf('RadioButton', module).add('selected and unselected', () => {
    return (
        <div>
            <RadioButton selected={true} />
            <RadioButton selected={false} />
        </div>
    )
})

storiesOf('Text', module)
    .add('h1', () => <Text text="Header 1" size="h1" />)
    .add('h1-editable', () => (
        <Text
            text="Header 1- Editable"
            size="h1"
            contentEditable={true}
            handleChange={() => null}
        />
    ))
    .add('h2', () => <Text text="Header 2" size="h2" />)
    .add('h2-editable', () => (
        <Text
            text="Header 2- Editable"
            size="h2"
            contentEditable={true}
            handleChange={() => null}
        />
    ))

    .add('text-large-left', () => (
        <Text text="Lorem ipsum sit dolor amet" size="large" />
    ))
    .add('text-large-center', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="large"
            position="center"
        />
    ))

    // In implementation, have text = {this.state.text == '' ? PLACEHOLDER : this.state.text}
    .add('text-large-left-editable-placeholder', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="large"
            contentEditable={true}
            handleChange={() => null}
            placeholder={true}
        />
    ))
    .add('text-large-left-non-editable-placeholder', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="large"
            contentEditable={false}
            handleChange={() => null}
            placeholder={true}
        />
    ))
    .add('text-medium-left', () => (
        <Text text="Lorem ipsum sit dolor amet" size="medium" />
    ))
    .add('text-medium-editable-placeholder', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="medium"
            contentEditable={true}
            handleChange={() => null}
            placeholder={true}
        />
    ))

    .add('text-small-left-editable', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="small"
            contentEditable={true}
        />
    ))
    .add('text-small-center-editable', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="small"
            position="center"
            contentEditable={true}
        />
    ))

    .add('text-small-left-label', () => (
        <Text text="Lorem ipsum sit dolor amet" size="small" label={true} />
    ))
    .add('text-small-left-label-center', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="small"
            label={true}
            position="center"
        />
    ))
