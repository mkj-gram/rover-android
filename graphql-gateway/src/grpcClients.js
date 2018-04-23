import promisify from '@rover-common/grpc-promisify'

import Audience from '@rover/audience-client'
import Auth from '@rover/auth-client'
import Campaigns from './grpc/clients/campaigns'
import Notification from './grpc/clients/notification'

export const audienceClient = Audience.v1.Client()

export const authClient = Auth.v1.Client()

export const campaignsClient = Campaigns.v1.Client()

export const notificationClient = Notification.v1.Client()
