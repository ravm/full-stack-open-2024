import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addData = (event) => {
    event.preventDefault();
    if (dataChecker()) {
      return;
    }
    setPersons(persons.concat({name: newName, number: newNumber, id: persons.length + 1}));
    setNewName('');
    setNewNumber('');
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
  
  const FilterNames = ({ filter, handleFilterChange }) => {
    return (
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
    )
  }

  const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addData }) => {
    return (
      <form>
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

  const Persons = ({ persons }) => {
    return (
      <div>
        {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) || filter === '')
        .map(person => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
    )
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
      <Persons persons={persons}/>
    </div>
  )
}

export default App
