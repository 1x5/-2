-- ПРОВЕРКА ЗАЩИТЫ БАЗЫ ДАННЫХ
-- Запустите этот SQL в Supabase SQL Editor

-- 1. Проверка RLS политик
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('items', 'empty_categories')
ORDER BY tablename, policyname;

-- 2. Проверка триггеров
SELECT 
    trigger_name,
    event_object_table,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('items', 'empty_categories');

-- 3. Проверка функций
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'check_%';

-- 4. Проверка CHECK констрейнтов
SELECT 
    constraint_name,
    table_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name IN ('items', 'empty_categories')
  AND constraint_name LIKE 'check_%';

