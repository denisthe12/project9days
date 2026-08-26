# Техническое задание

## Перенос демонстрационного проекта на Next.js

## 1. Цель

Перенести существующее демонстрационное приложение с Express, HTML, CSS и vanilla JavaScript на Next.js App Router, сохранив текущую логику, интерфейс и два сценария:

1. Формирование учебного плана через Gemini API.
2. Получение прогноза погоды на завтра через Open-Meteo API.

Итоговый проект должен запускаться локально, проходить production-сборку и разворачиваться на Vercel как единое full-stack Next.js-приложение.

Миграция не должна добавлять новые пользовательские функции.

---

## 2. Исходное состояние

Текущий проект использует:

- frontend: HTML, CSS и vanilla JavaScript в папке `public`;
- backend: Node.js и Express в `server.js`;
- Gemini: официальный пакет `@google/genai`;
- погоду: Open-Meteo Forecast API;
- локальные переменные: `.env` и `.env.example`;
- package manager: pnpm;
- Node.js 20+.

Действующие маршруты:

```text
POST /api/study-plan
GET  /api/weather?city=Aktau
```

Git в рамках этого этапа не инициализировать.

---

## 3. Целевая архитектура

Использовать один Next.js-проект с App Router и JavaScript.

```text
Browser
  │
  ├─ POST /api/study-plan
  └─ GET  /api/weather?city=...
  │
  ▼
Next.js Route Handlers
  ├─ Gemini API
  └─ Open-Meteo API
```

Отдельный Express-сервер после миграции не используется.

Минимальная структура:

```text
project/
├─ app/
│  ├─ api/
│  │  ├─ study-plan/
│  │  │  └─ route.js
│  │  └─ weather/
│  │     └─ route.js
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ docs/
├─ .env.local
├─ .env.example
├─ .gitignore
├─ package.json
├─ pnpm-lock.yaml
└─ README.md
```

Не использовать папку `src`, чтобы структура оставалась понятной для демонстрации.

---

## 4. Обязательный стек

- Next.js с App Router;
- React;
- JavaScript без TypeScript;
- обычный CSS без Tailwind CSS;
- `@google/genai`;
- серверный `fetch` для Open-Meteo;
- pnpm;
- Node.js 20+;
- deployment на Vercel.

Не добавлять:

- TypeScript;
- Tailwind CSS или UI-библиотеки;
- Express и `dotenv`;
- базу данных;
- авторизацию;
- тестовые framework'и;
- Docker;
- GitHub Actions;
- Vercel CLI;
- дополнительные страницы и функции.

---

## 5. Изменения package.json

Runtime-зависимости:

```text
next
react
react-dom
@google/genai
```

Удалить зависимости:

```text
express
dotenv
```

Scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Сохранить `private: true` и Node.js 20+.

После изменения зависимостей обновить `pnpm-lock.yaml` командой:

```bash
pnpm install
```

---

## 6. Frontend

### 6.1. Главная страница

Перенести текущую страницу в:

```text
app/page.js
```

Поскольку страница содержит формы, состояния загрузки и обработчики событий, она должна быть клиентским компонентом:

```js
"use client";
```

На странице сохранить два независимых блока.

### 6.2. Блок «Учебный план»

Элементы:

- поле «Тема обучения»;
- числовое поле «Срок в днях»;
- разрешённый диапазон от 1 до 14;
- кнопка «Сформировать план»;
- состояние загрузки;
- сообщение об ошибке;
- текстовый результат Gemini.

Frontend отправляет:

```http
POST /api/study-plan
Content-Type: application/json
```

```json
{
  "topic": "Основы JavaScript",
  "days": 5
}
```

Ожидаемый успешный ответ:

```json
{
  "plan": "День 1 — ..."
}
```

### 6.3. Блок «Погода на завтра»

Элементы:

- список: Актау, Атырау и Алматы;
- кнопка «Показать погоду»;
- состояние загрузки;
- сообщение об ошибке;
- структурированный результат прогноза.

Frontend отправляет запрос только к собственному Route Handler:

```http
GET /api/weather?city=Aktau
```

Прямые обращения frontend к Gemini и Open-Meteo запрещены.

### 6.4. Состояния интерфейса

Сохранить текущие состояния:

