// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import warning from 'warning'
import { Switch } from 'switch'

const callAll =
  (...fns) =>
    (...args) =>
      fns.forEach(fn => fn?.(...args))

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

function useControlledSwitchWarning(
  controlPropValue,
  controlPropName,
  componentName,
) {
  // save the ref of current component to know if component change between controlled and uncontrolled
  const isControlled = controlPropValue != null
  const { current: wasControlled } = React.useRef(isControlled)

  React.useEffect(() => {
    // if component is controlled but it was not being controlled before
    warning(
      !(isControlled && !wasControlled),
      `${componentName} is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vise versa). Decide between using a controlled or uncontrolled ${componentName} for the lifetime of the component. Check the ${controlPropName} prop.`,
    )

    // if component is uncontrolled but it was not being controlled before
    warning(
      !(!isControlled && wasControlled),
      `${componentName} is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vise versa). Decide between using a controlled or uncontrolled ${componentName} for the lifetime of the component. Check the ${controlPropName} prop.`,
    )
  }, [isControlled, wasControlled, componentName, controlPropName])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  // receive onChange and on props to make this component controllable
  onChange,
  on: controlledOn,
  // if component got readOnly prop, we allow developer provide on prop without onChange prop
  readOnly = false,
} = {}) {
  const { current: initialState } = React.useRef({ on: initialOn })
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // check if controlledOn != null, mean that this component being controlled
  // because we got the on props
  const onIsControlled = controlledOn != null

  const on = onIsControlled ? controlledOn : state.on

  // added this to not throw warning on production
  if (process.env.NODE_ENV !== 'production') {
    // check if this component reveived onChange prop or not
    const hasOnChange = Boolean(onChange)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      // if component got the on prop, but didn't got the onChange or readOnly prop
      warning(
        !(!hasOnChange && onIsControlled && !readOnly),
        `An 'on' prop was provided to useToggle without an 'onChange' handler. This will render a read-only toggle. If you want it to be mutable, use 'initialOn'. Otherwise, set either 'onChange' or 'readOnly'`,
      )
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning(controlledOn, 'on', 'useToggle')
  }

  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      dispatch(action) // if this component not being controlled, we just need to run dispatch as normal
    }

    // we use reducer(state, action) to get the suggested changes
    // suggested changes refers to the changes we would make if we were managing the state ourselves
    // when developer pass a readOnly prop, there is a case that onIsControlled but we don't have the onChange function, so we need to add a `?.` to the onChange
    onChange?.(reducer({ ...state, on }, action), action) // we run the onChange, mean if component is being controlled, we need to run the onChange function from props
  }

  const toggle = () => dispatchWithOnChange({ type: actionTypes.toggle })
  const reset = () =>
    dispatchWithOnChange({ type: actionTypes.reset, initialState })

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

function Toggle({ on: controlledOn, onChange, readOnly }) {
  const { on, getTogglerProps } = useToggle({
    on: controlledOn,
    onChange,
    readOnly,
  })
  const props = getTogglerProps({ on })
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState()
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

        {/* if toggle doesn't have onChange prop, we need to provide readOnly prop */}
        <Toggle on={bothOn} readOnly={true} />
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
