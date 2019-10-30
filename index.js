
//**********************
// App code
//**********************

// Constants
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL ='REMOVE_GOAL'
const RECEIVE_DATA = 'RECEIVE_DATA'

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

function receiveDataAction (todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  }
}

/*
based off functional programming technique 'currying'
Redux.applyMiddleware is looking for one or more arguments built in the pattern below,
with the initial fn taking in store, returning a fn that takes in next, and returns
a fn that takes in the action and holds the actual logic of the middleware.
These middleware fns need to be composed like this in order for applyMiddleware to chain
them together.
Once the last iteration (args + 1) finds an empty next, the store will be passed
and dispatch will be called
Redux has got some push back, but changing applyMiddleware will be a
big breaking, so just follow the pattern *shrug*
note -- middleware fn's like below are passed as second arg in Redux.CreateStore via Redux.applyMiddleware
*/
const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert('not now, maybe later..')
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert('not now, maybe later..')
  }

  return next(action)
}

const logger = (store) => (next) => (action) => {
  console.group(action.type)
    console.log(`Current Action --`, action)
    const res = next(action)
    console.log(`Current State after action -- `, store.getState())
  console.groupEnd()
  return res
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
    case RECEIVE_DATA:
      return action.todos
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
    case RECEIVE_DATA:
      return action.goals
    default:
      return state
  }
}

function loading (state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}

const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals,
  loading
}), Redux.applyMiddleware(checker, logger))

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


