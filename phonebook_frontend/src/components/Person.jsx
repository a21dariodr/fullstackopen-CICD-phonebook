const Person = ({ person, deleteHandler }) => <p>{person.name} {person.number} <button onClick={() => deleteHandler(person.id, person.name)} type="button">Delete</button></p>

export default Person
