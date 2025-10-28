import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './Auth.jsx'
import { useAuth } from './useAuth.js'
import './index.css'

function Main() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#ffffff',
        fontFamily: 'DM Mono, monospace'
      }}>
        Загрузка...
      </div>
    )
  }

  return user ? <App user={user} /> : <Auth setUser={(u) => {}} user={user} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)

