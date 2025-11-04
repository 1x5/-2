-- Создание таблицы для логов действий
CREATE TABLE IF NOT EXISTS action_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  time VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индекс для быстрого поиска по пользователю
CREATE INDEX IF NOT EXISTS idx_action_logs_user_id ON action_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_timestamp ON action_logs(timestamp DESC);

-- Row Level Security (RLS)
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свои логи
CREATE POLICY "Users can view own logs" ON action_logs
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Политика: пользователи могут создавать только свои логи
CREATE POLICY "Users can insert own logs" ON action_logs
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Политика: пользователи могут удалять только свои логи
CREATE POLICY "Users can delete own logs" ON action_logs
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Ограничение: автоматическое удаление логов старше 30 дней (опционально)
-- Можно настроить через pg_cron или Supabase Edge Functions

