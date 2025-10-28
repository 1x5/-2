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

-- 3. ФУНКЦИИ ДЛЯ ПРОВЕРКИ ЛИМИТОВ
-- Функция для проверки лимита товаров
CREATE OR REPLACE FUNCTION check_item_count_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM items WHERE user_id = NEW.user_id) >= 1000 THEN
    RAISE EXCEPTION 'Превышен лимит: максимум 1000 товаров на пользователя';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для проверки лимита категорий
CREATE OR REPLACE FUNCTION check_category_count_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM empty_categories WHERE user_id = NEW.user_id) >= 100 THEN
    RAISE EXCEPTION 'Превышен лимит: максимум 100 категорий на пользователя';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для применения лимитов
CREATE TRIGGER check_item_limit_trigger
  BEFORE INSERT ON items
  FOR EACH ROW
  EXECUTE FUNCTION check_item_count_limit();

CREATE TRIGGER check_category_limit_trigger
  BEFORE INSERT ON empty_categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_count_limit();

-- 4. ОГРАНИЧЕНИЕ НА ДЛИНУ ТЕКСТА (если constraint не существует)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_name_length'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT check_name_length CHECK (length(name) <= 200);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_category_length'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT check_category_length CHECK (category IS NULL OR length(category) <= 100);
  END IF;
END $$;

-- 5. ОГРАНИЧЕНИЕ НА КОЛИЧЕСТВО (если constraint не существует)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_quantity_valid'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT check_quantity_valid 
      CHECK (quantity >= 0 AND quantity <= 99999);
  END IF;
END $$;

-- =====================================================
-- ГОТОВО! Теперь ваша база защищена:
-- ✅ Только авторизованные пользователи
-- ✅ Только свои данные
-- ✅ Защита от спама (1000 товаров максимум)
-- ✅ Защита от длинных строк
-- ✅ Защита от отрицательных количеств
-- =====================================================

