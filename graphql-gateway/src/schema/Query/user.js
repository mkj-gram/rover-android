import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { authClient } from '../../grpcClients'
promisify(authClient)
import User from '../User'

const user = {
    type: User,
    args: {},
    resolve: async (_, {}, { authContext }) => {
        const accountId = authContext.getAccountId()
        const userId = authContext.getUserId()

        const userRequest = new RoverApis.auth.v1.Models.GetUserRequest()
        userRequest.setAccountId(accountId)
        userRequest.setUserId(userId)

        const userResponse = await authClient.getUser(userRequest)
        const userName = userResponse.getName()
        const userEmail = userResponse.getEmail()

        return {
            accountId: userResponse.getAccountId(),
            name: userName,
            email: userEmail
        }
    }
}

export default user
