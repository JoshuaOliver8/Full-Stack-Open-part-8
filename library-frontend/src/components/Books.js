import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('all')

  if (!props.show) {
    return null
  }

  const books = props.books

  return (
    <div>
      <h2>books</h2>

      {genre !== 'all' && <p>in genre <b>{genre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genre !== 'all' && 
            books.filter(b => b.genres.indexOf(genre) > -1).map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
          ))}
          {genre === 'all' && 
            books.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
          ))}
        </tbody>
      </table>

      <div>
          <button onClick={() => setGenre('refactoring')}>refactoring</button>
          <button onClick={() => setGenre('agile')}>agile</button>
          <button onClick={() => setGenre('patterns')}>patterns</button>
          <button onClick={() => setGenre('design')}>design</button>
          <button onClick={() => setGenre('crime')}>crime</button>
          <button onClick={() => setGenre('classic')}>classic</button>
          <button onClick={() => setGenre('all')}>all genres</button>
        </div>
    </div>
  )
}

export default Books
