import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_BORN, ALL_AUTHORS } from '../queries'

const BirthYear = (props) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)

    const names = props.authors.map(a => a.name)
    const options = []
    names.forEach((name) => {
        options.push({ label: name, value: name })
    })

    const [ changeYear, result ] = useMutation(EDIT_BORN, {
        update: (cache, response) => {
            cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
              return {
                allAuthors: allAuthors.concat(response.data.editAuthor),
              }
            })
          },
    })

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            props.setError('person not found')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result.data])

    useEffect(() => {
        if (selectedOption) {
            setName(selectedOption.label)
        }
    }, [selectedOption])

    if (!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        changeYear({ variables: { name, born: parseInt(born, 10) } })

        setName('')
        setBorn('')
    }

    return (
        <div>
            <h2>set birthyear</h2>

            <form onSubmit={submit}>
                <div>
                    <Select
                        defaultValue={selectedOption}
                        onChange={setSelectedOption}
                        options={options}
                    />
                </div>
                <div>
                    born <input
                        type='number'
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default BirthYear