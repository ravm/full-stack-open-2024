import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const FilterNames = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addData }) => {
  return (
    <form onSubmit={addData}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button onClick={addData} type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, filter, deletePerson }) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) || filter === '')
      .map(person => <p key={person.id}>{person.name} {person.number} <button key={person.id}
      onClick={() => deletePerson(person)}>delete</button></p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(`Error fetching persons: ${error}`)
      })
  }, [])

  const addData = (event) => {
    event.preventDefault();
    const nameExists = persons.find(person => person.name === newName);
    const numberExists = persons.find(person => person.number === newNumber);

    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const existingPerson = persons.find(person => person.name === newName);
        const updatedPerson = {...existingPerson, number: newNumber};

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            setMessage(`Updated ${updatedPerson.name}`)
            setMessageType('success')
            setTimeout(() => {
              setMessage(null)
              setMessageType(null)
            }, 2500)
          })
          .catch(error => {
            console.log(`Error updating person: ${error}`)
            setMessage(`Information of ${existingPerson.name} has already been removed from the server`)
            setMessageType('error')
            setTimeout(() => {
              setMessage(null)
              setMessageType(null)
            }, 2500)
          })

        return;
      } else {
        return;
      }
      
    } else if (numberExists) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('');
        setNewNumber('');
        setMessage(`Added ${personObject.name}`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 2500)
      })
      .catch(error => {
        console.log(`Error creating person: ${error}`)
        setMessage(`Error creating ${personObject.name}`)
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 2500)
      })
  }

  const deletePerson = person  => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setMessage(`${person.name} successfully deleted!`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 2500)
      })
      .catch(error => {
        console.log(`Error deleting person: ${error}`)
        setMessage(`Error deleting ${person.name}`)
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 2500)
      })
    } 
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
    return (
      <div className={type}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      
      <FilterNames filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addData={addData}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )
}

export default App
