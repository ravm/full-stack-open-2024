const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts} />
    </div>
  )
}

const Header = ({ name }) => {
  return (
    <h1>{name}</h1>
  )
}

const Content = ({ parts }) => {
  const sum = parts.reduce((total, part) => total + part.exercises, 0);
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <p>total of {sum} exercises</p>
    </div>
  )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
