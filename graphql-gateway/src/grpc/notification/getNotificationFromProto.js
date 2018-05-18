import RoverApis from '@rover/apis'

const getAction = (n) => {
	switch (n.getTapBehaviorType()) {
		case 0:
			return {
				__typename: 'PresentExperienceAction',
				campaignID: n.getCampaignId()
			}
		case 1:
			return null
		case 2:
			return {
				__typename: 'OpenURLAction',
				url: n.getTapBehaviorUrl()
			}
		case 3:
			// IN_BROWSER
			if (n.getTapBehaviorPresentationType() == 2) {
				return {
					__typename: 'OpenURLAction',
					url: n.getTapBehaviorUrl()
				}
			} else {
				return {
					__typename: 'PresentWebsiteAction',
					url: n.getTapBehaviorUrl()
				}
			}
		default:
			return null	
	}
}

export default n => ({
	id: n.getId(),
	campaignID: n.getCampaignId(),
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
	action: getAction(n),
	deliveredAt: RoverApis.Helpers.timestampFromProto(n.getCreatedAt()),
	expiresAt: null,
	isRead: n.getIsRead(),
	isNotificationCenterEnabled: n.getIsNotificationCenterEnabled(),
	isDeleted: n.getIsDeleted()
})
