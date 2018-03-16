import * as React from 'react'
import {
    almostWhite,
    ArrowLeftIcon,
    ArrowRightIcon,
    charcoal,
    PlusSquareIcon,
    Text,
    titanium,
    turquoise
} from '@rover/ts-bootstrap/dist/src'
import NewCampaignPopover from './NewCampaignPopover'

export interface Props {
    currentPage: number
    media: Media
    onClick: (direction: 'forward' | 'backward') => void
    onCreate: (name: string, type: CampaignType) => void
    totalCount: number
}

const ToolBar: React.SFC<Props> = ({
    currentPage,
    media,
    onClick,
    onCreate,
    totalCount
}) => {
    const style: React.CSSProperties = {
        width: '100%',
        height: 47,
        flex: '0 0 auto',
        backgroundColor: almostWhite,
        borderTop: `1px ${titanium} solid`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 32,
        paddingRight: 32
    }

    const getLeftIconFill = () => {
        if (currentPage === 0) {
            return titanium
        }
        return charcoal
    }

    const getRightIconFill = () => {
        if ((currentPage + 1) * 50 > totalCount) {
            return titanium
        }
        return charcoal
    }

    const renderCurrentPage = () => (
        <Text
            size="small"
            text={`${currentPage * 50 + 1}-${(currentPage + 1) *
                50} of ${totalCount}`}
        />
    )

    const renderLeftArrow = (leftArrowStyle?: React.CSSProperties) => (
        <ArrowLeftIcon
            fill={getLeftIconFill()}
            height={media === 'Desktop' ? '20' : '24'}
            width={media === 'Desktop' ? '20' : '24'}
            viewBox="0 0 24 24"
            style={{ margin: '0 8', ...leftArrowStyle }}
            onClick={() => onClick('backward')}
        />
    )

    const renderRightArrow = (rightArrowStyle?: React.CSSProperties) => (
        <ArrowRightIcon
            fill={getRightIconFill()}
            height={media === 'Desktop' ? '20' : '24'}
            width={media === 'Desktop' ? '20' : '24'}
            viewBox="0 0 24 24"
            style={{ margin: '0 8', ...rightArrowStyle }}
            onClick={() => onClick('forward')}
        />
    )

    if (media === 'Desktop') {
        return (
            <div style={style}>
                {renderCurrentPage()}
                {renderLeftArrow()}
                {renderRightArrow({ margin: 0 })}
            </div>
        )
    }

    if (media === 'Tablet') {
        return (
            <div
                style={{
                    ...style,
                    justifyContent: 'flex-start',
                    paddingLeft: 24,
                    paddingRight: 0
                }}
            >
                {renderLeftArrow()}
                {renderRightArrow({ marginLeft: 0 })}
                {renderCurrentPage()}
            </div>
        )
    }

    if (media === 'Mobile') {
        return (
            <div
                style={{
                    ...style,
                    justifyContent: 'space-between',
                    paddingLeft: 24,
                    paddingRight: 24
                }}
            >
                <div
                    style={{
                        width: 56,
                        flex: 'none',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    {renderLeftArrow({ margin: 0 })}
                    {renderRightArrow({ margin: 0 })}
                </div>

                <NewCampaignPopover onCreate={onCreate} media={media} />
            </div>
        )
    }
    return (
        <div style={style}>
            {renderCurrentPage()}
            {renderLeftArrow()}
            {renderRightArrow({ margin: 0 })}
        </div>
    )
}

export default ToolBar