- очистка старого результата перед новым запросом;
- отключение кнопки во время запроса;
- индикатор загрузки;
- успешный результат;
- понятная ошибка;
- возможность повторить запрос.

Сохранить текущие пользовательские сообщения, включая:

```text
Формируем учебный план…
Загружаем прогноз…
Не удалось получить ответ Gemini. Повторите попытку
Не удалось загрузить погоду
```

### 6.5. Стили

Перенести существующие стили в:

```text
app/globals.css
```

Подключить файл в `app/layout.js`.

Сохранить:

- текущую цветовую палитру;
- ширину контейнера;
- карточки;
- оформление форм и кнопок;
- состояния `hover`, `disabled` и `focus-visible`;
- адаптацию к узкому экрану;
- `aria-live`, `role="alert"` и подписи полей.

---

## 7. Route Handler: Gemini

Файл:

```text
app/api/study-plan/route.js
```

Экспортировать обработчик:

```js
export async function POST(request) {}
```

### 7.1. Валидация

Принять JSON с полями `topic` и `days`.

Валидный запрос:

- `topic` имеет тип string;
- после `trim()` тема не пустая;
- `days` является целым числом;
- `days >= 1`;
- `days <= 14`.

При невалидных данных вернуть:

```http
400 Bad Request
```

```json
{
  "error": "Некорректные данные"
}
```

### 7.2. Переменные окружения

Использовать только на сервере:

```js
process.env.GEMINI_API_KEY
process.env.GEMINI_MODEL
```

Не использовать префикс `NEXT_PUBLIC_`.

Если ключ или модель отсутствуют, вернуть безопасную ошибку `500`, не раскрывая конфигурацию.

### 7.3. Вызов Gemini

Использовать текущую интеграцию:

```js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL,
  contents: prompt,
});
```

Сохранить текущий prompt без изменения смысла:

```text
Составь практический план изучения темы «<topic>» на <days> дней.

Для каждого дня укажи:
День N — короткая тема
Что изучить: краткое описание
Практика: одно небольшое практическое задание

Сделай ровно <days> разделов, от Дня 1 до Дня <days>.
Пиши кратко, понятно и без лишней теории.
Не добавляй вступление и заключение.
```

Проверить, что `response.text` является непустой строкой.

Успешный ответ:

```json
{
  "plan": "..."
}
```

При ошибке Gemini вернуть:

```http
500 Internal Server Error
```

```json
{
  "error": "Не удалось получить ответ Gemini"
}
```

В серверном логе разрешено фиксировать безопасное описание ошибки, но запрещено выводить API-ключ.

---

## 8. Route Handler: погода

Файл:

```text
app/api/weather/route.js
```

Экспортировать обработчик:

```js
export async function GET(request) {}
```

Получить город через:

```js
new URL(request.url).searchParams.get("city")
```

### 8.1. Разрешённые города

Сохранить текущие значения:

```js
const cities = {
  Aktau: { name: "Актау", latitude: 43.65, longitude: 51.17 },
  Atyrau: { name: "Атырау", latitude: 47.12, longitude: 51.92 },
  Almaty: { name: "Алматы", latitude: 43.24, longitude: 76.95 },
};
```

Для отсутствующего или неизвестного города вернуть:

```http
400 Bad Request
```

```json
{
  "error": "Неизвестный город"
}
```

### 8.2. Open-Meteo

Сохранить текущий запрос к:

```text
https://api.open-meteo.com/v1/forecast
```

Параметры:

```text
latitude
longitude
daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max
timezone=auto
forecast_days=2
```

Индекс `0` обозначает сегодня, индекс `1` — завтра.

Проверить `response.ok`, наличие `daily` и необходимых значений с индексом `1`.

Сохранить существующее преобразование WMO-кодов:

```text
0       → Ясно
1       → Преимущественно ясно
2       → Переменная облачность
3       → Пасмурно
45, 48  → Туман
51–57   → Морось
61–67   → Дождь
71–77   → Снег
80–82   → Ливневый дождь
85–86   → Снегопад
95      → Гроза
96, 99  → Гроза с градом
прочее  → Нет описания
```

Успешный ответ должен сохранить текущий контракт:

```json
{
  "city": "Актау",
  "date": "2026-08-26",
  "temperatureMin": 20,
  "temperatureMax": 29,
  "condition": "Ясно",
  "precipitationProbability": 0
}
```

