const typeDefs = `
scalar DateTime

type Account {
    name: String!
    accountname: String!
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Query {
    accounts: [Account]!
}

type Mutation {
    createAccount(name: String!, accountname: String!): Account
}`

export default typeDefs
