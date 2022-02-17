// testing custom hooks
// http://localhost:3000/counter-hook

// we use @testing-library/react-hooks instead
import {renderHook, act} from '@testing-library/react-hooks'
import useCounter from '../../components/use-counter'

test('exposes the count and increment/decrement functions', () => {
  // this result will not change even we call "increment" or "decrement" to update count number 
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const {result} = renderHook(useCounter, { initialProps: { initialCount: 3 }})
  expect(result.current.count).toBe(3)
  act(() => result.current.increment())
  expect(result.current.count).toBe(4)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(3)
})

test('allows customization of the step', () => {
  const {result} = renderHook(useCounter, { initialProps: { step: 2 }})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('step could be change', () => {
  const {result, rerender} = renderHook(useCounter, { initialProps: { step: 2 }})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  // we can rerender hook with updated param
  rerender({ step: 1 })
  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
})
/* eslint no-unused-vars:0 */
