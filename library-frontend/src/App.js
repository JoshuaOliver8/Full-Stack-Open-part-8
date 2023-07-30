import { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import BirthYear from './components/BirthYear'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

import { ALL_AUTHORS, ALL_BOOKS, USER, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('books')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const resultAuthor = useQuery(ALL_AUTHORS)
  const resultBook = useQuery(ALL_BOOKS)
  const resultUser = useQuery(USER)
  const client = useApolloClient()

  useEffect(() => {
    setPage('authors')
  }, [token])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  if (resultAuthor.loading || resultBook.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Notify errorMessage={errorMessage} />
        <Authors show={page === 'authors'} authors={resultAuthor.data.allAuthors} />
        <Books show={page === 'books'} books={resultBook.data.allBooks} />
        <LoginForm show={page === 'login'} setToken={setToken} setError={notify} />

        
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('birthyear')}>set author birthyear</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} authors={resultAuthor.data.allAuthors} />
      <Books show={page === 'books'} books={resultBook.data.allBooks} />
      <NewBook show={page === 'add'} setError={notify} />
      <BirthYear show={page === 'birthyear'} setError={notify} authors={resultAuthor.data.allAuthors} />
      <Recommend show={page === 'recommend'} books={resultBook.data.allBooks} user={resultUser.data.me} />
    </div>
  )
}

export default App
