// only specified actions are allowed to interact with the store
// helps in the predictability of state
let actions = {
  ADD_TODO: {
    type: 'ADD_TODO',
    todo: {
      id: 0,
      name: 'Learn Redux',
      complete: false
    }
  },
  REMOVE_TODO: {
    type: 'REMOVE_TODO',
    id: 0
  },
  TOGGLE_TODO: {
    type: 'TOGGLE_TODO',
    id: 0
  }
}

// reducer fn
// doesn't mutate state, but if 'ADD_ACTION' is the action.type,
// takes in current state and concats (push mutates) and returns new state
// or just returns current state
function todos (state = [], action) {
  switch(action.type) {
    case 'ADD_TODO':
      return state.concat([action.todo])
    case 'REMOVE_TODO':
      return state.filter((todo) => todo.id !== action.id)
    case 'TOGGLE_TODO':
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, {complete: !todo.complete})
      )
    default:
      return state
  }
}

function createStore (reducer) {
  // four parts
  // 1. the state
  // 2. method to get the state
  // 3 method to setup listeners to changes on state
  // 4 update the state

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

//*************************
// example running this file
//*************************

// create store using todos fn as reducer
// store exposes getState, subscribe, and dispatch methods
let store = createStore(todos)

// setup a listener that will be called after an action is dispatched and to the reducer
let unsubscribe = store.subscribe(() => console.log(`the current stater is ${store.getState()}`))

// dispatch the 'ADD_TODO' action defined at the top of the file
// this triggers the reducer (todos) then loops through the listeners and invokes each of them
store.dispatch(actions.ADD_TODO) // the current state is [{id: 0, name: 'Learn Redux', complete: false}]
store.dispatch(actions.TOGGLE_TODO) // the current state is [{id: 0, name: 'Learn Redux', complete: true}]
store.dispatch(actions.REMOVE_TODO) // the current state is []
// this calls the fn returned from subscribe that filters this specific listener out of the listeners array
unsubscribe()
