import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store, { persistor } from './Redux/store.js'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <PersistGate loading={null} persistor={persistor} >
        <>
          <Toaster richColors position="top-center" />
          <App />
        </>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
