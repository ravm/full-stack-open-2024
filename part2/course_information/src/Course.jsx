const Courses = ({ courses }) => {
    return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(course => (
          <div key={course.id}>
            <Header name={course.name} />
            <Content parts={course.parts} />
          </div>
        ))}
      </div>
    )
}

const Header = ({ name }) => {
    return (
      <h2>{name}</h2>
    )
}
  
const Content = ({ parts }) => {
    const sum = parts.reduce((total, part) => total + part.exercises, 0);
    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} part={part} />
        ))}
        <strong>total of {sum} exercises</strong>
      </div>
    )
}
  
const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>

export default Courses;
