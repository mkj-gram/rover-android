import RoverApis from '@rover/apis'

const getTapBehavior = (n) => {
	switch (n.getTapBehaviorType()) {
		case 0:
			return {
				__typename: 'OpenURLNotificationTapBehavior',
				url: `rv-inbox://presentExperience?campaignID=${n.getCampaignId()}`
			}
		case 1:
			return {
				__typename: 'OpenAppNotificationTapBehavior'
			}
		case 2:
			return {
				__typename: 'OpenURLNotificationTapBehavior',
				url: n.getTapBehaviorUrl()
			}
		case 3:
			// IN_BROWSER
			if (n.getTapBehaviorPresentationType() == 2) {
				return {
					__typename: 'OpenURLNotificationTapBehavior',
					url: n.getTapBehaviorUrl()
				}
			} else {
				return {
					__typename: 'PresentWebsiteNotificationTapBehavior',
					url: n.getTapBehaviorUrl()
				}
			}
		default:
			return {
				__typename: 'OpenAppNotificationTapBehavior'
			}
	}
}

export default n => ({
	id: n.getId(),
	campaignID: n.getCampaignId().toString(),
	title: n.getTitle(),
	body: n.getBody(),
	attachment: (() => {
		const attachment = {}
		switch (n.getAttachmentType()) {
			case 0:
				return null
			case 1:
				attachment.type = 'image'
				break
			case 2:
				attachment.type = 'audio'
				break
			case 3:
				attachment.type = 'video'
				break
		}

		attachment.url = n.getAttachmentUrl()
		return attachment
	})(),
	tapBehavior: getTapBehavior(n),
	deliveredAt: RoverApis.Helpers.timestampFromProto(n.getCreatedAt()),
	expiresAt: null,
	isRead: n.getIsRead(),
	isNotificationCenterEnabled: n.getIsNotificationCenterEnabled(),
	isDeleted: n.getIsDeleted()
})
