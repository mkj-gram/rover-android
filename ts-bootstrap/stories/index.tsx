import * as React from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import * as moment from 'moment'

import {
    Alert,
    AlertOptionsPushNotification,
    AlertOptionsBadgeNumber,
    AlertOptionsNotificationCenter,
    Text,
    Badge,
    Button,
    CheckBox,
    DatePicker,
    Dialog,
    NavBar,
    PhoneComponent,
    Popover,
    PopoverContainer,
    ProgressBar,
    ProgressBarThin,
    RadioButton,
    SegmentControl,
    SliderComponent,
    Switch,
    Tab,
    TabBar,
    TextInput,
    TimePicker
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
import { CheckmarkIcon, ChevronLeftIcon } from '../src/Icons/index'

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

storiesOf('Checkbox', module).add('on and off', () => (
    <div style={{ width: 500, height: 500 }}>
        <CheckBox checked={true} />
    </div>
))

storiesOf('DatePicker', module).add('select Date', () => {
    interface datePickerState {
        selected: string
        showDatePicker: boolean
        time: Date
        displayTime: string
    }

    class DatePickerComponent extends React.Component<{}, datePickerState> {
        constructor(props: any) {
            super(props)
            const time = moment(new Date())
                .add(3, 'days')
                .toDate()
            const displayTime = moment(new Date())
                .add(3, 'days')
                .format('LL')
            this.state = {
                selected: '',
                showDatePicker: false,
                time,
                displayTime
            }
            this.onSelect = this.onSelect.bind(this)
            this.handleShowDatepicker = this.handleShowDatepicker.bind(this)
        }

        onSelect(time: Date) {
            this.setState({
                time,
                displayTime: moment(time).format('LL'),
                showDatePicker: !this.state.showDatePicker
            })
        }
        handleShowDatepicker() {
            this.setState({
                showDatePicker: !this.state.showDatePicker
            })
        }

        render() {
            const Fragment = React.Fragment
            const targetParent = 'coverThis'

            return (
                <div
                    style={{
                        display: 'flex',
                        height: '100vh',
                        width: '100vw',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    id={targetParent}
                >
                    <PopoverContainer
                        id="12345"
                        popoverProps={{
                            placement: 'left'
                        }}
                        targetParent={targetParent}
                        onClick={this.handleShowDatepicker}
                        showPopover={this.state.showDatePicker}
                    >
                        <Button text={this.state.displayTime} size="large" />
                        <DatePicker
                            onSelect={this.onSelect}
                            defaultDate={this.state.time}
                        />
                    </PopoverContainer>
                </div>
            )
        }
    }

    return <DatePickerComponent />
})

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
                let x =
                    'Publishing this campagin will schedule it for delivery on Jan 8 at 3:00 PM America/Toronto. Continue?'
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
                                targetParent="entire"
                                dialogText={x}
                            />
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
                                targetParent="entire"
                                dialogText="Publishing this campagin will schedule it for delivery on Jan 8 at 3:00 PM America/Toronto. Continue?"
                            />
                        )}
                        }
                    </div>
                )
            }
        }

        return <WholeScreen />
    })

storiesOf('Navbar', module).add('multi cases', () => {
    const customLeftElem = (
        <div
            style={{
                display: 'flex',
                marginLeft: 16
            }}
        >
            <ChevronLeftIcon fill="#000" />
            <Button
                text="Back"
                type="regular"
                style={{
                    innerStyle: {
                        color: graphite
                    }
                }}
            />
        </div>
    )

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <NavBar buttonLeft="ok" />
            <br />
            <NavBar buttonLeft="left" title="this title" />
            <br />
            <NavBar buttonLeft="left" title="this title" buttonRight="Right" />
            <br />
            <NavBar
                buttonLeft="left"
                title="this title"
                buttonRight="Right"
                customLeftElem={customLeftElem}
            />
        </div>
    )
})

