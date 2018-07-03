import * as RoverApis from '@rover/apis'
import getAccountFromProto from '../../grpc/getAccountFromProto'
import * as promisify from '@rover-common/grpc-promisify'
import { authClient } from '../grpcClients'
promisify(authClient)

const accounts = async () => {
    const request = new RoverApis.auth.v1.Models.ListAccountsRequest()
    const response = await authClient.listAccounts(request)
    // tslint:disable-next-line:no-any
    return response.getAccountsList().map((account: any) => {
        return getAccountFromProto(account)
    })
}

export default accounts
