# Информация о проекте - Система учета инвентаря

## 📋 Общее описание

Приложение для управления инвентарем товаров с облачной базой данных PostgreSQL через Supabase и авторизацией пользователей.

**Версия:** 1.0.0  
**Технологии:** React, Vite, Supabase (PostgreSQL), CSS  
**Тип:** Single Page Application (SPA)

## 🎯 Основной функционал

### 1. Авторизация пользователей
- **Путь:** `src/AuthSupabase.jsx`, `src/main.jsx`
- **База данных:** Supabase Authentication
- **Способ входа:** Email + Password
- **Безопасность:** Только вход (регистрация отключена, пользователи создаются через Supabase Dashboard)

### 2. Управление товарами
- **Добавление:** Кнопка "+" → выбор категории → ввод названия
- **Редактирование:** Клик по названию или количеству
- **Удаление:** Свайп влево
- **Поиск:** Поле "Поиск" фильтрует по названию
- **Категории:** Табы вверху для фильтрации

### 3. Категории
- **Создание:** Команда `+#название` в поиске
- **Удаление:** Команда `-#название` в поиске
- **Хранение:** Таблица `empty_categories` в PostgreSQL

### 4. Автоматическое определение цвета
- **Функция:** `getColorFromName()` в `src/App.jsx`
- **Логика:** Поиск ключевых слов в названии
- **Цвета:** Черный, серый, белый, красный, оранжевый, желтый, зеленый, голубой, синий, фиолетовый, розовый, бордовый, коричневый, бежевый
- **По умолчанию:** Серый (#cccccc)

### 5. Текстовый просмотр базы данных
- **Открытие:** Кнопка с иконкой документа (слева внизу)
- **Режимы:** Просмотр / Редактирование
- **Формат:** Минималистичный текст (категория, название, количество, маркеры)
- **Экспорт:** Кнопка "Скачать TXT"

### 6. Темы оформления
- **Переключение:** Кнопка солнце/луна (слева внизу)
- **Темы:** Светлая (#f5f5f7, #ffffff) и темная (#000000, #1a1a1a)
- **Сохранение:** localStorage

## 🗂 Структура проекта

```
сумки2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions для деплоя
├── public/                      # Статические файлы
├── src/
│   ├── App.jsx                  # Главный компонент с логикой
│   ├── App.css                  # Стили компонента
│   ├── main.jsx                 # Точка входа, авторизация
│   ├── index.css                # Глобальные стили
│   ├── supabase.js              # Конфигурация Supabase
│   ├── AuthSupabase.jsx         # Компонент авторизации
│   ├── Auth.css                 # Стили авторизации
│   ├── useAuth.js               # Хук для авторизации (не используется)
│   └── firebase.js              # Firebase (не используется)
├── index.html                   # HTML шаблон
├── package.json                  # Зависимости
├── vite.config.js               # Конфигурация Vite
├── README.md                     # Основная документация
├── SUPABASE_SETUP.md            # Инструкция настройки Supabase
├── PROJECT_INFO.md              # Этот файл
└── FIREBASE_SETUP.md            # Инструкция Firebase (не используется)
```

## 🔧 Основные компоненты и их назначение

### `src/main.jsx`
- Проверяет авторизацию через Supabase
- Показывает `AuthSupabase` если не авторизован
- Показывает `App` если авторизован

### `src/App.jsx` (1040+ строк)
**Состояние:**
- `items` - массив товаров `{id, name, category, quantity, color}`
- `emptyCategories` - пустые категории без товаров
- `activeCategory` - активная вкладка
- `searchQuery` - текст поиска
- `editing` - режим редактирования `{id, field}`
- `swipeOffset` - позиция свайпа для удаления
- `isDarkTheme` - тема оформления

**Основные функции:**
- `getColorFromName(name)` - определение цвета по названию
- `startEdit(id, field, value)` - начать редактирование
- `saveEdit(id, field, value)` - сохранить изменения
- `handleTouchStart/Move/End` - обработка свайпа
- `formatDataAsText()` - формат текста для просмотра
- `parseTextAndUpdate(text)` - парсинг текста в товары

**Эффекты:**
- Загрузка из PostgreSQL при инициализации
- Синхронизация с PostgreSQL (дебаунс 1с)
- Кэш в localStorage

### `src/AuthSupabase.jsx`
- Форма входа (email + password)
- Кнопка выхода
- Регистрация отключена

### `src/supabase.js`
- URL: `https://orrkwxgfoafyenudouqh.supabase.co`
- Ключ: `sb_publishable_3qDjAT2bYbUcNC9DkkYXEQ_QgkdPvpB`
- Экспорт клиента Supabase

## 🗄 Структура базы данных (PostgreSQL)

### Таблица `items`
```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Таблица `empty_categories`
```sql
CREATE TABLE empty_categories (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
- Пользователь видит только свои данные
- Политики: SELECT, INSERT, UPDATE, DELETE

## 🎨 Стили и дизайн

### Цветовая палитра
**Темная тема:**
- Фон: `#000000`
- Блоки: `#1a1a1a`
- Границы: `#404040`
- Текст: `#ffffff`

**Светлая тема:**
- Фон: `#f5f5f7`
- Блоки: `#ffffff`
- Границы: `#e5e5e5`
- Текст: `#000000`

### Адаптивность
- Максимальная ширина: `430px`
- На desktop: по центру с тенью
- На mobile: на всю ширину

### Ключевые элементы
- `.item-card` - карточка товара
- `.color-indicator` - индикатор цвета слева
- `.swipe` - анимация свайпа для удаления
- `.category-suggestions` - подсказки категорий (Portal)
- `.theme-toggle` - кнопки управления (48x48px, круглые)

## 🔐 Безопасность

1. **Авторизация обязательна** - без входа приложение не доступно
2. **RLS в PostgreSQL** - пользователь видит только свои данные
3. **Регистрация отключена** - доступ только для созданных пользователей
4. **Publishable ключ** - безопасен для браузера

## 📦 Зависимости (package.json)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@supabase/supabase-js": "^2.x",
  "vite": "^4.5.14"
}
```

## 🚀 Деплой

### GitHub Pages
- **Branch:** `gh-pages`
- **Workflow:** `.github/workflows/deploy.yml`
- **URL:** https://1x5.github.io/-2/
- **Base path:** `/` (настроено в vite.config.js)

### Локальный запуск
```bash
npm install
npm run dev      # http://localhost:5173 (с --host для сети)
npm run build    # dist/
```

## 🔄 Синхронизация данных

1. **localStorage** - мгновенное кэширование
2. **PostgreSQL (Supabase)** - облачное хранилище
3. **Дебаунс 1 секунда** - предотвращение частых запросов
4. **RLS** - изоляция данных между пользователями

## 🎯 Команды в поиске

- `+#название` - создать категорию
- `-#название` - удалить категорию (показывает подсказки)
- `#` - показать существующие категории

## 📝 Важные файлы для понимания

1. **src/App.jsx** - вся логика приложения
2. **src/main.jsx** - роутинг авторизации
3. **src/supabase.js** - конфигурация базы данных
4. **src/AuthSupabase.jsx** - компонент входа
5. **package.json** - зависимости и скрипты
6. **vite.config.js** - настройки сборки

## ⚠️ Известные особенности

1. **Регистрация отключена** - пользователи создаются через Supabase Dashboard
2. **Firebase не используется** - оставлен для справки, можно удалить
3. **Две папки AuthSupabase и Auth** - используется только AuthSupabase
4. **useAuth.js не используется** - логика авторизации в main.jsx

## 🔧 Настройка для другого проекта

1. **Заменить Supabase конфиг** в `src/supabase.js`
2. **Создать таблицы** через SQL Editor в Supabase
3. **Создать пользователя** через Supabase Dashboard
4. **Обновить base URL** в `vite.config.js` для GitHub Pages
5. **Изменить название** репозитория если нужно

## 📊 Статистика кода

- **Основной компонент:** 1040+ строк
- **Стили:** 828 строк
- **Конфигурация:** 4 файла
- **Компоненты:** 3 основных файла

---

**Последнее обновление:** 28 января 2025  
**Версия:** 1.0.0  
**Статус:** Production Ready ✅

