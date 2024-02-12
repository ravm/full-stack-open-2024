import { useState, useEffect } from 'react'
import personService from './services/persons'

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
      .map(person => <p key={person.id}>{person.name} {person.number} <button key={person.id} onClick={() => deletePerson(person)}>delete</button></p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addData = (event) => {
    event.preventDefault();
    if (dataChecker()) {
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
      })
  }

  const deletePerson = person  => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== person.id))
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

  const dataChecker = () => {
    const nameExists = persons.find(person => person.name === newName);
    const numberExists = persons.find(person => person.number === newNumber);
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
      return true
    } else if (numberExists) {
      alert(`${newNumber} is already added to phonebook`);
      return true
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
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
