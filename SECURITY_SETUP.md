# 🔒 Усиленная безопасность приложения

## Шаг 1: Обновление RLS политик в Supabase

1. Откройте https://supabase.com/dashboard/project/orrkwxgfoafyenudouqh
2. В меню слева выберите **SQL Editor**
3. Нажмите **"New query"**
4. Скопируйте содержимое файла `supabase_security_migration.sql`
5. Вставьте в SQL Editor и нажмите **"Run"**

Это добавит:
- ✅ **Защиту от анонимных запросов** (только authenticated пользователи)
- ✅ **Лимит 1000 товаров** на пользователя (защита от спама)
- ✅ **Лимит 100 категорий** на пользователя
- ✅ **Валидацию длины строк** (название ≤ 200 символов)
- ✅ **Валидацию количества** (нельзя ввести отрицательное число)

## Шаг 2: Настройка Rate Limiting (опционально)

1. В Supabase Dashboard выберите **Authentication** → **Rate Limits**
2. Включите:
   - **Email sends**: 4 requests/hour
   - **SMS sends**: 4 requests/hour
   - **Password reset**: 3 requests/hour

## Шаг 3: Настройка CORS (защита от других сайтов)

1. В Dashboard: **Settings** → **API**
2. Найдите секцию **"CORS Configuration"**
3. Добавьте ваш домен в whitelist:
   ```
   https://code1x5.ru
   https://1x5.github.io
   ```
4. **Сохраните**

## Шаг 4: Проверка безопасности

После выполнения SQL миграции проверьте:

1. Войти в приложение
2. Попробовать добавить товар → должно работать ✅
3. Открыть DevTools → Console → посмотреть запросы

Если видите ошибки — это нормально, RLS защищает данные!

---

## ⚠️ ЧТО ИЗМЕНИЛОСЬ:

### До:
```sql
CREATE POLICY "Users can view own items" ON items
  FOR SELECT USING (auth.uid() = user_id);
```

### После:
```sql
CREATE POLICY "Users can view own items" ON items
  FOR SELECT 
  TO authenticated  -- ТОЛЬКО авторизованные!
  USING (auth.uid() = user_id);
```

**Разница:** теперь `anon` ключ не может обойти защиту, только `authenticated` пользователи с сессией.

---

## 🎯 Уровень защиты

| Аспект | До | После |
|--------|-----|-------|
| Анонимный доступ | ❌ Есть риск | ✅ Заблокирован |
| Спам запросов | ❌ Нет лимитов | ✅ Есть лимиты |
| Валидация данных | ⚠️ Частично | ✅ Полная |
| CORS защита | ⚠️ Слабый | ✅ Усилена |

---

## 🚀 Готово!

Ваше приложение теперь на уровне **production-ready** безопасности.

