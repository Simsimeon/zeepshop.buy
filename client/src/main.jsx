import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from "./store/store"
import { Toaster } from './components/ui/toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={Store}>
    <App />
    <Toaster/>
  </Provider>
  </BrowserRouter>,
)
