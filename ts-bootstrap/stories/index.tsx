import * as React from 'react'
import { Text, Button } from '../src'

import { storiesOf } from '@storybook/react'

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
