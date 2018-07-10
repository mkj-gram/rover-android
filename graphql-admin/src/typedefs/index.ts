const typeDefs = `
scalar DateTime

type Account {
    name: String!
    accountname: String!
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    users: [User]!
}

type User {
    id: Int!
    accountId: Int!
    name: String!
    email: String!
    permissionScopes: [String]!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Query {
    accounts: [Account]!
    users(accountId: Int!): [User]!
}

type Mutation {
    createAccount(name: String!, accountname: String!): Account
    createUser(accountId: Int!, name: String!, email: String!, password: String!): User
}`

export default typeDefs
