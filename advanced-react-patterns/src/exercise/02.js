// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle({ children }) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // 🐨 replace this with a call to React.Children.map and map each child in
  // props.children to a clone of that child with the props they need using
  // React.cloneElement.
  // 💰 React.Children.map(props.children, child => {/* return child clone here */})
  // 📜 https://reactjs.org/docs/react-api.html#reactchildren
  // 📜 https://reactjs.org/docs/react-api.html#cloneelement
  return React.Children.map(children, child => {
    // we need to use React.cloneElement here because we need to pass { on, toggle } as props to child components
    // but React doesn't allow to update the props directly, so we need to clone the components and pass props

    // So if we added this, the props on pass to the React Component child
    // so if we have a DOM element like span below, we not gonna get the error because this not send props to DOM element
    if (typeof child.type === "string") { // this check is, if child component is DOM element, we just return the child and not pass props
      return child;
    }

    // or if we need to only support the set of elemnents, we can have the check like this
    // const supportedElement  = [ToggleOn, ToggleOff, ToggleButton];
    // if (supportedElement.includes(child.type)) {
    //   const cloneChild = React.cloneElement(child, {
    //     on, toggle
    //   })
    //   return cloneChild
    // }
    // return child;

    const cloneChild = React.cloneElement(child, {
      on, toggle
    })
    return cloneChild
  })
}

// 🐨 Flesh out each of these components

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({ on, children }) => on ? children : null

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({ on, children }) => on ? null : children

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = ({ on, toggle }) => <Switch on={on} onClick={toggle} />

// we added a span below to test if our components support DOM element
function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Button here</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
