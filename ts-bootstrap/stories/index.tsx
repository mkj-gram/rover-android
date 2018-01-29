import * as React from 'react'
import { Manager, Target } from 'react-popper'

import {
    Alert,
    Text,
    Badge,
    Button,
    Dialog,
    NavBar,
    Popover,
    ProgressBar,
    ProgressBarThin,
    RadioButton,
    SliderComponent,
    Switch,
    Tab,
    TabBar
} from '../src'

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
    palered,
    paleyellow,
    palegreen,
    palefoam,
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
    .add('Error', () => (
        <Alert message="Lorem ipsum sit dolor amet..." type="error" />
    ))

storiesOf('Badge', module)
    .add('Green Badge', () => <Badge color={green} text="badge" />)
    .add('Yellow Badge', () => <Badge color={yellow} text="badge / yellow" />)
    .add('Red Badge', () => <Badge color={red} text="badge / red" />)

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
    palered,
    paleyellow,
    palegreen,
    palefoam,
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

storiesOf('Dialog', module)
    .add('two buttons', () => {
        interface XState {
            switched: boolean
        }

        class WholeScreen extends React.Component<{}, XState> {
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
                    <div
                        id="entire"
                        style={{
                            width: '100%',
                            height: 700,
                            background: 'blue',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <div
                            id="left"
                            style={{
                                flex: '1 1 auto',
                                background: 'white',
                                margin: '5px 5px 5px 5px',
                                width: '100%',
                                height: 690
                            }}
                        >
                            <div
                                style={{
                                    height: 30,
                                    width: 30,
                                    background: 'yellow'
                                }}
                                onClick={() => this.toggle()}
                            />
                        </div>
                        <div
                            id="right"
                            style={{
                                flex: '1 1 auto',
                                background: 'pink',
                                margin: '5px 5px 5px 5px',
                                width: '100%',
                                height: 690
                            }}
                        />
                        {this.state.switched && (
                            <Dialog
                                buttonPrimaryText="Primary"
                                buttonSecondaryText="Next"
                                primaryOnClick={() => this.toggle()}
                                secondaryOnClick={() => this.toggle()}
                                isOpen={this.state.switched}
                            >
                                Publishing this campagin will schedule it for
                                delivery on Jan 8 at 3:00 PM America/Toronto.
                                Continue?
                            </Dialog>
                        )}
                        }
                    </div>
                )
            }
        }

        return <WholeScreen />
    })
    .add('one button', () => {
        interface XState {
            switched: boolean
        }

        class WholeScreen extends React.Component<{}, XState> {
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
                    <div
                        id="entire"
                        style={{
                            width: '100%',
                            height: 700,
                            background: 'blue',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <div
                            id="left"
                            style={{
                                flex: '1 1 auto',
                                background: 'white',
                                margin: '5px 5px 5px 5px',
                                width: '100%',
                                height: 690
                            }}
                        >
                            <div
                                style={{
                                    height: 30,
                                    width: 30,
                                    background: 'yellow'
                                }}
                                onClick={() => this.toggle()}
                            />
                        </div>
                        <div
                            id="right"
                            style={{
                                flex: '1 1 auto',
                                background: 'pink',
                                margin: '5px 5px 5px 5px',
                                width: '100%',
                                height: 690
                            }}
                        />
                        {this.state.switched && (
                            <Dialog
                                buttonPrimaryText="Primary"
                                primaryOnClick={() => this.toggle()}
                                isOpen={this.state.switched}
                            >
                                Publishing this campagin will schedule it for
                                delivery on Jan 8 at 3:00 PM America/Toronto.
                                Continue?
                            </Dialog>
                        )}
                        }
                    </div>
                )
            }
        }

        return <WholeScreen />
    })

