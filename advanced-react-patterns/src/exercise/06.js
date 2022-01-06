// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { Switch } from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, { type, initialState }) {
  switch (type) {
    case actionTypes.toggle: {
      return { on: !state.on }
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  // receive onChange and on props to make this component controllable
  onChange,
  on: controlledOn,
} = {}) {
  const { current: initialState } = React.useRef({ on: initialOn })
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // check if controlledOn != null, mean that this component being controlled
  // because we got the on props
  const onIsControlled = controlledOn != null;

  const on = onIsControlled ? controlledOn : state.on;

  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      dispatch(action) // if this component not being controlled, we just need to run dispatch as normal
    }

    // we use reducer(state, action) to get the suggested changes
    // suggested changes refers to the changes we would make if we were managing the state ourselves
    onChange(reducer({ ...state, on }, action), action); // we run the onChange, mean if component is being controlled, we need to run the onChange function from props
  }

  const toggle = () => dispatchWithOnChange({ type: actionTypes.toggle })
  const reset = () => dispatchWithOnChange({ type: actionTypes.reset, initialState })

  function getTogglerProps({ onClick, ...props } = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({ onClick, ...props } = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({ on: controlledOn, onChange }) {
  const { on, getTogglerProps } = useToggle({ on: controlledOn, onChange })
  const props = getTogglerProps({ on })
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        {/* two component below are being controlling by developer */}
        {/* they provider their own on and onChange props */}
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      {/* this uncontrolled toggle meaning developer doesn't need to pass on or onChange props */}
      {/* this uncontrolled component still work as expected */}
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export { Toggle }

/*
eslint
  no-unused-vars: "off",
*/
