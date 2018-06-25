/// <reference path="../../../../typings/index.d.ts"/>
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Dispatch } from 'react-redux'

import {
    closePopoverModalForm,
    updateActivePhonePreview,
    updateActivePopover,
    updateEditableCampaign
} from '../../../actions'

import {
    getActivePopover,
    getIsPopoverModalFormOpen,
    getEditableCampaign,
    getExperiences
} from '../../../reducers'

import {
    aquamarine,
    Button,
    ChangeIcon,
    EyeIcon,
    graphite,
    PopoverContainer,
    PopoverSearch,
    RadioButton,
    Text,
    titanium,
    turquoise,
    PlusIcon
} from '@rover/ts-bootstrap/dist/src'

import SelectableList from '../../utils/SelectableList'
import MobilePopover from '../components/MobilePopover'
import Row from '../components/Row'
import MediaQuery from 'react-responsive'
import PreviewPortal from '../components/PreviewPortal'
import MessageAndMediaIcon from './MessageAndMedia/MessageAndMediaIcon'

const grid =
    // tslint:disable-next-line:max-line-length
    'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMSAxMSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj7CoMKgwqDCoDxnIGZpbGw9IiMwMDAwMDAiPsKgwqDCoMKgwqDCoMKgwqA8cmVjdCB4PSIxIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBvcGFjaXR5PSIwLjA0Ii8+wqDCoMKgwqDCoMKgwqDCoDxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIG9wYWNpdHk9IjAuMTAiLz7CoMKgwqDCoMKgwqDCoMKgPHJlY3QgeD0iMSIgeT0iMiIgd2lkdGg9IjEiIGhlaWdodD0iMSIgb3BhY2l0eT0iMC4wNCIvPsKgwqDCoMKgwqDCoMKgwqA8cmVjdCB4PSIxIiB5PSI1IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBvcGFjaXR5PSIwLjAyIi8+wqDCoMKgwqDCoMKgwqDCoDxyZWN0IHg9IjEiIHk9IjciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIG9wYWNpdHk9IjAuMDIiLz7CoMKgwqDCoMKgwqDCoMKgPHJlY3QgeD0iMSIgeT0iOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgb3BhY2l0eT0iMC4wMiIvPsKgwqDCoMKgwqDCoMKgwqA8cmVjdCB4PSIwIiB5PSIxIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBvcGFjaXR5PSIwLjA0Ii8+wqDCoMKgwqDCoMKgwqDCoDxyZWN0IHg9IjIiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIG9wYWNpdHk9IjAuMDQiLz7CoMKgwqDCoMKgwqDCoMKgPHJlY3QgeD0iNSIgeT0iMSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgb3BhY2l0eT0iMC4wMiIvPsKgwqDCoMKgwqDCoMKgwqA8cmVjdCB4PSI3IiB5PSIxIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBvcGFjaXR5PSIwLjAyIi8+wqDCoMKgwqDCoMKgwqDCoDxyZWN0IHg9IjkiIHk9IjEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIG9wYWNpdHk9IjAuMDIiLz7CoMKgwqDCoDwvZz48L3N2Zz4=")'

export interface ExperienceSelectorProps {
    device: Media
}

export interface ExperienceSelectorState {
    isSearchFocused: boolean
    experienceSearch: string
}

export interface ExperienceSelectorStateProps {
    activePopover: string
    editableCampaign: ScheduledCampaign | AutomatedNotificationCampaign
    experiences: Array<Experience>
    isPopoverModalFormOpen: string
}

export interface ExperienceSelectorDispatchProps {
    closePopoverModalForm: () => void
    updateActivePhonePreview: (preview: string) => void
    updateActivePopover: (field: string) => void
    updateEditableCampaign: (id: string) => void
}

class ExperienceSelector extends React.Component<
    ExperienceSelectorProps &
        ExperienceSelectorStateProps &
        ExperienceSelectorDispatchProps,
    ExperienceSelectorState
