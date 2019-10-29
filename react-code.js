function List ( props ) {
  return (
    <ul>
      <li>List</li>
    </ul>
  )
}

class Todos extends React.Component {
  render() {
    return (
      <div>
        TODOS

      <List/>
      </div>
    )
  }
}

class Goals extends React.Component {
  render() {
    return (
      <div>
        TODOS

        <List/>
      </div>
    )
  }
}

class App extends React.Component {
  render () {
    return (
      <div>
        <Todos />
        <Goals />
      </div>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)

// function List (props) {
//   let {type, children} = props
//   console.log('children', children)
//   return (
//     <div>
//       <h1>{type}</h1>
//       <ul>
//         {children.map((child, i) => {
//           return <li id={child.props.item + i}>{child}</li>
//         })}
//       </ul>
//     </div>
//   )
// }
//
// function Todo (props) {
//   return (
//     <div>{props.item}</div>
//   )
// }
//
// function Goal (props) {
//   return (
//     <div>Goal Item</div>
//   )
// }

// class App extends React.Component {
//   render () {
//     return (
//       <div>
//         <List type='Todos'>
//           <Todo item='haul ass' />
//           <Todo item='get paid' />
//         </List>
//       </div>
//     )
//   }
// }
