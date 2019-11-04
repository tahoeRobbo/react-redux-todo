import { ADD_GOAL, REMOVE_GOAL, RECEIVE_DATA } from '../constants'

// reducer fn for 'goals' portion of state
export default function goals (state = [], action) {
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
