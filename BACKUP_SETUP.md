# Настройка автоматического бэкапа Supabase

## Шаг 1: Получите строку подключения к базе данных

1. Зайдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. Найдите секцию **Connection string** или **Connection pooling**
5. Скопируйте строку подключения в формате:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   Или используйте **Connection pooling**:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

## Шаг 2: Добавьте секрет в GitHub

1. Перейдите в ваш репозиторий на GitHub
2. Откройте **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Название: `SUPABASE_DB_URL`
5. Значение: вставьте строку подключения из шага 1
6. Нажмите **Add secret**

## Шаг 3: Проверьте workflow

1. Файл `.github/workflows/backup.yml` уже создан
2. Workflow будет запускаться автоматически каждые 6 часов
3. Можно запустить вручную через **Actions** → **Supabase Backup** → **Run workflow**

## Как это работает

- **Расписание**: Каждые 6 часов (UTC)
- **Хранение**: Последние 30 бэкапов сохраняются в папке `backups/`
- **Формат**: Сжатые SQL файлы (`supabase_backup_YYYYMMDD_HHMMSS.sql.gz`)
- **Автоматический коммит**: Бэкапы автоматически коммитятся в репозиторий

## Восстановление из бэкапа

1. Найдите нужный файл в папке `backups/`
2. Распакуйте: `gunzip supabase_backup_YYYYMMDD_HHMMSS.sql.gz`
3. Восстановите через Supabase Dashboard или CLI:
   ```bash
   psql "postgresql://..." < supabase_backup_YYYYMMDD_HHMMSS.sql
   ```

## Проверка работы

После первого запуска проверьте:
- **Actions** → найдите последний запуск **Supabase Backup**
- Убедитесь, что workflow завершился успешно
- Проверьте папку `backups/` в репозитории

## Примечания

- Бэкапы хранятся в репозитории, поэтому для больших баз данных рассмотрите GitHub LFS или альтернативное хранилище
- Время запуска указано в UTC (московское время = UTC+3)
- Для безопасности используйте **Connection pooling** строку вместо прямой

