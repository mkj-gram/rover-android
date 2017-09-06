import promisify from '@rover-common/grpc-promisify'

import Audience from '@rover/audience-client'
import Auth from '@rover/auth-client'

export const audienceClient = Audience.v1.Client()

export const authClient = Auth.v1.Client()