// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, act} from '@testing-library/react'
import useCounter from '../../components/use-counter'

function setup({ initialProps } = {}) {
  // we need to make result be an object because
  // when we call increment or decrement, this result will update
  // but the result in the test will not update
  // making result an object to make sure the result in this function
  // not gonna be changed over time, only element inside it gonna be change
  const result = {}
  function TestComponent() {
    // we need to use Object.assign here because 
    // we need to copy all the element inside object returned from useCounter
    // to result
    Object.assign(result, useCounter(initialProps))
    return null
  }
  render(<TestComponent />)
  return result
}

test('exposes the count and increment/decrement functions', () => {
  // this result will not change even we call "increment" or "decrement" to update count number 
  const result = setup()
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const result = setup({ initialProps: { initialCount: 3 }})
  expect(result.count).toBe(3)
  act(() => result.increment())
  expect(result.count).toBe(4)
  act(() => result.decrement())
  expect(result.count).toBe(3)
})

test('allows customization of the step', () => {
  const result = setup({ initialProps: { step: 2 }})
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(2)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})
/* eslint no-unused-vars:0 */
