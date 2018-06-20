/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import {
    PopoverContainer,
    GridIcon,
    charcoal,
    CampaignsIcon,
    StudioIcon,
    AudienceIcon,
    ProximityIcon,
    SettingsIcon,
    Text
} from '@rover/ts-bootstrap/dist/src'

import { updateActivePopover } from '../../actions'

import { getActivePopover } from '../../reducers'

export interface Props {
    device: Media
}

export interface GridIconPopoverProps {
    activePopover: string
}

export interface GridIconPopoverDispatchProps {
    updateActivePopover: (field: string) => void
}

const Apps: React.SFC = () => {
    const appContainer = (
        appName: string,
        icon: JSX.Element,
        href?: string
    ) => {
        return (
            <div
                style={{
                    display: 'inline-block',
                    marginRight: appName !== 'Audience' ? 8 : 0
                }}
            >
                <a
                    href={href}
                    style={{
                        textDecoration: 'none',
                        cursor: 'default'
                    }}
                >
                    <div
                        style={{
                            height: 80,
                            width: 72,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                marginBottom: 8
                            }}
                        >
                            {icon}
                        </div>
                        <Text text={appName} size="small" />
                    </div>
                </a>
            </div>
        )
    }

    return (
        <div
            style={{
                padding: '32px 20px',
                width: 272,
                height: 256
            }}
        >
            <div
                style={{
                    marginBottom: 32
                }}
            >
                {appContainer('Campaigns', CampaignsIcon(), '/campaigns/')}
                {appContainer('Studio', StudioIcon(), '/experiences/')}
                {appContainer(
                    'Audience',
                    AudienceIcon({
                        width: '48',
                        height: '48',
                        viewBox: '0 0 72 72'
                    }),
                    '/audience/'
                )}
            </div>
            {appContainer('Proximity', ProximityIcon(), '/proximity/')}
            {appContainer('Settings', SettingsIcon(), '/settings/')}
        </div>
    )
}

const GridIconPopover: React.SFC<
    GridIconPopoverProps & GridIconPopoverDispatchProps & Props
> = ({ activePopover, updateActivePopover, device }) => {
    return (
        <PopoverContainer
            id="grid-icon-home-page"
            popoverProps={{
                placement: 'bottom-end'
            }}
            onClick={() =>
                activePopover === 'grid-icon-home-page-popover'
                    ? updateActivePopover('')
                    : updateActivePopover('grid-icon-home-page-popover')
            }
            targetParent="root"
            showPopover={activePopover === 'grid-icon-home-page-popover'}
            style={{
                height: 20
            }}
        >
            <GridIcon
                fill={charcoal}
                height={device === 'Desktop' ? '20' : '24'}
                width={device === 'Desktop' ? '20' : '24'}
                viewBox="0 0 24 24"
            />
            <Apps />
        </PopoverContainer>
    )
}

const mapStateToProps = (state: State): GridIconPopoverProps => ({
    activePopover: getActivePopover(state)
})
const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): GridIconPopoverDispatchProps => {
    return {
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover))
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GridIconPopover)