> {
    constructor(
        props: ExperienceSelectorProps &
            ExperienceSelectorStateProps &
            ExperienceSelectorDispatchProps
    ) {
        super(props)

        this.state = {
            isSearchFocused: false,
            experienceSearch: ''
        }
        this.closePopover = this.closePopover.bind(this)
        this.setState = this.setState.bind(this)
    }

    closePopover() {
        const {
            closePopoverModalForm,
            device,
            updateActivePopover
        } = this.props
        closePopoverModalForm()
        setTimeout(() => {
            this.setState({ experienceSearch: '' })
            updateActivePopover('')
        }, device === 'Mobile' ? 500 : 0)
    }

    getFilteredExperiences(): Array<Experience> {
        const { experiences } = this.props
        const { experienceSearch } = this.state
        return experiences.filter(
            ({ name }) =>
                name.toLowerCase().includes(experienceSearch.toLowerCase()) ||
                experienceSearch === ''
        )
    }

    renderExperiencePreview() {
        const { device, editableCampaign, experiences } = this.props
        const { experienceId } = editableCampaign
        const experience = experiences.filter(
            ({ id }) => id === experienceId
        )[0]

        const style: React.CSSProperties = {
            position: 'absolute',
            top: device !== 'Desktop' ? 0 : 96,
            zIndex: 11,
            left: device !== 'Desktop' ? 0 : 24,
            height: 568,
            width: 320
        }
        const simulatorURL = experience
            ? `${experience.simulatorURL}?showStatusBar=true`
            : undefined

        const preview = (
            <React.Fragment>
                <div style={{ ...style, backgroundColor: 'white' }}>
                    <MessageAndMediaIcon />
                </div>
                <div
                    style={{
                        ...style,
                        backgroundImage: grid,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        size="medium"
                        text="Select an experience to preview its contents"
                        textStyle={{
                            color: graphite,
                            textAlign: 'center',
                            width: 162
                        }}
                    />
                </div>
                <iframe
                    id="experience-preview"
                    src={simulatorURL}
                    style={style}
                />
            </React.Fragment>
        )

        if (device === 'Desktop') {
            return (
                <MediaQuery minWidth={1140}>
                    {ReactDOM.createPortal(
                        preview,
                        document.getElementById('phone-bezel')
                    )}
                </MediaQuery>
            )
        }

        return (
            <div
                style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <PreviewPortal device={device} title="Experience Preview">
                    {preview}
                </PreviewPortal>
            </div>
        )
    }

    renderExperiences() {
        const {
            device,
            editableCampaign,
            experiences,
            updateActivePopover,
            updateEditableCampaign
        } = this.props
        const { experienceId } = editableCampaign
        return (
            <SelectableList device={device}>
                {this.getFilteredExperiences().map(({ name, id }) => (
                    <div
                        key={name}
                        onClick={e => {
                            e.stopPropagation()
                            updateEditableCampaign(id)
                            this.closePopover()
                        }}
                        style={{
                            display: 'flex',
                            height: device !== 'Mobile' ? 55 : 71,
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Text text={name} size="large" />
                        <RadioButton
                            selected={experienceId === id}
                            style={{
                                outerStyle: { height: 18, width: 18 }
                            }}
                        />
                    </div>
                ))}
            </SelectableList>
        )
    }

    renderLabel() {
        const { editableCampaign, experiences } = this.props
        const { experienceId } = editableCampaign

        const experience = experiences.filter(
            ({ id }) => id === experienceId
        )[0]

        if (experienceId === '') {
            return <Text size="large" text="Which Experience?" label={true} />
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text size="small" text="Which Experience?" label={true} />
                <Text size="large" text={experience ? experience.name : ''} />
            </div>
        )
    }

    renderMobilePopover() {
        const {
            activePopover,
            device,
            isPopoverModalFormOpen,
            updateActivePopover
        } = this.props
        const { isSearchFocused, experienceSearch } = this.state

        if (activePopover === 'experience-selector-popover') {
            return ReactDOM.createPortal(
                <MobilePopover
                    animation={isPopoverModalFormOpen}
                    navbarProps={{
                        buttonLeft: 'Cancel',
                        buttonLeftCallback: this.closePopover
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <PopoverSearch
                            device={device}
                            isSearchFocused={isSearchFocused}
                            removeFocus={() =>
                                this.setState({
                                    isSearchFocused: false
                                })
                            }
                            setFocus={() =>
                                this.setState({ isSearchFocused: true })
                            }
                            submitText={(experienceSearch: string) =>
                                this.setState({ experienceSearch })
                            }
                            text={experienceSearch}
                        />
                        <div
                            style={{
                                flex: '1 1 auto',
                                overflowY: 'scroll',
                                paddingBottom: device === 'Mobile' ? 55 : 0
                            }}
                        >
                            {this.renderExperiences()}
                        </div>
                    </div>
                </MobilePopover>,
                document.getElementById('mainModalLeft')
            )
        }
    }

    renderPopover() {
        const {
            activePopover,
            device,
            editableCampaign,
            updateActivePopover
        } = this.props
        const { experienceId } = editableCampaign
        return (
            <PopoverContainer
                id="experience-selector-popover"
                onClick={() =>
                    activePopover === 'experience-selector-popover'
                        ? updateActivePopover('')
                        : updateActivePopover('experience-selector-popover')
                }
                popoverProps={{
                    placement: 'left',
                    device: device,
                    navBarProperties: {
                        buttonLeft: 'Cancel',
                        buttonLeftCallback: this.closePopover
                    }
                }}
                targetParent={
                    device === 'Desktop' ? 'mainModalView' : 'mainModalLeft'
                }
                showPopover={activePopover === 'experience-selector-popover'}
            >
                {device === 'Desktop' ? (
                    <Button
                        text={experienceId !== '' ? 'Change' : 'Select'}
                        type="regular"
                        mouseDownColors={{
                            active: turquoise,
                            inactive: aquamarine
                        }}
                        key="timezone-selector"
                    />
                ) : experienceId !== '' ? (
                    <ChangeIcon fill={titanium} style={{ marginLeft: 16 }} />
                ) : (
                    <PlusIcon fill={titanium} />
                )}
                {this.renderSearch()}
            </PopoverContainer>
        )
    }

    renderSearch() {
        const { device } = this.props
        const { experienceSearch, isSearchFocused } = this.state
        return (
            <div
                style={{
                    width: device === 'Mobile' ? '100%' : 384,
                    height: device === 'Mobile' ? '100%' : 296,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <PopoverSearch
                    device={device}
                    isSearchFocused={isSearchFocused}
                    removeFocus={() =>
                        this.setState({ isSearchFocused: false })
                    }
                    setFocus={() => this.setState({ isSearchFocused: true })}
                    submitText={(experienceSearch: string) =>
                        this.setState({ experienceSearch })
                    }
                    text={experienceSearch}
                />
                <div
                    style={{
                        flex: '1 1 auto',
                        overflowY: 'scroll'
                    }}
                >
                    {this.renderExperiences()}
                </div>
            </div>
        )
    }

    render() {
        const {
            device,
            editableCampaign,
            updateActivePhonePreview,
            updateActivePopover
        } = this.props
        const { experienceId } = editableCampaign
        return (
            <Row
                onClick={() =>
                    updateActivePopover('experience-selector-popover')
                }
            >
                {this.renderLabel()}
                <div
                    style={{
                        height: '100%',
                        width: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    {device !== 'Desktop' &&
                        experienceId !== '' && (
                            <EyeIcon
                                fill={aquamarine}
                                onClick={e => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    updateActivePhonePreview(
                                        'Experience Preview'
                                    )
                                }}
                            />
                        )}
                    {this.renderExperiencePreview()}
                    {device === 'Mobile'
                        ? this.renderMobilePopover()
                        : this.renderPopover()}
                </div>
            </Row>
        )
    }
}

const mapStateToProps = (state: State): ExperienceSelectorStateProps => ({
    activePopover: getActivePopover(state),
    editableCampaign: getEditableCampaign(state),
    experiences: getExperiences(state),
    isPopoverModalFormOpen: getIsPopoverModalFormOpen(state)
})

const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): ExperienceSelectorDispatchProps => {
    return {
        closePopoverModalForm: () => dispatch(closePopoverModalForm()),
        updateActivePhonePreview: (preview: string) =>
            dispatch(updateActivePhonePreview(preview)),
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        updateEditableCampaign: (id: string) =>
            dispatch(
                updateEditableCampaign({
                    experienceId: id
                })
            )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExperienceSelector)
