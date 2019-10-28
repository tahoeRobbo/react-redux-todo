(function(){
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

  const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals
  }))

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
