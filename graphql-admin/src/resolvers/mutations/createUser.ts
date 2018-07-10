import * as promisify from '@rover-common/grpc-promisify'
import * as RoverApis from '@rover/apis'
import getUserFromProto from '../../grpc/getUserFromProto'
import { authClient } from '../grpcClients'
promisify(authClient)

// tslint:disable-next-line:no-any
const createUser = async (
    _: any,
    { accountId, name, email, password }: any
) => {
    const request = new RoverApis.auth.v1.Models.CreateUserRequest()
    request.setAccountId(accountId)
    request.setName(name)
    request.setEmail(email)
    request.setPassword(password)
    const response = await authClient.createUser(request)
    return getUserFromProto(response)
}

export default createUser
