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
    const { dispatch } = this.props
    dispatch(handleRecieveData())
  }

  render () {
    const { loading } = this.props

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

// *****************************************************************************
// connect react to redux store in efficient way
const Context = React.createContext()
// // used to provide the store via react Context.  Wrap top-level of app to make available
// class Provider extends React.Component {
//   render () {
//     return (
//       <Context.Provider value={this.props.store}>
//         {this.props.children}
//       </Context.Provider>
//     )
//   }
// }

// *****************************************************************************
// Handrolled connect function
// Goal -- Render any component, passing that component any data it needs from the store

// connect will be a function that's argument is a function that returns an object
// containing the necessary data from the state for a component (plus dispatch by default)

// conect will return a function that will take in the component that will be 'connected'
// the connected component will be given the required pieces from state and dispatch as props

// the returned component from connect must also be able to update the UI based on changing state
// and stop watching when unmounted

// example const ConnectedApp = connect((state) => ({
//   loading: state.loading
// }))(App)

// function connect (mapStateToProps) {
//   return (Component) => {
//     class Receiver extends React.Component {
//       componentDidMount () {
//         const { subscribe } = this.props.store
//
//         this.unsubscribe = subscribe(() => this.forceUpdate())
//       }
//
//       componentWillUnmount () {
//         this.unsubscribe()
//       }
//
//       render () {
//         const { dispatch, getState } = this.props.store
//         const state = getState()
//         const stateNeeded = mapStateToProps(state)
//         return <Component {...stateNeeded} dispatch={dispatch} />
//       }
//     }
//
//     class ConnectedComponent extends React.Component {
//       render () {
//         return (
//           <Context.Consumer>
//             {(store) => <Receiver store={store}/> }
//           </Context.Consumer>
//         )
//       }
//     }
//
//     return ConnectedComponent
//   }
// }

const ConnectedApp = ReactRedux.connect((state) => ({
    loading: state.loading
}))(App)

const ConnectedTodos = ReactRedux.connect((state) => ({
  todos: state.todos
}))(Todos)

const ConnectedGoals = ReactRedux.connect((state) => ({
  goals: state.goals
}))(Goals)



ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ConnectedApp />
  </ReactRedux.Provider>,
  document.getElementById('app')
)
