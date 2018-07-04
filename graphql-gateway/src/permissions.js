import { rule, shield, and, or } from 'graphql-shield'

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
	const { authContext } = ctx
	return authContext !== null && authContext !== undefined
})

const requireScope = (scope) => {
	return rule()(async(parent, args, ctx, info) => {
		const { authContext } = ctx
		if (authContext === null || authContext === undefined) {
			return false
		}
		const scopes = authContext.getPermissionScopesList()
		return scopes.includes(scope)
	})
}

export default shield({
	Query: {
		campaign: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		campaigns: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		device: and(isAuthenticated, requireScope('sdk')),
		dynamicSegment: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		experience: and(isAuthenticated, or(requireScope('admin'), requireScope('sdk'), requireScope('server'))),
		segmentFromPredicates: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		segmentSchema: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		segmentSize: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		stringSuggestion: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		user: and(isAuthenticated, or(requireScope('admin'),requireScope('server')))
	},
	Mutation: {
		archiveCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		archiveSegment: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		createCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		createSegment: and(isAuthenticated, or(requireScope('admin'), requireScope('server'))),
		duplicateCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		publishCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		renameCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		sendTestCampaign: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		trackEvents: and(isAuthenticated, requireScope('sdk')),
		updateDeviceTestLabelProperty: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		updateDynamicSegmentPredicates: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		updateNotificationSettings: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		updateScheduledDeliverySettings: and(isAuthenticated, or(requireScope('admin'),requireScope('server'))),
		updateSegmentName: and(isAuthenticated, or(requireScope('admin'),requireScope('server')))
	}
})