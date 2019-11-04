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

export default checker
