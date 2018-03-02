/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import {
    almostWhite,
    Button,
    cloud,
    charcoal,
    FilterArrowIcon,
    GridIcon,
    PlusSquareIcon,
    silver,
    SegmentControl,
    SearchIcon,
    text as TypeographyText,
    Text,
    titanium,
    turquoise,
    UserIcon
} from '@rover/ts-bootstrap/dist/src'

import CampaignTypeSelector from './CampaignTypeSelector'
import NewCampaignPopover from './NewCampaignPopover'

export interface Props {
    media: Media
    style?: React.CSSProperties
    onCreate: (name: string, type: CampaignType) => void
    setListStatus: (status: QueryParams['campaignStatus']) => void
    listStatus: QueryParams['campaignStatus']
    setListType: (campaignType: QueryParams['campaignType']) => void
    listType: QueryParams['campaignType']
    setKeyword: (keyword: string) => void
}

export interface State {
    isSearchFocused: boolean
    keyword: string
}

const renderLeftContent = (media: Media) => {
    if (media === 'Desktop') {
        return <div style={{ width: 56 }} />
    }
    return <UserIcon fill={charcoal} />
}

const renderRightContent = (
    media: Media,
    onCreate: (name: string, type: CampaignType) => void
) => {
    if (media === 'Desktop') {
        return (
            <div
                style={{
                    width: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <GridIcon
                    fill={charcoal}
                    style={{
                        transform: `scale(${5 / 6})`
                    }}
                    // onClick={() => window.console.log('grid icon')}
                />
                <UserIcon
                    fill={charcoal}
                    style={{
                        transform: `scale(${5 / 6})`,
                        pointerEvents: 'none'
                    }}
                />
            </div>
        )
    }
    if (media === 'Tablet') {
        return <NewCampaignPopover onCreate={onCreate} media={media} />
    }
    if (media === 'Mobile') {
        return <div style={{ width: 24 }} />
    }
}

const renderSegmentControl = (
    selectedControl: QueryParams['campaignStatus'],
    update: (status: QueryParams['campaignStatus']) => void,
    media: Media
) => {
    const segmentControlButtonStyle = {
        ...TypeographyText,
        width: 98,
        height: 20,
        textAlign: 'center',
        paddingTop: 1,
        flex: '1 1 auto'
    }
    return (
        <SegmentControl
            style={{ flex: 'none', width: media === 'Mobile' ? '100%' : 288 }}
        >
            <div
                style={{
                    ...segmentControlButtonStyle,
                    color: selectedControl === 'all' ? 'white' : turquoise,
                    backgroundColor:
                        selectedControl === 'all' ? turquoise : 'white'
                }}
                onClick={() => update('all')}
            >
                All
            </div>
            <div
                style={{
                    ...segmentControlButtonStyle,
                    color: selectedControl === 'drafts' ? 'white' : turquoise,
                    backgroundColor:
                        selectedControl === 'drafts' ? turquoise : 'white',
                    borderLeft: `2px solid ${turquoise}`,
                    borderRight: `2px solid ${turquoise}`
                }}
                onClick={() => update('drafts')}
            >
                Drafts
            </div>
            <div
                style={{
                    ...segmentControlButtonStyle,
                    color:
                        selectedControl === 'published' ? 'white' : turquoise,
                    backgroundColor:
                        selectedControl === 'published' ? turquoise : 'white'
                }}
                onClick={() => update('published')}
            >
                Published
            </div>
        </SegmentControl>
    )
}

class NavBar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            isSearchFocused: false,
            keyword: ''
        }
        this.setState = this.setState.bind(this)
    }

    render() {
        const {
            listStatus,
            listType,
            media,
            onCreate,
            setListStatus,
            setListType,
            setKeyword,
            style
        } = this.props

        const { isSearchFocused, keyword } = this.state

        const baseStyle = {
            width: '100%',
            backgroundColor: almostWhite,
            borderBottom: `1px solid ${titanium}`,
            flex: 'none'
        }
        return (
            <div
                style={{ height: media === 'Desktop' ? 97 : 139, ...baseStyle }}
            >
                <div
                    style={{
                        height: 40,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        paddingLeft: media === 'Mobile' ? 24 : 32,
                        paddingRight: media === 'Mobile' ? 24 : 32,
                        marginBottom: media === 'Desktop' ? 0 : 16
                    }}
                >
                    {renderLeftContent(media)}
                    <CampaignTypeSelector
                        listType={listType}
                        setListType={setListType}
                        media={media}
                    />
                    {renderRightContent(media, onCreate)}
                </div>
                <div
                    style={{
                        height: media === 'Desktop' ? 57 : 83,
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: media === 'Desktop' ? 'row' : 'column',
                        alignItems: 'center',
                        paddingLeft: media === 'Mobile' ? 24 : 32,
                        paddingRight: media === 'Mobile' ? 24 : 32
                    }}
                >
                    {media === 'Desktop' && (
                        <div style={{ width: 288 }}>
                            <div style={{ width: 140 }}>
                                <NewCampaignPopover
                                    onCreate={onCreate}
                                    media={media}
                                />
                            </div>
                        </div>
                    )}

                    {renderSegmentControl(listStatus, setListStatus, media)}
                    <div
                        style={{
                            width: media === 'Mobile' ? '100%' : 288,
                            height: 28,
                            backgroundColor: cloud,
                            borderRadius: 4,
                            marginTop: 14,
                            marginBottom: 14,
                            paddingLeft: 8,
                            paddingTop: 1,
                            display: 'flex'
                        }}
                        onClick={() =>
                            this.setState({
                                isSearchFocused: true
                            })
                        }
                    >
                        <SearchIcon
                            fill={silver}
                            style={{
                                transform: `scale(${2 / 3})`
                            }}
                        />
                        <Text
                            id="list-page-search"
                            text={keyword}
                            size="medium"
                            contentEditable={isSearchFocused}
                            handleChange={(searchString: string) => {
                                this.setState({
                                    isSearchFocused: false,
                                    keyword: searchString
                                })
                                if (searchString !== '') {
                                    setKeyword(searchString)
                                }
                            }}
                            onBlurChange={true}
                            placeholder={true}
                            placeholderText="Search"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar
