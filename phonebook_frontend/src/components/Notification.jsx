const Notification = ({ message }) => {
    const styles = {
        borderRadius: 5,
        backgroundColor: 'red',
        border: '1px solid green',
        color: 'green',
        marginTop: 2
    }

    if (message === null) return null

    return (
      <div style={styles}>
        {message}
      </div>
    )
}

export default Notification