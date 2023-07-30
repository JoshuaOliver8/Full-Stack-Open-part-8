import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author {
            name
            born
        }
        genres
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name
                born
            }
            published
            genres
        }
    }
`

export const NEW_BOOK = gql`
    mutation newBook($title: String!, $published: Int!, $author: String!,
        $genres: [String!]!) {
         addBook(
            title: $title,
            published: $published,
            author: $author,
            genres: $genres
         ) {
            title
            author {
                name
            }
            published
            genres
         }
    }
`

export const EDIT_BORN = gql`
    mutation editAuthor($name: String!, $born: Int!) {
        editAuthor(name: $name, born: $born) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const USER = gql`
    query {
        me {
            username
            favoriteGenre
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`
