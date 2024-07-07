import { useState, useEffect } from 'react'

import dbService from './services/db'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  // Hook for fetching data from server with Axios
  useEffect(() => {
    console.log('Effect hook for fetching data..')
    dbService.getAllPersons()
      .then( persons => setPersons(persons))
      .catch( error => {
        console.log(error.message)
        setMessage('Error obtaining contacts from database')
            setTimeout( () => {
              setMessage(null)
            }, 5000)
      })
  }, [])

  const handleNewOrEditPerson = (e) => {
    e.preventDefault()

    const repeatedPerson = persons.find( person => person.name === newName )
    const repeatedNumber = repeatedPerson?.number === newNumber

    if (repeatedPerson && repeatedNumber) alert(`${repeatedPerson.name} is already added to the phonebook with the same phone number`)
    else if (repeatedPerson && !repeatedNumber) {
      if (window.confirm(`${repeatedPerson.name} already exists in the phonebook, are you sure to replace the phone number?`)) {
        dbService.editPerson(repeatedPerson.id, { ...repeatedPerson, number: newNumber })
          .then( updatedPerson => {
            setPersons(persons.map( person => person.id === updatedPerson.id ? updatedPerson : person ))

            setMessage('Phone number updated succesfully')
            setTimeout( () => {
              setMessage(null)
            }, 5000)
          })
          .catch( error => {
            console.log(error)
            setMessage(`An error ocurred when updating the contact info: ${error.response.data.error}`)
            setTimeout( () => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: persons[persons.length-1].id + 1
      }

      dbService.createPerson(newPerson)
        .then( person => {
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')

          setMessage('New contact succesfully added')
          setTimeout( () => {
            setMessage(null)
          }, 5000)
        })
        .catch( error => {
          console.log(error)
          setMessage(`An error ocurred when adding the new contact: ${error.response.data.error}`)
            setTimeout( () => {
              setMessage(null)
            }, 5000)
        })
    }
  }

  const handleDeletePerson = (personId, personName) => {
    if (window.confirm(`Are you sure to delete the contact ${personName}?`))
      dbService.deletePerson(personId)
        .then( () => setPersons(persons.filter( person => person.id !== personId )))
        .catch( error => {
          console.log(error.message)
          setMessage('An error ocurred when deleting the contact')
            setTimeout( () => {
              setMessage(null)
            }, 5000)
        })
  }

  /*
   * The list of persons is only filtered if the filter input field is not empty
   * Filtering finds persons whose name contains the filter input
   * The toLowerCase() method makes the filtering case-insensitive
   */
  const filteredPersons = filter
    ? persons.filter( person => person.name.toLowerCase().includes(filter.toLowerCase()) )
    : persons
  console.log('Filtered persons: ', filteredPersons)

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} handleNewFilter={(e) => setFilter(e.target.value)} />

      <h2>Add a new contact</h2>
      <PersonForm
        states={{
          newName: newName,
          newNumber: newNumber
        }}
        handlers={{
          handleNewName: (e) => setNewName(e.target.value),
          handleNewNumber: (e) => setNewNumber(e.target.value),
          handleSubmit: handleNewOrEditPerson
        }}
      />
      <Notification message={message} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteHandler={handleDeletePerson} />
    </div>
  )
}

export default App
