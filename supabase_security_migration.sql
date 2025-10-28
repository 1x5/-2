-- =====================================================
-- ЗАЩИТА БАЗЫ ДАННЫХ
-- Запустите этот SQL в Supabase SQL Editor
-- =====================================================

-- 1. УДАЛЕНИЕ СТАРЫХ ПОЛИТИК (если нужно пересоздать)
DROP POLICY IF EXISTS "Users can view own items" ON items;
DROP POLICY IF EXISTS "Users can insert own items" ON items;
DROP POLICY IF EXISTS "Users can update own items" ON items;
DROP POLICY IF EXISTS "Users can delete own items" ON items;
DROP POLICY IF EXISTS "Users can view own categories" ON empty_categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON empty_categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON empty_categories;

-- 2. СОЗДАНИЕ УСИЛЕННЫХ ПОЛИТИК
-- Проверяем, что пользователь авторизован И является владельцем
CREATE POLICY "Users can view own items" ON items
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON items
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update own items" ON items
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON items
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Категории
CREATE POLICY "Users can view own categories" ON empty_categories
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON empty_categories
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can delete own categories" ON empty_categories
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. ОГРАНИЧЕНИЕ НА КОЛИЧЕСТВО ЗНАЧЕНИЙ
-- Защита от спама: максимум 1000 товаров на пользователя
ALTER TABLE items ADD CONSTRAINT check_item_limit 
  CHECK (
    (SELECT COUNT(*) FROM items WHERE user_id = items.user_id) < 1000
  );

-- Максимум 100 категорий на пользователя
ALTER TABLE empty_categories ADD CONSTRAINT check_category_limit 
  CHECK (
    (SELECT COUNT(*) FROM empty_categories WHERE user_id = empty_categories.user_id) < 100
  );

-- 4. ОГРАНИЧЕНИЕ НА ДЛИНУ ТЕКСТА
ALTER TABLE items ADD CONSTRAINT check_name_length CHECK (length(name) <= 200);
ALTER TABLE items ADD CONSTRAINT check_category_length CHECK (category IS NULL OR length(category) <= 100);

-- 5. ОГРАНИЧЕНИЕ НА КОЛИЧЕСТВО
ALTER TABLE items ADD CONSTRAINT check_quantity_valid 
  CHECK (quantity >= 0 AND quantity <= 99999);

-- =====================================================
-- ГОТОВО! Теперь ваша база защищена:
-- ✅ Только авторизованные пользователи
-- ✅ Только свои данные
-- ✅ Защита от спама (1000 товаров максимум)
-- ✅ Защита от длинных строк
-- ✅ Защита от отрицательных количеств
-- =====================================================