storiesOf('Popover', module).add('various cases', () => {
    interface ReactstrapState {
        popoverOpen: boolean
        popoverOpen1: boolean
        popoverOpen2: boolean
        popoverOpen3: boolean
        popoverOpen4: boolean
        selected: string
    }

    class ReactstrapComp extends React.Component<{}, ReactstrapState> {
        // tslint:disable-next-line:no-any
        constructor(props: any) {
            super(props)
            this.state = {
                popoverOpen: false,
                popoverOpen1: false,
                popoverOpen2: false,
                popoverOpen3: false,
                popoverOpen4: false,
                selected: 'one'
            }
            this.toggle = this.toggle.bind(this)
            this.toggle1 = this.toggle1.bind(this)
            this.toggle2 = this.toggle2.bind(this)
            this.toggle3 = this.toggle3.bind(this)
            this.toggle4 = this.toggle4.bind(this)
            this.onClick = this.onClick.bind(this)
        }

        toggle() {
            this.setState({
                popoverOpen: !this.state.popoverOpen
            })
        }

        toggle1() {
            this.setState({
                popoverOpen1: !this.state.popoverOpen1
            })
        }

        toggle2() {
            this.setState({
                popoverOpen2: !this.state.popoverOpen2
            })
        }

        toggle3() {
            this.setState({
                popoverOpen3: !this.state.popoverOpen3
            })
        }

        toggle4() {
            this.setState({
                popoverOpen4: !this.state.popoverOpen4
            })
        }

        onClick(selected: string) {
            this.setState({
                selected
            })
        }

        render() {
            return (
                <div
                    style={{
                        height: 700,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <Manager>
                                <Target>
                                    <div
                                        id="target5"
                                        onClick={() => this.toggle2()}
                                        style={{
                                            height: 100,
                                            width: 100,
                                            background: 'yellow'
                                        }}
                                    >
                                        TabBar
                                    </div>
                                </Target>
                                {this.state.popoverOpen2 && (
                                    <Popover
                                        placement="right"
                                        containerStyle={{
                                            height: 288,
                                            width: 384,
                                            background: white,
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: `1px solid ${titanium}`
                                        }}
                                        toggle={this.toggle2}
                                        targetId="target5"
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: 56
                                            }}
                                        >
                                            <TabBar>
                                                {['one', 'two', 'three'].map(
                                                    tab => (
                                                        <Tab
                                                            val={tab}
                                                            selected={
                                                                this.state
                                                                    .selected
                                                            }
                                                            onClick={
                                                                this.onClick
                                                            }
                                                            key={tab}
                                                        />
                                                    )
                                                )}
                                            </TabBar>
                                        </div>
                                    </Popover>
                                )}
                            </Manager>
                        </div>

                        <div>
                            <Manager>
                                <Target>
                                    <div
                                        id="target4"
                                        onClick={() => this.toggle3()}
                                        style={{
                                            height: 60,
                                            width: 100,
                                            background: 'yellow'
                                        }}
                                    >
                                        NavBar not toggable
                                    </div>
                                </Target>
                                {this.state.popoverOpen3 && (
                                    <Popover
                                        placement="right"
                                        containerStyle={{
                                            height: 288,
                                            width: 384,
                                            background: white,
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: `1px solid ${titanium}`
                                        }}
                                        toggle={this.toggle3}
                                        navBarProperties={{
                                            buttonLeft: 'Button',
                                            title: 'Title',
                                            buttonRight: 'Button',
                                            id: 'navBarId',
                                            style: {
                                                containerStyle: {
                                                    borderRadius:
                                                        '3px 3px 0px 0px'
                                                }
                                            }
                                        }}
                                        arrowColors={{
                                            primary: cloud,
                                            secondary: white,
                                            border: titanium
                                        }}
                                        toggleable={false}
                                        targetId="target4"
                                    />
                                )}
                            </Manager>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <Manager>
                                <Target>
                                    <div
                                        id="target1"
                                        onClick={() => this.toggle1()}
                                        style={{
                                            height: 100,
                                            width: 100,
                                            background: 'yellow'
                                        }}
                                    >
                                        NavBar
                                    </div>
                                </Target>
                                {this.state.popoverOpen1 && (
                                    <Popover
                                        placement="bottom"
                                        containerStyle={{
                                            height: 288,
                                            width: 384,
                                            background: white,
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: `1px solid ${titanium}`
                                        }}
                                        toggle={this.toggle1}
                                        navBarProperties={{
                                            title: 'Title',
                                            buttonRight: 'Button',
                                            id: 'navBarId',
                                            style: {
                                                containerStyle: {
                                                    borderRadius:
                                                        '3px 3px 0px 0px'
                                                },
                                                buttonLeftStyle: {
                                                    innerStyle: {
                                                        width: 50.125,
                                                        height: 22
                                                    }
                                                }
                                            }
                                        }}
                                        arrowColors={{
                                            primary: cloud,
                                            secondary: white,
                                            border: titanium
                                        }}
                                        toggleable={true}
                                        targetId="target1"
                                    />
                                )}
                            </Manager>
                        </div>
                        <div> Should be covered </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <Manager>
                                <Target>
                                    <div
                                        id="target2"
                                        onClick={() => this.toggle4()}
                                        style={{
                                            height: 100,
                                            width: 100,
                                            background: 'yellow'
                                        }}
                                    >
                                        empty child
                                    </div>
                                </Target>
                                {this.state.popoverOpen4 && (
                                    <Popover
                                        placement="top"
                                        containerStyle={{
                                            height: 288,
                                            width: 384,
                                            background: white,
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: `1px solid ${red}`
                                        }}
                                        toggle={this.toggle4}
                                        arrowColors={{
                                            primary: white,
                                            secondary: turquoise,
                                            border: red
                                        }}
                                        toggleable={true}
                                        targetId="target2"
                                    />
                                )}
                            </Manager>
                        </div>

                        <div>
                            <Manager>
                                <Target>
                                    <div
                                        id="target3"
                                        onClick={() => this.toggle()}
                                        style={{
                                            height: 100,
                                            width: 100,
                                            background: 'yellow'
                                        }}
                                    >
                                        navbar
                                    </div>
                                </Target>
                                {this.state.popoverOpen && (
                                    <Popover
                                        placement="auto"
                                        containerStyle={{
                                            height: 288,
                                            width: 384,
                                            background: white,
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            border: `1px solid ${red}`
                                        }}
                                        toggle={this.toggle}
                                        navBarProperties={{
                                            buttonLeft: 'Button',
                                            title: 'Title',
                                            buttonRight: 'Button',
                                            id: 'navBarId',
                                            style: {
                                                containerStyle: {
                                                    borderRadius:
                                                        '3px 3px 0px 0px'
                                                }
                                            }
                                        }}
                                        arrowColors={{
                                            primary: cloud,
                                            secondary: white,
                                            border: red
                                        }}
                                        toggleable={true}
                                        targetId="target3"
                                    />
                                )}
                            </Manager>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return <ReactstrapComp />
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
                    backgroundColor: palefoam
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

storiesOf('Progress Bar (thin)', module)
    .add('0%', () => <ProgressBarThin progress={0} />)
    .add('20%', () => <ProgressBarThin progress={20} />)
    .add('25%', () => <ProgressBarThin progress={25} />)
    .add('33%', () => <ProgressBarThin progress={33} />)
    .add('40%', () => <ProgressBarThin progress={40} />)
    .add('50%', () => <ProgressBarThin progress={50} />)
    .add('60%', () => <ProgressBarThin progress={60} />)
    .add('66%', () => <ProgressBarThin progress={66} />)
    .add('75%', () => <ProgressBarThin progress={75} />)
    .add('80%', () => <ProgressBarThin progress={80} />)
    .add('100%', () => <ProgressBarThin progress={100} />)
    .add('120%', () => <ProgressBarThin progress={120} />)

storiesOf('RadioButton', module).add('selected and unselected', () => {
    return (
        <div>
            <RadioButton selected={true} />
            <RadioButton selected={false} />
        </div>
    )
})

storiesOf('SliderComponent', module).add('slider', () => {
    const Fragment = React.Fragment

    interface YState {
        val: number
    }

    class Y extends React.Component<{}, YState> {
        // tslint:disable-next-line:no-any
        constructor(props: any) {
            super(props)
            this.state = {
                val: 68
            }
            this.handleChange = this.handleChange.bind(this)
        }

        handleChange(val: number) {
            this.setState({
                val
            })
        }

        render() {
            return (
                <Fragment>
                    <div style={{ ...text, ...semibold, ...medium }}>
                        value: {this.state.val}
                    </div>
                    <SliderComponent
                        min={0}
                        max={100}
                        value={this.state.val}
                        onChange={this.handleChange}
                    />
                </Fragment>
            )
        }
    }
    return <Y />
})

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
interface TState {
    selected: string
}

interface TProps {
    tabs: string[]
    containerStyle?: React.CSSProperties
    tabStyle?: {
        container?: React.CSSProperties
        selection?: React.CSSProperties
    }
}

class T extends React.Component<TProps, TState> {
    // tslint:disable-next-line:no-any
    constructor(props: any) {
        super(props)
        this.state = {
            selected: 'one'
        }
        this.onClick = this.onClick.bind(this)
    }

    onClick(selected: string) {
        this.setState({
            selected: selected
        })
    }

    render() {
        return (
            <div
                style={{
                    width: 360,
                    height: 56,
                    border: '1px solid black'
                }}
            >
                <TabBar containerStyle={this.props.containerStyle}>
                    {this.props.tabs.map(tab => (
                        <Tab
                            val={tab}
                            selected={this.state.selected}
                            onClick={this.onClick}
                            tabStyle={this.props.tabStyle}
                        />
                    ))}
                </TabBar>
            </div>
        )
    }
}

storiesOf('TabBar', module)
    .add('3 tabs', () => {
        let tabs = ['one', 'two', 'three']
        return <T tabs={tabs} />
    })
    .add('2 tabs', () => {
        let tabs = ['one', 'two']
        return <T tabs={tabs} />
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
