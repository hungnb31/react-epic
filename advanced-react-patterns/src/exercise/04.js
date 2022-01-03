// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { Switch } from '../switch'

// this function basically synchronously run all provided function if it is truthy
function callAll(...fns) {
  return (...args) => {
    fns.forEach(fn => fn && fn(...args))
  }
}

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // instead of directly return props like before
  // we now create a function to return props
  // this function allow user to have their own onClick function
  // but still keep the functionality of the switch by still run toggle function
  function getTogglerProps({ onClick, ...props } = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props
    }
  }

  // we return onClick here in order to allow user to toggle the switch
  // we also return "aria-pressed" here to help user doesn't need to care
  return {
    on, getTogglerProps
  }
}

function App() {
  const { on, getTogglerProps } = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({ on })} />
      <hr />
      {/* user now can define their own onClick function to run extra stuffs */}
      <button aria-label="custom-button" {...getTogglerProps({ onClick: () => console.info("Function running...") })}>
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
