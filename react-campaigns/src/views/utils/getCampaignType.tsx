export const isScheduledCampaign = (
    campaign: Campaign
): campaign is ScheduledCampaign => {
    return (campaign as ScheduledCampaign).scheduledDeliveryStatus !== undefined
}

export const isAutomatedNotificationCampaign = (
    campaign: Campaign
): campaign is AutomatedNotificationCampaign => {
    return (
        (campaign as AutomatedNotificationCampaign).automatedMonday !==
        undefined
    )
}
