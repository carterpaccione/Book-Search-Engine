const typeDefs = `
type Book {
    bookId: ID!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type User {
    _id: ID!
    username: String
    email: String
    password: String
    savedBooks: [Book]
    bookCount: Int
}

type Auth {
    token: ID!
    user: User!
}

input NewUserInput {
    username: String!
    email: String!
    password: String!
}

input UserInput {
    email: String!
    password: String!
}

input BookData {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Query {
    me: User
}

type Mutation {
    login(input: UserInput): Auth
    addUser(input: NewUserInput): Auth
    saveBook(input: BookData!): User
    removeBook(bookId: ID!): User
}
`;

export default typeDefs;