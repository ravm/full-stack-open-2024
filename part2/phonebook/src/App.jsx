import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addData = (event) => {
    event.preventDefault();
    if (dataChecker()) {
      return;
    }
    setPersons(persons.concat({name: newName, number: newNumber}));
    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
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
      <h2>Numbers</h2>
      {persons.map(person => 
        <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

export default App
