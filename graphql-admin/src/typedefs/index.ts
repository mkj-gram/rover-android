const typeDefs = `
scalar DateTime

type Account {
    name: String!
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Query {
    listAccounts: [Account]!
}

type Mutation {
    createAccount(name: String!): Account
}`

export default typeDefs
