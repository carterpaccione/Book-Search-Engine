import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation loginUser($input: UserInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
        email
        bookCount
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($input: NewUserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
        bookCount
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: BookData!) {
    saveBook(input: $input) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
