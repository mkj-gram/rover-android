/// <reference path="../../../typings/index.d.ts" />
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import {
    isScheduledCampaign,
    isAutomatedNotificationCampaign
} from '../utils/getCampaignType'

import {
    ArchiveIcon,
    charcoal,
    DuplicateIcon,
    GearIcon,
    MoreIcon,
    PopoverContainer,
    steel,
    Text
} from '@rover/ts-bootstrap/dist/src'

import {
    updateActivePopover,
    duplicateListViewCampaign,
    archiveListViewCampaign
} from '../../actions'

import { getActivePopover, getDuplicateCampaignName } from '../../reducers'

import SelectableList from '../utils/SelectableList'

export interface Props {
    campaign: Campaign
    device: Media
    pushToModal: (campaignId: string, route: string) => void
}

export interface CampaignsListShowMorePopoverProps {
    activePopover: string
    getDuplicateCampaignName: (campaign: Campaign) => string
}

export interface CampaignsListShowMorePopoverDispatchProps {
    updateActivePopover: (field: string) => void
    duplicateCampaign: (name: string, campaignId: number) => void
    archiveCampaign: (campaignId: number) => void
}

const CampaignsListShowMorePopover: React.SFC<
    CampaignsListShowMorePopoverProps &
        CampaignsListShowMorePopoverDispatchProps &
        Props
> = ({
    activePopover,
    updateActivePopover,
    campaign,
    getDuplicateCampaignName,
    duplicateCampaign,
    archiveCampaign,
    device,
    pushToModal
}) => {
    const currentPopover = `list-page-more-popover-${campaign.campaignId}`
    const { campaignId } = campaign
    const parseCampaignId = parseInt(campaignId, 10)

    const handleDuplicate = () => {
        const newCampaignName = getDuplicateCampaignName(campaign)
        duplicateCampaign(newCampaignName, parseCampaignId)
        updateActivePopover('')
    }

    const handleArchive = () => {
        archiveCampaign(parseCampaignId)
        updateActivePopover('')
    }

    const pushToSettings = () => {
        pushToModal(campaignId, 'settings')
        updateActivePopover('')
    }
    const getShouldShowSettings = (): boolean => {
        if (isScheduledCampaign(campaign)) {
            if (campaign.scheduledDeliveryStatus !== 'SCHEDULED') {
                return true
            }
        }

        if (isAutomatedNotificationCampaign(campaign)) {
            // TODO: find a field that reliably determines that this campaign has started
            if (campaign.automatedMonday) {
                return true
            }
        }

        return false
    }

    const getSettingsElement = () => (
        <div
            onClick={pushToSettings}
            style={{
                display: 'flex',
                alignItems: 'center',
                height: 55
            }}
            key="settings-icon-list-view-popover"
        >
            <div
                style={{
                    marginRight: 8
                }}
            >
                {GearIcon({
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: steel
                })}
            </div>
            <Text text="Settings" size="medium" />
        </div>
    )

    const getArchiveElement = () => (
        <div
            onClick={handleArchive}
            style={{
                display: 'flex',
                alignItems: 'center',
                height: 56
            }}
            key="archive-icon-list-view-popover"
        >
            <div
                style={{
                    marginRight: 8
                }}
            >
                {ArchiveIcon({
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: steel
                })}
            </div>
            <Text text="Archive" size="medium" />
        </div>
    )
    const getDuplicateElement = () => (
        <div
            onClick={handleDuplicate}
            style={{
                display: 'flex',
                alignItems: 'center',
                height: 55
            }}
            key="duplicate-icon-list-view-popover"
        >
            <div
                style={{
                    marginRight: 8
                }}
            >
                {DuplicateIcon({
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: steel
                })}
            </div>
            <Text text="Duplicate" size="medium" />
        </div>
    )

    const getListElements = () => {
        if (getShouldShowSettings()) {
            return (
                <SelectableList device={device}>
                    {getSettingsElement()}
                    {getDuplicateElement()}
                    {getArchiveElement()}
                </SelectableList>
            )
        }

        return (
            <SelectableList device={device}>
                {getDuplicateElement()}
                {getArchiveElement()}
            </SelectableList>
        )
    }

    return (
        <PopoverContainer
            id="list-page-more-icon"
            popoverProps={{
                placement: 'left'
            }}
            onClick={() =>
                activePopover === currentPopover
                    ? updateActivePopover('')
                    : updateActivePopover(currentPopover)
            }
            targetParent="root"
            showPopover={activePopover === currentPopover}
        >
            <MoreIcon
                fill={charcoal}
                height="20"
                width="20"
                viewBox="0 0 24 24"
                key="list-page-more-icon-1"
            />
            <div
                style={{
                    width: 280
                }}
                key="list-page-more-icon-2"
            >
                {getListElements()}
            </div>
        </PopoverContainer>
    )
}

const mapStateToProps = (state: State): CampaignsListShowMorePopoverProps => ({
    activePopover: getActivePopover(state),
    getDuplicateCampaignName: (campaign: Campaign) =>
        getDuplicateCampaignName(campaign)
})
const mapDispatchToProps = (
    // tslint:disable-next-line:no-any
    dispatch: Dispatch<any>
): CampaignsListShowMorePopoverDispatchProps => {
    return {
        updateActivePopover: (activePopover: string) =>
            dispatch(updateActivePopover(activePopover)),
        duplicateCampaign: (name, campaignId) => {
            dispatch(duplicateListViewCampaign(name, campaignId))
        },
        archiveCampaign: campaignId => {
            dispatch(archiveListViewCampaign(campaignId))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CampaignsListShowMorePopover)
