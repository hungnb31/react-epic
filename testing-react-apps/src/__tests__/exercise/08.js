// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, act} from '@testing-library/react'
import useCounter from '../../components/use-counter'

test('exposes the count and increment/decrement functions', () => {
  let result
  function TestUseCounter() {
    result = useCounter()
    return null
  }
  render(<TestUseCounter />)
  
  expect(result.count).toBe(0)
  // call result.increment will update the state
  // so we need to wrap it inside "act()"
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})

/* eslint no-unused-vars:0 */
