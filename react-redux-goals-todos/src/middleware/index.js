import { applyMiddleware } from 'redux'

import checker from './checker'
import logger from './logger'
import thunk from 'redux-thunk'

export default applyMiddleware(
  thunk,
  checker,
  logger
)
