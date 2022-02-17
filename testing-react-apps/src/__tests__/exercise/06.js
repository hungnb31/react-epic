// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import { useCurrentPosition } from 'react-use-geolocation'
import Location from '../../examples/location'

// jest will mock all the method this module has
jest.mock('react-use-geolocation')

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

  // we create mock function to handle useCurrentLocation logic
  let setCurrentLocation
  function useMockCurrentPosition() {
    const state = React.useState([])
    setCurrentLocation = state[1]
    return state[0]
  }
  
  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  render(<Location />)

  // we should see the loading screen
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    // we gonna make mock function return the fake position
    setCurrentLocation([fakePosition])
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
