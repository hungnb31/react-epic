// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// 🐨 use React.lazy to create a Globe component which uses a dynamic import
// to get the Globe component from the '../globe' module.

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  // define a function that import the Globe component

  // webpack doesn't care about how many time you import a module
  // so if we import it already, that module will be cached
  // which mean when code run into React.lazy and execute the import
  // the module was already loaded
  const loadGlobe = () => {
    return import('../globe')
  }

  // instead of import Globe component like normal
  // we are using React.lazy to lazy load it whenever we need it
  // right here, we expected that Globe component was already imported
  const Globe = React.lazy(() => import('../globe'))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      {/* we are using onMouseEnter and onFocus to import the module we need */}
      {/* which mean when user hover or focus on the checkbox, we already load the module from those actions
      so no need to check the checkbox to load it */}
      <label onMouseEnter={loadGlobe} onFocus={loadGlobe} style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      {/* we need to wrap the lazy load component inside React.Suspense */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <div style={{width: 400, height: 400}}>
          {showGlobe ? <Globe /> : null}
        </div>
      </React.Suspense>
    </div>
  )
}

export default App
