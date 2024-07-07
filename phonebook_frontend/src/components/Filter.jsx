const Filter = ({ filter, handleNewFilter }) =>
  <p>
    filter shown with <input value={filter} onChange={handleNewFilter} />
  </p>

export default Filter