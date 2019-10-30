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

    return API.saveTodo(this.input.value)
      .then((todo) => {
        this.store.dispatch(addTodoAction(todo))
        this.input.value = ''
      })
      .catch(() => alert('There was an error saving your todo'))
  }

  removeTodo = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id))

    return API.deleteTodo(todo.id)
      .catch(() => {
        this.props.store.dispatch(addTodoAction(todo))
        alert('There was an error removing your todo')
    })
  }

  toggleTodo = (todo) => {
    this.props.store.dispatch(toggleTodoAction(todo.id))
    return API.saveTodoToggle(todo.id)
      .catch(() => {
        this.props.store.dispatch(toggleTodoAction(todo.id))
        alert('there was an error toggling your todo status')
      })
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

    return API.saveGoal(this.input.vale)
      .then((goal) => {
        this.props.store.dispatch(addGoalAction(goal))
        this.input.value = ''
      })
      .catch(() => {
        alert('There was an error adding your goal')
      })
  }

  removeGoal = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id))

    return API.deleteGoal(goal)
      .catch(() => {
        this.store.dispatch(addGoalAction(goal))
        alert('There was an error deleting your goal')
    })
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

    Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]).then(([ todos, goals ]) => {
      store.dispatch(receiveDataAction(todos, goals))
    })

    // generally antipattern to use forceUpdate over setState to cause re-render,
    // but makes more sense in this case
    store.subscribe(() => this.forceUpdate())
  }

  render () {
    const { store } = this.props
    const { todos, goals, loading } = store.getState()

    if (loading) {
      return <Loading />
    }

    return (
      <div>
        <Todos store={store} todos={todos} />
        <Goals store={store} goals={goals} />
      </div>
    )
  }
}

ReactDOM.render(
  <App store={store}/>,
  document.getElementById('app')
)
