import RoverApis from '@rover/apis'

const getActionInfo = (n) => {
	switch (n.getNotificationTapBehaviorType()) {
		case 0:
			return {
				name: 'presentExperience',
				attributes: {
					campaignID: n.getCampaignId()
				}
			}
		case 1:
			return {
				name: 'openApp'
			}
		case 2:
			return {
				name: 'openURL',
				attributes: {
					url: n.getNotificationTapBehaviorUrl()
				}
			}
		case 3:
			// IN_BROWSER
			if (n.getNotificationTapBehaviorPresentationType() == 2) {
				return {
					name: 'openURL',
					attributes: {
						url: n.getNotificationAttachmentUrl()
					}
				}
			} else {
				return {
					name: 'presentWebsite',
					attributes: {
						url: n.getNotificationAttachmentUrl()
					}
				}
			}
		default:
			return undefined	
	}
}

export default n => ({
	id: n.getId(),
	campaignID: n.getCampaignId(),
	title: n.getTitle(),
	body: n.getBody(),
	attachment: (() => {
		const attachment = {}
		switch (n.getNotificationAttachmentType()) {
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

		attachment.url = n.getNotificationAttachmentUrl()
		return attachment
	})(),
	actionInfo: getActionInfo(n),
	deliveredAt: RoverApis.Helpers.timestampFromProto(n.getCreatedAt()),
	expiresAt: null,
	isRead: n.getIsRead(),
	isNotificationCenterEnabled: n.getIsNotificationCenterEnabled(),
	isDeleted: n.getIsDeleted()
})