import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthSupabase from './AuthSupabase.jsx'
import { supabase } from './supabase'
import './index.css'

// Версия приложения и время сборки
const APP_VERSION = '1.0.0'
const BUILD_TIME = import.meta.env.VITE_BUILD_TIME || new Date().toISOString()

function Main() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Вывод информации о версии в консоль при загрузке
  useEffect(() => {
    const buildDate = new Date(BUILD_TIME)
    const formattedDate = buildDate.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
    
    console.log('%c════════════════════════════════════════', 'color: #00ff00; font-weight: bold')
    console.log('%c🚀 Приложение загружено', 'color: #00ff00; font-weight: bold; font-size: 14px')
    console.log('%c════════════════════════════════════════', 'color: #00ff00; font-weight: bold')
    console.log(`%c📦 Версия: ${APP_VERSION}`, 'color: #00aaff; font-weight: bold')
    console.log(`%c📅 Время сборки: ${formattedDate}`, 'color: #00aaff; font-weight: bold')
    console.log(`%c🕐 Текущее время: ${new Date().toLocaleString('ru-RU')}`, 'color: #888888')
    console.log('%c════════════════════════════════════════', 'color: #00ff00; font-weight: bold')
  }, [])

  useEffect(() => {
    // Проверяем сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  return user ? <App user={user} supabase={supabase} /> : <AuthSupabase setUser={setUser} user={user} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)

