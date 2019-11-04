import { combineReducers } from 'redux'

import todos from './todos-reducer'
import goals from './goals-reducer'
import loading from './loading-reducer'

export default combineReducers({
  todos,
  goals,
  loading
})