storiesOf('PopoverContainer', module).add('cases', () => {
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
            const referenceStyle = {
                width: 100,
                height: 100,
                backgroundColor: 'red'
            }

            const popoverProps = {
                placement: 'bottom'
            }
            const targetParent = 'coverThis'
            return (
                <div
                    style={{
                        display: 'flex',
                        height: '100vh',
                        width: '100vw',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    id={targetParent}
                >
                    <PopoverContainer
                        id="12345"
                        popoverProps={popoverProps}
                        targetParent={targetParent}
                        onClick={this.toggle}
                        showPopover={this.state.switched}
                    >
                        {[
                            <div
                                key="123456"
                                style={{
                                    height: 100,
                                    width: 100,
                                    background: 'yellow',
                                    display: 'inline-block'
                                }}
                            >
                                Test
                            </div>,

                            <div
                                style={{
                                    flexDirection: 'column'
                                }}
                            >
                                <div
                                    style={{
                                        width: 384,
                                        height: 288
                                    }}
                                />
                            </div>
                        ]}
                    </PopoverContainer>
                </div>
            )
        }
    }

    return <X />
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

        onClick() {
            this.toggle2()
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
                    id="herez"
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <Manager>
                                <Reference>
                                    {props => (
                                        <div {...props} id="target5">
                                            <Button
                                                text="Next"
                                                size="large"
                                                type="primary"
                                                style={{
                                                    outerStyle: {
                                                        marginRight: 10
                                                    }
                                                }}
                                                onClick={() => this.toggle2()}
                                            />
                                        </div>
                                    )}
                                </Reference>
                                {this.state.popoverOpen2 && (
                                    <Popover
                                        placement="right"
                                        toggle={this.toggle2}
                                        targetParent="root"
                                        navBarProperties={{
                                            buttonLeft: 'Button',
                                            title: 'Title',
                                            buttonRight: 'Button',
                                            buttonRightCallback: () =>
                                                this.toggle2(),
                                            id: 'navBarId',
                                            style: {
                                                containerStyle: {
                                                    borderRadius:
                                                        '3px 3px 0px 0px'
                                                }
                                            }
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: 288,
                                                width: 384
                                            }}
                                        />
                                    </Popover>
                                )}
                            </Manager>
                        </div>
                        <div
                            onClick={() => null}
                            style={{
                                width: 300,
                                height: 100,
                                background: 'yellow'
                            }}
                        >
                            okahy
                        </div>

                        <div>
                            <Manager>
                                <Reference>
                                    {props => (
                                        <div
                                            {...props}
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
                                    )}
                                </Reference>
                                {this.state.popoverOpen3 && (
                                    <Popover
                                        placement="right"
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
                                        targetParent="root"
                                    >
                                        <div
                                            style={{
                                                height: 288,
                                                width: 384
                                            }}
                                        />
                                    </Popover>
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
                                <Reference>
                                    {props => (
                                        <div
                                            {...props}
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
                                    )}
                                </Reference>
                                {this.state.popoverOpen1 && (
                                    <Popover
                                        placement="bottom"
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
                                        targetParent="root"
                                    >
                                        <div
                                            style={{
                                                height: 288,
                                                width: 384
                                            }}
                                        />
                                    </Popover>
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
                                <Reference>
                                    {props => (
                                        <div
                                            {...props}
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
                                    )}
                                </Reference>
                                {this.state.popoverOpen4 && (
                                    <Popover
                                        placement="top"
                                        toggle={this.toggle4}
                                        arrowColors={{
                                            primary: white,
                                            secondary: turquoise,
                                            border: red
                                        }}
                                        toggleable={true}
                                        targetParent="root"
                                    >
                                        <div
                                            style={{
                                                height: 288,
                                                width: 384
                                            }}
                                        />
                                    </Popover>
                                )}
                            </Manager>
                        </div>

                        <div>
                            <Manager>
                                <Reference>
                                    {props => (
                                        <div
                                            {...props}
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
                                    )}
                                </Reference>
                                {this.state.popoverOpen && (
                                    <Popover
                                        placement="auto"
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
                                        targetParent="root"
                                    >
                                        <div
                                            style={{
                                                height: 288,
                                                width: 384
                                            }}
                                        />
                                    </Popover>
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

storiesOf('SegmentControl', module).add('Buttons', () => {
    const segmentControlButtonStyle = {
        ...text,
        color: turquoise,
        width: 98,
        height: 24,
        textAlign: 'center'
    }
    return (
        <SegmentControl>
            <div
                style={{
                    ...segmentControlButtonStyle,
                    color: 'white',
                    backgroundColor: turquoise
                }}
                onClick={() => window.console.log('selected')}
            >
                Selected
            </div>
            <div
                style={{
                    ...segmentControlButtonStyle,
                    borderLeft: `2px solid ${turquoise}`,
                    borderRight: `2px solid ${turquoise}`
                }}
                onClick={() => window.console.log('normal')}
            >
                Normal
            </div>
            <div
                style={segmentControlButtonStyle}
                onClick={() => window.console.log('normal')}
            >
                Normal
            </div>
        </SegmentControl>
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
    .add('Text editable- onBlur triggers no change', () => {
        interface ZState {
            edittable: boolean
            ts: string
        }
        class T extends React.Component<{}, ZState> {
            // tslint:disable-next-line:no-any
            constructor(props: any) {
                super(props)
                this.state = {
                    edittable: false,
                    ts: 'Lorem ipsum sit dolor amet'
                }
                this.onClick = this.onClick.bind(this)
                this.handleChange = this.handleChange.bind(this)
            }

            onClick() {
                this.setState({
                    edittable: !this.state.edittable
                })
            }

            handleChange(val: string) {
                this.setState({
                    ts: val,
                    edittable: !this.state.edittable
                })
            }

            render() {
                return (
                    <div
                        style={{
                            width: 300,
                            height: 200
                        }}
                    >
                        <Text
                            text={this.state.ts}
                            size="h1"
                            contentEditable={this.state.edittable}
                            handleChange={this.handleChange}
                            id="thy"
                            onBlurChange={false}
                        />
                        <div
                            style={{
                                width: 500,
                                height: 500,
                                background: red
                            }}
                            onClick={this.onClick}
                        >
                            clickMe
                        </div>
                    </div>
                )
            }
        }

        return <T />
    })
    .add('Text editable- onBlur triggers onChange', () => {
        interface ZState {
            edittable: boolean
            ts: string
        }
        class T extends React.Component<{}, ZState> {
            // tslint:disable-next-line:no-any
            constructor(props: any) {
                super(props)
                this.state = {
                    edittable: false,
                    ts: 'Lorem'
                }
                this.onClick = this.onClick.bind(this)
                this.handleChange = this.handleChange.bind(this)
            }

            onClick() {
                this.setState({
                    edittable: !this.state.edittable
                })
            }

            handleChange(val: string) {
                this.setState({
                    ts: val,
                    edittable: !this.state.edittable
                })
            }

            render() {
                return (
                    <div
                        style={{
                            width: 300,
                            height: 200
                        }}
                    >
                        <Text
                            text={this.state.ts}
                            size="h1"
                            contentEditable={this.state.edittable}
                            handleChange={this.handleChange}
                            id="thy"
                            onBlurChange={true}
                        />
                        <div
                            style={{
                                width: 500,
                                height: 500,
                                background: red
                            }}
                            onClick={this.onClick}
                        >
                            clickMe
                        </div>
                    </div>
                )
            }
        }

        return <T />
    })

    .add('Text Placeholder editable w/ onBlur change', () => {
        interface ZState {
            edittable: boolean
            ts: string

            ts1: string
            edittable1: boolean
        }
        class T extends React.Component<{}, ZState> {
            // tslint:disable-next-line:no-any
            constructor(props: any) {
                super(props)
                this.state = {
                    edittable: false,
                    edittable1: false,
                    ts: '',
                    ts1: ''
                }
                this.onClick = this.onClick.bind(this)
                this.handleChange = this.handleChange.bind(this)
                this.handleChange1 = this.handleChange1.bind(this)
                this.handleBlurChange = this.handleBlurChange.bind(this)
            }

            onClick() {
                this.setState({
                    edittable: !this.state.edittable
                })
            }

            handleChange(val: string) {
                this.setState({
                    ts: val,
                    edittable: !this.state.edittable
                })
            }

            handleBlurChange(val: string) {
                const ts = `${val}+BLUR`
                this.setState({
                    ts,
                    edittable: !this.state.edittable
                })
            }

            handleChange1(val: string) {
                this.setState({
                    ts1: val
                })
            }

            render() {
                return (
                    <div
                        style={{
                            width: 300,
                            height: 200
                        }}
                    >
                        <Text
                            text={this.state.ts}
                            size="h1"
                            contentEditable={this.state.edittable}
                            handleChange={this.handleChange}
                            id="text12"
                            onBlurChange={true}
                            handleBlurChange={this.handleBlurChange}
                            placeholder={true}
                            placeholderText="Lorem Ipsum Things"
                        />
                        <Text
                            text={this.state.ts1}
                            size="h1"
                            contentEditable={this.state.edittable1}
                            handleChange={this.handleChange1}
                            id="text13"
                            onBlurChange={false}
                            handleBlurChange={() =>
                                console.log('in handle blur change')
                            }
                            placeholder={true}
                            placeholderText="Lorem Ipsum Things"
                        />
                        <div
                            style={{
                                width: 100,
                                height: 50,
                                background: red
                            }}
                            onClick={this.onClick}
                        >
                            clickMe
                        </div>
                    </div>
                )
            }
        }

        return <T />
    })
    .add('h1', () => <Text text="Header 1" size="h1" />)
    .add('h1-editable', () => (
        <Text
            text="Header 1- Editable"
            size="h1"
            contentEditable={true}
            handleChange={() => null}
            id="ok"
        />
    ))

    .add('h2', () => <Text text="Header 2" size="h2" />)
    .add('h2-editable', () => (
        <Text
            text="Header 2- Editable"
            size="h2"
            contentEditable={true}
            handleChange={(v: string) => console.log(`v: ${v}`)}
            id="b"
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
            id="c"
        />
    ))
    .add('text-large-left-non-editable-placeholder', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="large"
            contentEditable={false}
            handleChange={() => null}
            placeholder={true}
            id="those"
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
            id="d"
        />
    ))

    .add('text-small-left-editable', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="small"
            contentEditable={true}
            id="e"
        />
    ))
    .add('text-small-center-editable', () => (
        <Text
            text="Lorem ipsum sit dolor amet"
            size="small"
            position="center"
            contentEditable={true}
            id="f"
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

storiesOf('TextInput', module).add('Removable Text', () => {
    interface TextInputState {
        text: string
        isEditingText: boolean
        text2: string
        isEditingText2: boolean
        text3: string
        isEditingText3: boolean
    }
    class TextInputExample extends React.Component<{}, TextInputState> {
        constructor(props: {}) {
            super(props)
            this.state = {
                text: undefined,
                isEditingText: false,
                text2: undefined,
                isEditingText2: false,
                text3: undefined,
                isEditingText3: false
            }
            this.setState = this.setState.bind(this)
        }

        render() {
            const {
                text,
                isEditingText,
                text2,
                isEditingText2,
                text3,
                isEditingText3
            } = this.state

            return (
                <div style={{ width: 300 }}>
                    <div style={{ width: '100%', background: beige }}>
                        <TextInput
                            id="removable-text"
                            deleteText={() =>
                                this.setState({ text: undefined })
                            }
                            isEditingText={isEditingText}
                            label="Text Input Desktop"
                            media="Desktop"
                            startEditingText={() =>
                                this.setState({ isEditingText: true })
                            }
                            text={text}
                            updateText={(text: string) =>
                                this.setState({ text, isEditingText: false })
                            }
                            fieldStyle={{
                                height: 100
                            }}
                        />
                    </div>
                    <TextInput
                        id="removable-text-mobile"
                        deleteText={() =>
                            this.setState({
                                isEditingText2: false,
                                text2: undefined
                            })
                        }
                        isEditingText={this.state.isEditingText2}
                        label="Text Input Mobile"
                        media="Mobile"
                        startEditingText={() => {
                            this.setState({
                                isEditingText2: true
                            })
                        }}
                        text={text2}
                        updateText={(text: string) => {
                            this.setState({
                                text2: text,
                                isEditingText2: false
                            })
                        }}
                    />
                    <TextInput
                        id="removable-text-tablet"
                        deleteText={() =>
                            this.setState({
                                text3: undefined,
                                isEditingText3: false
                            })
                        }
                        isEditingText={isEditingText3}
                        label="Text Input Tabletl"
                        media="Tablet"
                        startEditingText={() =>
                            this.setState({
                                isEditingText3: true
                            })
                        }
                        text={text3}
                        updateText={(text: string) =>
                            this.setState({
                                text3: text,
                                isEditingText3: false
                            })
                        }
                    />
                </div>
            )
        }
    }

    return <TextInputExample />
})

storiesOf('TextInput', module).add('Required Text', () => {
    interface TextInputState {
        text: string
        isEditingText: boolean
    }
    class TextInputExample extends React.Component<{}, TextInputState> {
        constructor(props: {}) {
            super(props)
            this.state = {
                text: undefined,
                isEditingText: false
            }
            this.setState = this.setState.bind(this)
        }
        render() {
            const { text, isEditingText } = this.state
            return (
                <div style={{ width: 300 }}>
                    <TextInput
                        id="required-text"
                        deleteText={() => this.setState({ text: undefined })}
                        isEditingText={isEditingText}
                        label="Text Input Sample Label"
                        media="Desktop"
                        startEditingText={() =>
                            this.setState({ isEditingText: true })
                        }
                        text={text}
                        updateText={(text: string) =>
                            this.setState({ text, isEditingText: false })
                        }
                        placeholder="This is a placeholder"
                    />
                </div>
            )
        }
    }

    return <TextInputExample />
})

storiesOf('TimePicker', module).add('pick time', () => {
    const Fragment = React.Fragment

    interface YState {
        seconds: number
    }

    class Y extends React.Component<{}, YState> {
        // tslint:disable-next-line:no-any
        constructor(props: any) {
            super(props)

            this.state = {
                seconds: undefined
            }
            this.handleSecondsChange = this.handleSecondsChange.bind(this)
        }

        handleSecondsChange(seconds: number) {
            this.setState({
                seconds
            })
        }

        render() {
            return (
                <TimePicker
                    {...this.state}
                    handleSecondsChange={this.handleSecondsChange}
                />
            )
        }
    }
    return <Y />
})
