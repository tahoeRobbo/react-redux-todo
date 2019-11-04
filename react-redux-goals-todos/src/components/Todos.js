import React from 'react'
import { connect } from 'react-redux'
import List from './List'
import {
  handleAddTodo,
  handleRemoveTodo,
  handleToggleTodo
} from '../actions/todos-actions'

class Todos extends React.Component {
  addTodo = (e) => {
    e.preventDefault()
    this.props.dispatch(handleAddTodo(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeTodo = (todo) => {
    this.props.dispatch(handleRemoveTodo(todo))
  }

  toggleTodo = (todo) => {
    this.props.dispatch(handleToggleTodo(todo.id))
  }

  render() {
    return (
      <div>
        <h1>Todos</h1>
        {/*uncontrolled input*/}
        <input
          type='text'
          placeholder='Add Todo'
          ref={(input) => this.input = input}
        />
        <button onClick={this.addTodo}>Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeTodo}
          toggle={this.toggleTodo}
        />
      </div>
    )
  }
}

export default connect((state) => ({
  todos: state.todos
}))(Todos)