Если вероятность осадков отсутствует, вернуть `null`.

При внешней ошибке вернуть:

```http
500 Internal Server Error
```

```json
{
  "error": "Не удалось загрузить погоду"
}
```

---

## 9. Environment variables и безопасность

Локальные секреты хранить в:

```text
.env.local
```

Структура локального файла:

```dotenv
GEMINI_API_KEY=реальный_ключ_только_локально
GEMINI_MODEL=gemini-3.7-flash
```

Публичный пример:

```dotenv
# .env.example
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

Переменная `PORT` больше не требуется.

Обновить `.gitignore`:

```gitignore
.env
.env.*
!.env.example
node_modules/
.next/
.vercel/
```

Требования безопасности:

- API-ключ существует только в server environment;
- ключ не читается в `app/page.js`;
- ключ не получает префикс `NEXT_PUBLIC_`;
- ключ не возвращается в JSON;
- ключ не выводится в лог;
- реальное значение отсутствует в `.env.example`, README и документации;
- ошибки API не раскрывают stack trace пользователю.

---

## 10. Удаляемые файлы

После успешного переноса удалить устаревшую реализацию:

```text
server.js
public/index.html
public/app.js
public/styles.css
```

Удалять папку `public` целиком можно только в том случае, если в ней не осталось других статических файлов.

Документацию и архивы не удалять.

---

## 11. README

Создать краткий `README.md` со следующими разделами:

1. Назначение проекта.
2. Возможности:
   - учебный план через Gemini;
   - погода через Open-Meteo.
3. Используемый стек.
4. Установка: `pnpm install`.
5. Настройка `.env.local` без реального значения ключа.
6. Локальный запуск: `pnpm dev`.
7. Production-проверка: `pnpm build` и `pnpm start`.
8. Переменные окружения для Vercel.

Не включать в README Git-команды и настоящий API-ключ.

---

## 12. Порядок выполнения миграции

1. Зафиксировать текущие API-контракты и пользовательские сообщения.
2. Обновить `package.json` и зависимости.
3. Создать `app/layout.js` и подключить глобальный CSS.
4. Перенести интерфейс в клиентский `app/page.js`.
5. Создать `POST /api/study-plan` как Route Handler.
6. Создать `GET /api/weather` как Route Handler.
7. Перенести секрет из `.env` в `.env.local` без вывода его содержимого.
8. Обновить `.env.example` и `.gitignore`.
9. Создать README.
10. Запустить локальные проверки.
11. Только после успешных проверок удалить Express-файлы.
12. Убедиться, что Git не был инициализирован.

---

## 13. Проверка

Установка:

```bash
pnpm install
```

Локальный запуск:

```bash
pnpm dev
```

Production-сборка:

```bash
pnpm build
```

Запуск production-версии:

```bash
pnpm start
```

Проверить вручную:

1. Главная страница открывается без ошибок.
2. Пустая тема не отправляется.
3. Срок меньше 1 и больше 14 не принимается.
4. Gemini возвращает план ровно на указанное количество дней.
5. Погода загружается для Актау.
6. Погода загружается для Атырау.
7. Погода загружается для Алматы.
8. Неизвестный город даёт HTTP 400.
9. Неверный или отсутствующий Gemini-ключ показывает безопасную ошибку.
10. Сбой Open-Meteo не ломает страницу.
11. Кнопки блокируются во время запросов.
12. После ошибки запрос можно повторить.
13. В клиентском bundle отсутствует `GEMINI_API_KEY`.
14. `pnpm build` завершается успешно.
15. Папка `.git` отсутствует.

---

## 14. Критерии готовности

Миграция считается завершённой, если:

- проект работает на Next.js App Router;
- отдельный Express-сервер не используется;
- интерфейс и оба пользовательских сценария сохранены;
- API-маршруты и JSON-контракты не изменены;
- Gemini вызывается только на сервере;
- прогноз на завтра берётся через Open-Meteo;
- `.env.local` исключён из будущего Git-репозитория;
- `.env.example` не содержит секретов;
- `pnpm build` проходит без ошибок;
- проект готов к импорту в Vercel;
- Git не инициализирован.

---

## 15. Официальные источники

- [Next.js: Getting Started](https://nextjs.org/docs/app/getting-started)
- [Next.js: Route Handlers и Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js: Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel: Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)

