import { RECEIVE_DATA } from '../constants'

export default function loading (state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}
