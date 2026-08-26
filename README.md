# ДЕМОНАСТРАЦИЯ УРОКА 5

## Назначение

Небольшая учебная демонстрация двух внешних API в одном Next.js App Router приложении.

## Возможности

- формирование учебного плана через Gemini;
- прогноз погоды на завтра через Open-Meteo для Актау, Атырау и Алматы.

## Стек

Next.js App Router, React, JavaScript, обычный CSS, `@google/genai` и server-side `fetch`.

## Установка

```bash
pnpm install
```

## Настройка окружения

Создайте `.env.local`:

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

## Локальный запуск

```bash
pnpm dev
```

## Production-проверка

```bash
pnpm build
pnpm start
```

## Переменные окружения Vercel

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
