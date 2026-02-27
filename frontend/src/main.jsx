import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthContext from './context/AuthContext.jsx'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <AuthContext>
      <App />
    </AuthContext>
)
