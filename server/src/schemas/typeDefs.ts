const typeDefs = `
type Book {
    _id: ID!
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
    user: User
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
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookData!): User
    removeBook(bookId: ID!): User
}
`;

export default typeDefs;