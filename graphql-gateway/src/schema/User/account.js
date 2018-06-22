import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { authClient } from '../../grpcClients'
promisify(authClient)
import Account from '../Account'

export default {
    type: Account,
    resolve: async ({ accountId }) => {
        const accountRequest = new RoverApis.auth.v1.Models.GetAccountRequest()
        accountRequest.setAccountId(accountId)

        const accountResponse = await authClient.getAccount(accountRequest)
        return {
            name: accountResponse.getName()
        }
    }
}
