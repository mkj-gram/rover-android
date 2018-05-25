import * as React from 'react'
import { cloud, SearchIcon, silver, Text } from './'

export interface PopoverSearchProps {
    device: 'Mobile' | 'Tablet' | 'Desktop'
    isSearchFocused: boolean
    removeFocus: () => void
    setFocus: () => void
    submitText: (searchString: string) => void
    text: string
}

const PopoverSearch: React.SFC<PopoverSearchProps> = ({
    device,
    isSearchFocused,
    removeFocus,
    setFocus,
    submitText,
    text
}) => (
    <div
        style={{
            backgroundColor: cloud,
            width: '100%',
            paddingBottom: 14,
            paddingLeft: device === 'Mobile' ? 24 : 16,
            paddingRight: device === 'Mobile' ? 24 : 16,
            flex: '0 0 auto'
        }}
        onClick={(
            e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
        ) => e.stopPropagation()}
    >
        <div
            style={{
                width: '100%',
                height: 28,
                backgroundColor: 'white',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center'
            }}
            onClick={(
                e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
            ) => setFocus()}
        >
            <SearchIcon
                fill={silver}
                height="16"
                width="16"
                viewBox="0 0 24 24"
                style={{ margin: '0 8px' }}
            />
            <Text
                contentEditable={isSearchFocused}
                handleChange={removeFocus}
                id="popover-search"
                onBlurChange={true}
                onInputChange={(searchString: string) =>
                    submitText(searchString)
                }
                placeholder={true}
                placeholderText="Search"
                size="medium"
                text={text}
                textStyle={{
                    width: '100%'
                }}
            />
        </div>
    </div>
)

export default PopoverSearch
