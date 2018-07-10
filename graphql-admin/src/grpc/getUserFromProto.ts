import { Helpers } from '@rover/apis'

// tslint:disable-next-line:no-any
export default (user: any) => ({
    id: user.getId(),
    accountId: user.getAccountId(),
    name: user.getName(),
    email: user.getEmail(),
    permissionScopes: user.getPermissionScopesList(),
    createdAt: Helpers.timestampFromProto(user.getCreatedAt()),
    updatedAt: Helpers.timestampFromProto(user.getUpdatedAt())
})
