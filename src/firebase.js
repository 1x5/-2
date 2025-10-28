import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Замените на вашу конфигурацию Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Инициализация Firebase
const app = initializeApp(firebaseConfig)

// Инициализация Firebase Authentication
export const auth = getAuth(app)

// Инициализация Cloud Firestore
export const db = getFirestore(app)

export default app

