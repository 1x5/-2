-- =====================================================
-- ПРОВЕРКА ДАННЫХ В БАЗЕ
-- Запустите в Supabase SQL Editor
-- =====================================================

-- 1. ПРОВЕРКА ВСЕХ ТОВАРОВ (без фильтра по user_id)
SELECT 
  id,
  user_id,
  name,
  category,
  quantity,
  created_at
FROM items
ORDER BY created_at DESC
LIMIT 20;

-- 2. ПРОВЕРКА ТОВАРОВ С NULL user_id (могут быть потеряны)
SELECT 
  COUNT(*) as count_without_user,
  'Товары без user_id' as description
FROM items
WHERE user_id IS NULL;

-- 3. ГРУППИРОВКА ПО user_id
SELECT 
  user_id,
  COUNT(*) as item_count,
  array_agg(name ORDER BY id LIMIT 3) as sample_names
FROM items
GROUP BY user_id
ORDER BY item_count DESC;

-- 4. ПРОВЕРКА ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ (замените на свой email)
-- Сначала узнайте свой user_id:
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 5. ПРОВЕРКА ТОВАРОВ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ (замените UUID на свой)
-- SELECT * FROM items WHERE user_id = 'ВАШ-UUID-ЗДЕСЬ';

-- 6. ПРОВЕРКА RLS ПОЛИТИК
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('items', 'empty_categories')
ORDER BY tablename, policyname;

-- 7. ПРОВЕРКА ПУСТЫХ КАТЕГОРИЙ
SELECT 
  user_id,
  name,
  created_at
FROM empty_categories
ORDER BY created_at DESC;

