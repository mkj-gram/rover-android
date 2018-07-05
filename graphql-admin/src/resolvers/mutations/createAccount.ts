import * as promisify from '@rover-common/grpc-promisify'
import * as RoverApis from '@rover/apis'
import getAccountFromProto from '../../grpc/getAccountFromProto'
import { authClient } from '../grpcClients'
promisify(authClient)

// tslint:disable-next-line:no-any
const createAccount = async (_: any, { name, accountname }: any) => {
    const request = new RoverApis.auth.v1.Models.CreateAccountRequest()
    request.setName(name)
    request.setAccountName(accountname)
    const response = await authClient.createAccount(request)
    return getAccountFromProto(response)
}

export default createAccount
