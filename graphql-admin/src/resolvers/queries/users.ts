import * as promisify from '@rover-common/grpc-promisify'
import * as RoverApis from '@rover/apis'
import getUserFromProto from '../../grpc/getUserFromProto'
import { authClient } from '../grpcClients'
promisify(authClient)

const users = async (_: any, { accountId }: any) => {
    const request = new RoverApis.auth.v1.Models.ListUsersRequest()
    request.setAccountId(accountId)
    const response = await authClient.listUsers(request)
    // tslint:disable-next-line:no-any
    return response.getUsersList().map((user: any) => {
        return getUserFromProto(user)
    })
}

export default users
