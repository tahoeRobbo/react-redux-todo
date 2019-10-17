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
})()


// // only specified actions are allowed to interact with the store
// // helps in the predictability of state
// let actions = {
//   ADD_TODO: {
//     type: ADD_TODO,
//     todo: {
//       id: 0,
//       name: 'Learn Redux',
//       complete: false
//     }
//   },
//   REMOVE_TODO: {
//     type: REMOVE_TODO,
//     id: 0
//   },
//   TOGGLE_TODO: {
//     type: TOGGLE_TODO,
//     id: 0
//   }
// }
