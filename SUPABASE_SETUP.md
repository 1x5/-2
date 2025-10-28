# Настройка Supabase (PostgreSQL + авторизация)

## Шаг 1: Создание проекта Supabase

1. Перейдите на https://supabase.com
2. Нажмите "Start your project" → "Start a new project"
3. Войдите через GitHub (или создайте аккаунт)
4. Нажмите "New Project"
5. Заполните:
   - **Organization**: выберите или создайте
   - **Project Name**: `sumki-inventory`
   - **Database Password**: придумайте сложный пароль
   - **Region**: выберите ближайший (например: `eu-central`)
6. Нажмите "Create new project"

⏳ Подождите ~2 минуты пока проект создаётся

## Шаг 2: Получение ключей

1. В левом меню нажмите на `⚙️` (Settings) → **API**
2. Найдите секцию **Project API keys**
3. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (начинается с `eyJ...`)

## Шаг 3: Настройка в проекте

Откройте файл `src/supabase.js` и вставьте ваши данные:

```javascript
const supabaseUrl = 'https://ВАШ_ПРОЕКТ.supabase.co'
const supabaseKey = 'eyJhbGc...' // ваш anon ключ
```

## Шаг 4: Создание таблицы в PostgreSQL

1. В левом меню выберите **SQL Editor**
2. Нажмите "+ New query"
3. Вставьте и выполните этот SQL:

```sql
-- Создание таблицы для товаров
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

-- Создание таблицы для пустых категорий
CREATE TABLE empty_categories (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_empty_categories_user_id ON empty_categories(user_id);

-- Row Level Security (RLS) - защита данных
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE empty_categories ENABLE ROW LEVEL SECURITY;

-- Политики доступа: пользователь видит только свои данные
CREATE POLICY "Users can view own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own categories" ON empty_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON empty_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON empty_categories
  FOR DELETE USING (auth.uid() = user_id);
```

4. Нажмите **"Run"** (выполнить)

## Шаг 5: Проверка

1. В левом меню выберите **Table Editor**
2. Вы должны увидеть таблицы: `items` и `empty_categories`

## Готово! 🎉

Теперь ваше приложение:
- ✅ Использует PostgreSQL базу данных
- ✅ Требует авторизацию
- ✅ Каждый пользователь видит только свои данные
- ✅ Данные синхронизируются в облаке
- ✅ Работает на любом устройстве

## Первый запуск

1. Запустите `npm run dev`
2. Зарегистрируйте первого пользователя
3. Начните добавлять товары!

