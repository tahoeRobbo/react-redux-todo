function List ( props ) {
  const items = props.items
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => props.toggle && props.toggle(item)}
            style={{textDecoration: item.complete ? 'line-through' : 'none'}}
          >
              {item.name}
          </span>
          <button onClick={() => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}

class Todos extends React.Component {
  addTodo = (e) => {
    e.preventDefault()
    this.props.dispatch(handleAddTodo(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeTodo = (todo) => {
    this.props.dispatch(handleRemoveTodo(todo))
  }

  toggleTodo = (todo) => {
    this.props.dispatch(handleToggleTodo(todo.id))
  }

  render() {
    return (
      <div>
        <h1>Todos</h1>
        {/*uncontrolled input*/}
        <input
          type='text'
          placeholder='Add Todo'
          ref={(input) => this.input = input}
        />
        <button onClick={this.addTodo}>Add Todo</button>
      <List
        items={this.props.todos}
        remove={this.removeTodo}
        toggle={this.toggleTodo}
      />
      </div>
    )
  }
}

class Goals extends React.Component {
  addGoal = (e) => {
    e.preventDefault()
    this.props.dispatch(handleAddGoal(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeGoal = (goal) => {
    this.props.dispatch(handleRemoveGoal(goal))
  }

  render() {
    return (
      <div>
        <h1>Goals</h1>
        {/*uncontrolled input*/}
        <input
          type='text'
          placeholder='Add Goal'
          ref={(input) => this.input = input}
        />
        <button onClick={this.addGoal}>Add Goal</button>
        <List
          items={this.props.goals}
          remove={this.removeGoal}
        />
      </div>
    )
  }
}

function Loading () {
  return (
    <h2>Loading...</h2>
  )
}

class App extends React.Component {
  componentDidMount () {
    const { store } = this.props

    store.dispatch(handleRecieveData())

    // generally antipattern to use forceUpdate over setState to cause re-render,
    // but makes more sense in this case
    store.subscribe(() => this.forceUpdate())
  }

  render () {
    const { loading } = this.props.store.getState()

    if (loading) {
      return <Loading />
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    )
  }
}

const Context = React.createContext()

class Provider extends React.Component {
  render () {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

class ConnectedApp extends React.Component {
  render () {
    return (
      <Context.Consumer>
        {(store) => (
          <App store={store} />
        )}
      </Context.Consumer>
    )
  }
}

class ConnectedTodos extends React.Component {
  render () {
    return (
      <Context.Consumer>
        {(store) => {
          const { todos } = store.getState()
          return <Todos todos={todos} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
    )
  }
}

class ConnectedGoals extends React.Component {
  render () {
    return (
      <Context.Consumer>
        {(store) => {
          const { goals } = store.getState()
          return <Goals goals={goals} dispatch={store.dispatch} />
        }}
      </Context.Consumer>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('app')
)
