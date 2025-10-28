# Настройка Firebase для приложения учета инвентаря

## Шаг 1: Создание проекта Firebase

1. Перейдите на https://console.firebase.google.com
2. Нажмите "Add project" (Добавить проект)
3. Введите название проекта (например: `sumki-inventory`)
4. Отключите Google Analytics (опционально)
5. Нажмите "Create project"

## Шаг 2: Включение Authentication

1. В боковом меню выберите "Authentication"
2. Нажмите "Get started"
3. Перейдите на вкладку "Sign-in method"
4. Включите "Email/Password"
5. Нажмите "Save"

## Шаг 3: Создание Cloud Firestore Database

1. В боковом меню выберите "Firestore Database"
2. Нажмите "Create database"
3. Выберите "Start in test mode"
4. Выберите расположение (например: `eur3`)
5. Нажмите "Enable"

## Шаг 4: Получение конфигурации

1. В боковом меню нажмите на шестерёнку → "Project settings"
2. Прокрутите вниз до "Your apps"
3. Нажмите на иконку `</>` (Web)
4. Скопируйте конфигурацию

## Шаг 5: Настройка в проекте

Откройте файл `src/firebase.js` и замените:

```javascript
const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_PROJECT_ID.firebaseapp.com",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_PROJECT_ID.appspot.com",
  messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
  appId: "ВАШ_APP_ID"
}
```

## Шаг 6: Правила безопасности (Firestore)

В Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение/запись только авторизованным пользователям
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Нажмите "Publish"

## Готово! 🎉

Теперь ваше приложение:
- ✅ Требует авторизацию для доступа
- ✅ Хранит данные в облачной базе Firebase
- ✅ Синхронизируется между устройствами
- ✅ Безопасно хранит данные

## Первый пользователь

1. Запустите приложение
2. Нажмите "Регистрация"
3. Введите email и пароль
4. Войдите в систему

