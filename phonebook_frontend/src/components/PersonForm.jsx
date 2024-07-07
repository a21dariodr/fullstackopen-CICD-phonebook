const PersonForm = ({ states, handlers }) =>
  <form onSubmit={handlers.handleSubmit}>
    <div>
      name: <input value={states.newName} onChange={handlers.handleNewName} />
    </div>
    <div>
      number: <input type='tel' value={states.newNumber} onChange={handlers.handleNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonForm