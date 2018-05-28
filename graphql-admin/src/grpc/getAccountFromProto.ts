import { Helpers } from '@rover/apis'

// tslint:disable-next-line:no-any
export default (account: any) => ({
    name: account.getName(),
    id: account.getId(),
    createdAt: Helpers.timestampFromProto(account.getCreatedAt()),
    updatedAt: Helpers.timestampFromProto(account.getUpdatedAt())
})
