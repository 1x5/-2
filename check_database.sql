-- =====================================================
-- ПРОВЕРКА ДАННЫХ В SUPABASE
-- Запустите в Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. ПРОВЕРКА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. ПРОВЕРКА ВСЕХ ТОВАРОВ В БАЗЕ (БЕЗ ФИЛЬТРА)
SELECT 
  id,
  user_id,
  name,
  category,
  quantity,
  color,
  created_at,
  updated_at
FROM items
ORDER BY created_at DESC
LIMIT 50;

-- 3. КОЛИЧЕСТВО ТОВАРОВ ПО ПОЛЬЗОВАТЕЛЯМ
SELECT 
  u.email,
  u.id as user_id,
  COUNT(i.id) as item_count,
  MIN(i.created_at) as first_item,
  MAX(i.created_at) as last_item
FROM auth.users u
LEFT JOIN items i ON i.user_id = u.id
GROUP BY u.id, u.email
ORDER BY item_count DESC;

-- 4. ПРОВЕРКА ТОВАРОВ БЕЗ USER_ID (потерянные данные)
SELECT 
  COUNT(*) as lost_items_count,
  'Товары без привязки к пользователю' as description
FROM items
WHERE user_id IS NULL;

-- Если есть потерянные товары, покажите их:
SELECT * FROM items WHERE user_id IS NULL ORDER BY created_at DESC;

-- 5. ПРОВЕРКА ПУСТЫХ КАТЕГОРИЙ
SELECT 
  ec.user_id,
  u.email,
  ec.name as category_name,
  ec.created_at
FROM empty_categories ec
LEFT JOIN auth.users u ON u.id = ec.user_id
ORDER BY ec.created_at DESC;

-- 6. ПРОВЕРКА ДАННЫХ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
-- Замените EMAIL на ваш email:
SELECT 
  i.id,
  i.name,
  i.category,
  i.quantity,
  i.color,
  i.created_at
FROM items i
JOIN auth.users u ON u.id = i.user_id
WHERE u.email = 'ваш@email.com'  -- ← ЗАМЕНИТЕ ЗДЕСЬ
ORDER BY i.created_at DESC;

-- 7. ПРОВЕРКА RLS ПОЛИТИК
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

-- 8. ПРОВЕРКА СТАТИСТИКИ БАЗЫ
SELECT 
  'items' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT user_id) as unique_users
FROM items
UNION ALL
SELECT 
  'empty_categories' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT user_id) as unique_users
FROM empty_categories;

