-- =====================================================
-- ВОССТАНОВЛЕНИЕ ДАННЫХ В SUPABASE
-- ВНИМАНИЕ: Выполняйте по шагам!
-- =====================================================

-- ШАГ 1: Узнайте свой user_id
-- Замените EMAIL на ваш email и выполните:
SELECT id, email FROM auth.users WHERE email = 'ваш@email.com';

-- Скопируйте UUID из результата и используйте его в следующих шагах

-- ШАГ 2: Проверьте, есть ли товары без user_id или с другим user_id
-- Замените YOUR_USER_ID на ваш UUID:
SELECT 
  COUNT(*) as items_to_recover,
  'Товары без user_id' as description
FROM items
WHERE user_id IS NULL;

SELECT 
  COUNT(*) as items_to_recover,
  'Товары с другим user_id' as description
FROM items
WHERE user_id IS NOT NULL AND user_id != 'YOUR_USER_ID'::uuid;

-- ШАГ 3: Восстановление товаров без user_id
-- ВНИМАНИЕ: Выполняйте только если уверены!
-- Замените YOUR_USER_ID на ваш UUID:
/*
UPDATE items 
SET user_id = 'YOUR_USER_ID'::uuid
WHERE user_id IS NULL;
*/

-- ШАГ 4: Перемещение товаров к вашему user_id
-- ВНИМАНИЕ: Это изменит владельца товаров!
-- Замените YOUR_USER_ID на ваш UUID:
/*
UPDATE items 
SET user_id = 'YOUR_USER_ID'::uuid
WHERE user_id IS NOT NULL AND user_id != 'YOUR_USER_ID'::uuid;
*/

-- ШАГ 5: Восстановление пустых категорий
-- Замените YOUR_USER_ID на ваш UUID:
/*
UPDATE empty_categories 
SET user_id = 'YOUR_USER_ID'::uuid
WHERE user_id IS NULL OR user_id != 'YOUR_USER_ID'::uuid;
*/

-- ШАГ 6: Проверка результата
-- Замените YOUR_USER_ID на ваш UUID:
SELECT COUNT(*) as your_items FROM items WHERE user_id = 'YOUR_USER_ID'::uuid;
SELECT COUNT(*) as your_categories FROM empty_categories WHERE user_id = 'YOUR_USER_ID'::uuid;

-- =====================================================
-- БЭКАП ПЕРЕД ИЗМЕНЕНИЯМИ
-- =====================================================

-- Создайте бэкап перед любыми изменениями:
CREATE TABLE IF NOT EXISTS items_backup AS SELECT * FROM items;
CREATE TABLE IF NOT EXISTS empty_categories_backup AS SELECT * FROM empty_categories;

-- Восстановление из бэкапа (если что-то пошло не так):
-- DROP TABLE items;
-- CREATE TABLE items AS SELECT * FROM items_backup;

