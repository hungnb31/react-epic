// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'

// 🐨 set window.navigator.geolocation to an object that has a getCurrentPosition mock function

// 💰 I'm going to give you this handy utility function
// it allows you to create a promise that you can resolve/reject on demand.
beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn()
  }
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}
// 💰 Here's an example of how you use this:
// const {promise, resolve, reject} = deferred()
// promise.then(() => {/* do something */})
// // do other setup stuff and assert on the pending state
// resolve()
// await promise
// // assert on the resolved state

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 50,
      longitude: 100
    }
  }
  
  const {promise, resolve} = deferred()

  // mock implementation to make method return correct response
  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    callback => {
      // because in real browser, this method not return coords right away
      // so that's why we return the promise here instead just return coords
      promise.then(() => callback(fakePosition))
    }
  )

  render(<Location />)

  // we should see the loading screen
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  // right here we resolve the promise to make the method return coords

  // we also need to wrap this to the "act" method
  // because when we resolve the methods to get current user coords
  // it will trigger some side effect in react
  // and when we wrap everything cause the side effect in the "act"
  // react will handle all the side effect for us
  await act(async () => {
    resolve()
    await promise
  })

  // we make sure screen no longer has loading
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  // we make sure screen display the correct coords
  expect(screen.getByText(/latitude/i)).toHaveTextContent(`Latitude: ${fakePosition.coords.latitude}`)
  expect(screen.getByText(/longitude/i)).toHaveTextContent(`Longitude: ${fakePosition.coords.longitude}`)
})

/*
eslint
  no-unused-vars: "off",
*/
