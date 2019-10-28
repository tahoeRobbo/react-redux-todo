(function(){
  // Library code
  function createStore (reducer) {
    // four parts
    // 1. the state
    // 2. method to get the state (getState)
    // 3 method to setup listeners to changes on state (subscribe)
    // 4 update the state (dispatch)

    let state
    let listeners = []

    const getState = () => state

    // pass a fn that should be invoked when the dispatch fires, after the reducer
    const subscribe = (listener) => {
      listeners.push(listener)

      // return a fn that when called will remove the listener
      // ex let test = store.subscribe(() => console.log('hi')) will add <- fn into listeners
      // calling test() will remove   {^^^^^^^^^^^^^^^^^^^^^^^} from listeners
      return () => {
        listeners = listeners.filter((l) => l !== listener)
      }
    }

    // takes in an action to pass to the reducer
    const dispatch = (action) => {
      // call reducer, set state to return (reducer always returns state)
      state = reducer(state, action)
      // loop over listeners and invoke them
      listeners.forEach((listener) => listener())
    }

    return {
      getState,
      subscribe,
      dispatch
    }
  }
//**********************
// App code
//**********************

// Constants
  const ADD_TODO = 'ADD_TODO'
  const REMOVE_TODO = 'REMOVE_TODO'
  const TOGGLE_TODO = 'TOGGLE_TODO'
  const ADD_GOAL = 'ADD_GOAL'
  const REMOVE_GOAL ='REMOVE_GOAL'

  // action creators
  function addTodoAction (todo) {
    return {
      type: ADD_TODO,
      todo
    }
  }
  function removeTodoAction (id) {
    return {
      type: REMOVE_TODO,
      id
    }
  }
  function toggleTodoAction (id) {
    return {
      type: TOGGLE_TODO,
      id
    }
  }
  function addGoalAction (goal) {
    return {
      type: ADD_GOAL,
      goal
    }
  }
  function removeGoalAction (id) {
    return {
      type: REMOVE_GOAL,
      id
    }
  }

// reducer fns don't mutate state (must be pure fn)
// switch based on the action.type that's passed in and use array methods that don't mutate the original state.
// ex--
// use concat over push / shift / splice to add
// filter over pop / unshift / splice to remove
// map if altering a piece of existing state

// reducer fn for 'todos' portion of stat
  function todos (state = [], action) {
    switch(action.type) {
      case ADD_TODO:
        return state.concat([action.todo])
      case REMOVE_TODO:
        return state.filter((todo) => todo.id !== action.id)
      case TOGGLE_TODO:
        return state.map((todo) => todo.id !== action.id ? todo :
          Object.assign({}, todo, {complete: !todo.complete})
        )
      default:
        return state
    }
  }

  // second reducer fn for 'goals' portion of state
  function goals (state = [], action) {
    switch (action.type) {
      case ADD_GOAL:
        return state.concat([action.goal])
      case REMOVE_GOAL:
        return state.filter((goal) => goal.id !== action.id)
      default:
        return state
    }
  }

  // Root reducer
  // invoking the other reducers will return the proper shape for the state
  // note - all reducers will fire any time a dispatch is called
  function app (state = {}, action) {
    return {
      todos: todos(state.todos, action),
      goals: goals(state.goals, action)
    }
  }

  let store = createStore(app) // pass in root reducer to be added into store.dispatch

  // for the input and goal ids
  function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  }

  // DOM code

  function addGoal () {
    const input = document.getElementById('goal')
    const name = input.value
    input.value = ''

    store.dispatch(addGoalAction({
      id: generateId(),
      name
    }))


  }

  function addTodo () {
    const input = document.getElementById('todo')
    const name = input.value
    input.value = ''

    store.dispatch(addTodoAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  store.subscribe(() => console.log(store.getState()))

  store.subscribe(() => {
    const { todos, goals } = store.getState()

    document.getElementById('goals').innerHTML = ''
    document.getElementById('todos').innerHTML = ''

    todos.forEach((todo) => addTodoToDOM(todo))
    goals.forEach((goal) => addGoalToDOM(goal))
  })

  function addGoalToDOM (goal) {
    const node = document.createElement('li')
    node.addEventListener('dblclick', () => {
      store.dispatch(removeGoalAction(goal.id))
    })

    const text = document.createTextNode(goal.name)
    node.appendChild(text)

    document.getElementById('goals')
      .appendChild(node)
  }

  function addTodoToDOM (todo) {
    const node = document.createElement('li')
    node.style.textDecoration = todo.complete ? 'line-through' : 'none'
    node.addEventListener('click', () => {
      store.dispatch(toggleTodoAction(todo.id))
    })
    node.addEventListener('dblclick', () => {
      store.dispatch(removeTodoAction(todo.id))
    })

    const text = document.createTextNode(todo.name)
    node.appendChild(text)

    document.getElementById('todos')
      .appendChild(node)
  }

  document.getElementById('todo-btn').addEventListener('click', addTodo)
  document.getElementById('goal-btn').addEventListener('click', addGoal)
})()
