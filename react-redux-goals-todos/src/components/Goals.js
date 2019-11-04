import React from 'react'
import { connect } from 'react-redux'
import List from './List'
import {
  handleAddGoal,
  handleRemoveGoal
} from '../actions/goals-actions'

class Goals extends React.Component {
  addGoal = (e) => {
    e.preventDefault()
    this.props.dispatch(handleAddGoal(
      this.input.value,
      () => this.input.value = ''
    ))
  }

  removeGoal = (goal) => {
    this.props.dispatch(handleRemoveGoal(goal))
  }

  render() {
    return (
      <div>
        <h1>Goals</h1>
        {/*uncontrolled input*/}
        <input
          type='text'
          placeholder='Add Goal'
          ref={(input) => this.input = input}
        />
        <button onClick={this.addGoal}>Add Goal</button>
        <List
          items={this.props.goals}
          remove={this.removeGoal}
        />
      </div>
    )
  }
}

export default connect((state) => ({
  goals: state.goals
}))(Goals)
