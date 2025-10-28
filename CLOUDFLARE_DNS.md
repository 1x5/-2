# Настройка DNS для code1x5.ru (Cloudflare)

## Если ваш домен использует DNS от Cloudflare

### Шаг 1: Добавление A-записей в Cloudflare

1. Зайдите на https://dash.cloudflare.com
2. Войдите в ваш аккаунт
3. Выберите домен **code1x5.ru**
4. Перейдите в раздел **"DNS"** → **"Records"**
5. Нажмите **"Add record"**

Добавьте 4 A-записи:

**Запись 1:**
- Type: `A`
- Name: `@` (или оставьте пустым)
- IPv4 address: `185.199.108.153`
- Proxy status: **DNS only** (серое облако)
- TTL: Auto
- Save record

**Запись 2:**
- Type: `A`
- Name: `@`
- IPv4 address: `185.199.109.153`
- Proxy status: **DNS only**
- TTL: Auto
- Save record

**Запись 3:**
- Type: `A`
- Name: `@`
- IPv4 address: `185.199.110.153`
- Proxy status: **DNS only**
- TTL: Auto
- Save record

**Запись 4:**
- Type: `A`
- Name: `@`
- IPv4 address: `185.199.111.153`
- Proxy status: **DNS only**
- TTL: Auto
- Save record

### Важно!
- **Proxy status** должен быть **DNS only** (серое облако), НЕ оранжевое!
- Облако (прокси) должно быть выключено для GitHub Pages

### Шаг 2: Настройка в GitHub

1. Откройте https://github.com/1x5/-2/settings/pages
2. В разделе **"Custom domain"** введите: `code1x5.ru`
3. Поставьте галочку **"Enforce HTTPS"**
4. Нажмите **"Save"**

### Шаг 3: Ожидание

- DNS записи обновятся через 5-15 минут (Cloudflare быстрее чем reg.ru)
- GitHub проверит домен
- SSL сертификат будет выдан автоматически через ~24 часа

После этого сайт будет доступен на https://code1x5.ru

