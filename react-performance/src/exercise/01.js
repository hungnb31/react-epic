// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// 🐨 use React.lazy to create a Globe component which uses a dynamic import
// to get the Globe component from the '../globe' module.

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  // we added a magic comment to tell webpack that we want to prefetch this module
  const Globe = React.lazy(() => import( /* webpackPrefetch: true */ '../globe'))

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
      <label style={{marginBottom: '1rem'}}>
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
