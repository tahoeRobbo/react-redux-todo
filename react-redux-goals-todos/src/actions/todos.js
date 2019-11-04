import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from '../constants'
import API from 'goals-todos-api'

function addTodo (todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodo (id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodo (id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

export function handleAddTodo(name, cb) {
  return (dispatch) => {
    return API.saveTodo(name)
    .then((todo) => {
      dispatch(addTodo(todo))
      cb()
    })
    .catch(() => alert('There was an error saving your todo'))
  }
}

export function handleRemoveTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodo(todo.id))

    return API.deleteTodo(todo.id)
    .catch(() => {
      dispatch(addTodo(todo))
      alert('There was an error removing your todo')
    })
  }
}

export function handleToggleTodo(id) {
  return (dispatch) => {
    dispatch(toggleTodo(id))

    return API.saveTodoToggle(id)
    .catch(() => {
      dispatch(toggleTodo(id))
      alert('there was an error toggling your todo status')
    })
  }
}
