const Recommend = (props) => { 
    if (!props.show) {
      return null
    }
  
    const books = props.books

    const favorite = props.user.favoriteGenre
  
    return (
      <div>
        <h2>recommendations</h2>

        <p>books in your faovrite genre <b>{favorite}</b></p>
  
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.filter(b => b.genres.indexOf(favorite) > -1).map((b) => (
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default Recommend