/// <reference path="../../typings/index.d.ts"/>

import * as campaignsActions from './campaigns'
import * as testDevicesActions from './testDevices'
import * as modalActions from './modal'
import * as H from 'history'

import { Action, Dispatch } from 'redux'

export const handleSendTestModalDisplay = (on?: boolean) =>
    modalActions.handleSendTestModalDisplay(on)

export const handleOverviewModalDisplay = (history: H.History) =>
    modalActions.handleOverviewModalDisplay(history)

export const fetchTestDevices = (
    predicates?: string,
    pageNumber?: number,
    pageSize?: number,
    condition?: string
) =>
    testDevicesActions.fetchTestDevices(
        predicates,
        pageNumber,
        pageSize,
        condition
    )

export const fetchCampaigns = (
    campaignStatus?: CampaignStatus,
    campaignType?: CampaignType,
    pageNumber?: number,
    keyword?: string
) =>
    campaignsActions.fetchCampaigns(
        campaignStatus,
        campaignType,
        pageNumber,
        keyword
    )

export const createCampaign = (name: string, campaignType: CampaignType) =>
    campaignsActions.createCampaign(name, campaignType)

export const renameCampaign = (name: string, campaignId: number) =>
    campaignsActions.renameCampaign(name, campaignId)

export const duplicateCampaign = (name: string, campaignId: number) =>
    campaignsActions.duplicateCampaign(name, campaignId)

export const archiveCampaign = (campaignId: number) =>
    campaignsActions.archiveCampaign(campaignId)
