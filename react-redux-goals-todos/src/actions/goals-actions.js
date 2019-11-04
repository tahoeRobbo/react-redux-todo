import { ADD_GOAL, REMOVE_GOAL } from '../constants'
import API from 'goals-todos-api'

function addGoal (goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}
function removeGoal (id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}

export function handleAddGoal(name, cb) {
  return (dispatch) => {
    return API.saveGoal(name)
    .then((goal) => {
      dispatch(addGoal(goal))
      cb()
    })
    .catch(() => {
      alert('There was an error adding your goal')
    })
  }
}

export function handleRemoveGoal(goal) {
  return (dispatch) => {
    dispatch(removeGoal(goal.id))

    return API.deleteGoal(goal)
    .catch(() => {
      dispatch(addGoal(goal))
      alert('There was an error deleting your goal')
    })
  }
}
