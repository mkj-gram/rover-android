/// <reference path="../../typings/index.d.ts"/>

import * as campaignsActions from './campaigns'
import { Action, Dispatch } from 'redux'

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
