const requireScope = (scope, callback) => (data, args, context) => {
    const { authContext } = context
    if (authContext === null || authContext === undefined) {
        throw new Error('Requires authentication')
    }

    const scopes = authContext.toObject().permissionScopesList
    if (!scopes.includes(scope)) {
        throw new Error('Missing required scope \'' + scope + '\'')
    }

    return callback(data, args, context)
}

export default requireScope
