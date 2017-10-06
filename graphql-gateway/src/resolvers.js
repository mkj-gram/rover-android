export const requireAuthentication = callback => (data, args, context) => {
    const { authContext } = context
    if (authContext === null || authContext === undefined) {
        throw new Error('Unauthorized')
    }
    return callback(data, args, context)
}

export const requireScope = (scope, callback) => requireAuthentication((data, args, context) => {
    const { authContext } = context
    const scopes = authContext.getPermissionScopesList()
    if (!scopes.includes(scope)) {
        throw new Error('Forbidden')
    }
    return callback(data, args, context)
})
