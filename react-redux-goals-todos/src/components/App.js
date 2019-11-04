import React from 'react'
import { connect, Provider } from 'react-redux'
import ConnectedTodos from './Todos'
import ConnectedGoals from './Goals'
import Loading from './Loading'
import { handleReceiveData } from '../actions/shared-actions'

class App extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(handleReceiveData())
  }

  render () {
    const { loading } = this.props

    if (loading) {
      return <Loading />
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    )
  }
}


export default connect((state) => ({
  loading: state.loading
}))(App)
