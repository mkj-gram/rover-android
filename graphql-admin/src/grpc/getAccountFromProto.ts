import { Helpers } from '@rover/apis'

export default (account: any) => ({
    name: account.getName(),
    id: account.getId(),
    createdAt: Helpers.timestampFromProto(account.getCreatedAt()),
    updatedAt: Helpers.timestampFromProto(account.getCreatedAt())
})
