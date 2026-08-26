# Инструкция для AI-агента
## Занятие №5 — перенос демонстрационного проекта на Next.js

## 1. Цель этапа

Перенести существующий демонстрационный проект занятия №4 с Express, HTML, CSS и vanilla JavaScript на один full-stack проект на **Next.js App Router**, сохранив текущий интерфейс, оба пользовательских сценария и существующие API-контракты.

Источник требований:

```text
docs/source/ТЗ_перенос_проекта_на_Next.js.md
```

Это именно миграция существующего проекта, а не разработка нового продукта.

Главная задача — сделать проект понятным для последующей демонстрации GitHub и Vercel.

**Git в рамках этой работы не инициализировать.**

---

## 2. Что должно сохраниться без изменения смысла

Сохранить:

- блок «Учебный план»;
- блок «Погода на завтра»;
- `POST /api/study-plan`;
- `GET /api/weather?city=...`;
- request/response contracts;
- пользовательские сообщения loading/error;
- текущий prompt Gemini;
- города Актау, Атырау и Алматы;
- координаты городов;
- WMO mapping;
- текущую визуальную структуру;
- accessibility-атрибуты;
- server-side использование Gemini и Open-Meteo.

Не добавлять новых пользовательских функций.

---

## 3. Целевая архитектура

После миграции:

```text
Browser
  │
  ├─ POST /api/study-plan
  └─ GET /api/weather?city=...
  │
  ▼
Next.js App Router
  ├─ app/page.js
  ├─ app/api/study-plan/route.js
  └─ app/api/weather/route.js
       ├─ Gemini API
       └─ Open-Meteo API
```

Отдельный Express server после миграции не используется.

---

## 4. Обязательный стек

Использовать:

- Next.js;
- App Router;
- React;
- JavaScript;
- обычный CSS;
- `@google/genai`;
- server-side `fetch`;
- pnpm;
- Node.js 20+.

Не использовать:

- TypeScript;
- Tailwind;
- UI-библиотеки;
- Express;
- dotenv;
- БД;
- auth;
- test frameworks;
- Docker;
- GitHub Actions;
- Vercel CLI;
- дополнительные страницы;
- дополнительные функции.

Не создавать папку `src`.

---

## 5. Целевая структура

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
│  ├─ source/
│  └─ stages/
├─ .env.local
├─ .env.example
├─ .gitignore
├─ package.json
├─ pnpm-lock.yaml
└─ README.md
```

Если в проекте уже существуют полезные дополнительные файлы, не удалять их без причины.

---

## 6. Перед началом

Сначала изучить текущее состояние проекта.

Найти и прочитать:

```text
server.js
public/index.html
public/app.js
public/styles.css
package.json
.env
.env.example
.gitignore
```

Зафиксировать текущие:

- API-контракты;
- пользовательские сообщения;
- prompt Gemini;
- coordinates;
- WMO mapping;
- CSS;
- behavior loading/error/success.

Старые Express-файлы не удалять до успешной проверки Next.js-версии.

---

## 7. package.json

Runtime dependencies после миграции:

```text
next
react
react-dom
@google/genai
```

Удалить:

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

Сохранить:

```json
"private": true
```

Если уже задан Node.js 20+, сохранить.

После изменения зависимостей выполнить:

```bash
pnpm install
```

`pnpm-lock.yaml` обновить только через pnpm, не вручную.

---

## 8. app/layout.js

Создать:

```text
app/layout.js
```

Обязательно подключить:

```js
import "./globals.css";
```

Создать минимальный root layout.

Допустимый вариант:

```js
import "./globals.css";

export const metadata = {
  title: "API Demo",
  description: "Gemini и погода",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
```

Не усложнять metadata.

---

## 9. app/page.js

Создать:

```text
app/page.js
```

Добавить:

```js
"use client";
```

Причина: формы, React state, loading, error и обработчики событий.

Не переносить vanilla DOM manipulation буквально. Переписать тот же интерфейс на React.

---

## 10. Блок «Учебный план»

Сохранить:

- «Тема обучения»;
- «Срок в днях»;
- диапазон 1–14;
- кнопку «Сформировать план»;
- loading;
- error;
- результат Gemini.

Frontend request:

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

Success contract:

```json
{
  "plan": "День 1 — ..."
}
```

---

## 11. React state для учебного плана

Минимально использовать:

```text
topic
days
plan
planLoading
planError
```

При submit:

1. `preventDefault()`;
2. проверить topic и days;
3. очистить старый result/error;
4. включить loading;
5. disable кнопку;
6. выполнить fetch;
7. обработать success/error;
8. в `finally` снова включить кнопку.

Сохранить тексты:

```text
Формируем учебный план…
Не удалось получить ответ Gemini. Повторите попытку
```

---

## 12. Блок «Погода на завтра»

Сохранить:

- select;
- Актау;
- Атырау;
- Алматы;
- кнопку «Показать погоду»;
- loading;
- error;
- structured result.

Frontend вызывает только:

```text
GET /api/weather?city=Aktau
```

Значения select:

```text
Aktau
Atyrau
Almaty
```

---

## 13. React state для погоды

Минимально:

```text
city
weather
weatherLoading
weatherError
```

При запросе:

1. очистить старый result/error;
2. включить loading;
3. disable кнопку;
4. выполнить fetch;
5. обработать response;
6. сохранить result;
7. в `finally` снова включить кнопку.

Сохранить:

```text
Загружаем прогноз…
Не удалось загрузить погоду
```

---

## 14. Безопасный вывод Gemini

Не использовать:

```js
dangerouslySetInnerHTML
```

AI-текст выводить обычным React text.

Для переносов строк использовать CSS:

```css
white-space: pre-wrap;
```

---

## 15. Accessibility

Сохранить:

- `<label>`;
- корректные `id`;
- `aria-live`;
- `role="alert"`;
- disabled;
- `focus-visible`.

Не добавлять сложную accessibility infrastructure.

---

## 16. app/globals.css

Перенести существующие стили из `public/styles.css` в:

```text
app/globals.css
```

Сохранить:

- текущую палитру;
- container width;
- карточки;
- inputs/select;
- buttons;
- hover;
- disabled;
- focus-visible;
- адаптацию к узкому экрану;
- перенос длинного Gemini text.

Не делать redesign.

Не использовать Tailwind.

---

## 17. Gemini Route Handler

Создать:

```text
app/api/study-plan/route.js
```

Экспорт:

```js
export async function POST(request) {}
```

---

## 18. Валидация Gemini request

Получить body:

```js
const body = await request.json();
```

Проверить:

- `topic` — string;
- `topic.trim()` не пустой;
- `days` — integer;
- `days >= 1`;
- `days <= 14`.

Невалидный request:

```js
return Response.json(
  { error: "Некорректные данные" },
  { status: 400 }
);
```

Frontend validation не считать достаточной.

---

## 19. Gemini env

Использовать только на сервере:

```js
process.env.GEMINI_API_KEY
process.env.GEMINI_MODEL
```

Не использовать:

```text
NEXT_PUBLIC_GEMINI_API_KEY
```

Если ключ или модель отсутствуют, вернуть безопасный HTTP 500.

Не раскрывать environment values.

---

## 20. Gemini client

Использовать:

```js
import { GoogleGenAI } from "@google/genai";
```

```js
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

Вызов:

```js
const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL,
  contents: prompt,
});
```

Gemini никогда не вызывается из `app/page.js`.

---

## 21. Gemini prompt

Сохранить смысл текущего prompt:

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

Не добавлять:

- Structured Outputs;
- JSON schema;
- streaming;
- chat;
- function calling.

---

## 22. Gemini response

Проверить, что:

```js
typeof response.text === "string"
```

и `response.text.trim()` не пустой.

Успех:

```js
return Response.json({
  plan: response.text,
});
```

Ошибка:

```http
500
```

```json
{
  "error": "Не удалось получить ответ Gemini"
}
```

Разрешён `console.error`, но API key не логировать.

---

## 23. Weather Route Handler

Создать:

```text
app/api/weather/route.js
```

Экспорт:

```js
export async function GET(request) {}
```

Получить city:

```js
const city = new URL(request.url).searchParams.get("city");
```

---

## 24. Allowlist городов

Сохранить:

```js
const cities = {
  Aktau: { name: "Актау", latitude: 43.65, longitude: 51.17 },
  Atyrau: { name: "Атырау", latitude: 47.12, longitude: 51.92 },
  Almaty: { name: "Алматы", latitude: 43.24, longitude: 76.95 },
};
```

Не добавлять другие города.

Если city отсутствует/неизвестен:

```http
400
```

```json
{
  "error": "Неизвестный город"
}
```

---

## 25. Open-Meteo request

Использовать server-side fetch к:

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

Frontend напрямую Open-Meteo не вызывает.

---

## 26. Прогноз на завтра

Сохранить:

```text
daily[0] = сегодня
daily[1] = завтра
```

Возвращать только индекс `1`.

Перед использованием проверить, что `daily` и нужные массивы существуют и содержат второй элемент.

---

## 27. WMO mapping

Сохранить:

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

---

## 28. Weather response contract

Успех:

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

Если precipitation недоступна:

```json
"precipitationProbability": null
```

Не возвращать raw Open-Meteo response.

---

## 29. Weather errors

При внешней ошибке:

```http
500
```

```json
{
  "error": "Не удалось загрузить погоду"
}
```

Не возвращать stack trace/raw fetch error.

---

## 30. Environment migration

Перейти с `.env` на:

```text
.env.local
```

Локально:

```dotenv
GEMINI_API_KEY=реальный_ключ
GEMINI_MODEL=gemini-3.7-flash
```

Не выводить реальное значение ключа.

`.env.example`:

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

`PORT` больше не нужен.

---

## 31. .gitignore

Обязательно:

```gitignore
.env
.env.*
!.env.example
node_modules/
.next/
.vercel/
```

Проверить, что `.env.local` игнорируется.

Не создавать `.git`.

---

## 32. README.md

Создать краткий README со следующими разделами:

1. Назначение проекта.
2. Возможности:
   - Gemini study plan;
   - Open-Meteo weather.
3. Stack.
4. Установка:

```bash
pnpm install
```

5. Настройка `.env.local`:

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

6. Development:

```bash
pnpm dev
```

7. Production:

```bash
pnpm build
pnpm start
```

8. Vercel environment variables:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

Не выполнять deployment.

Не добавлять Git-команды.

Не вставлять реальный key.

---

## 33. Удаление старой Express-реализации

До успешной проверки Next.js не удалять:

```text
server.js
public/index.html
public/app.js
public/styles.css
```

После успешных local/build checks удалить:

```text
server.js
public/index.html
public/app.js
public/styles.css
```

Папку `public` удалять только если она стала пустой и не содержит полезных static assets.

Документацию не удалять.

---

## 34. Что намеренно НЕ делать

Не реализовывать:

- `git init`;
- GitHub repository;
- commit/push;
- Vercel deployment;
- Vercel CLI;
- TypeScript;
- Tailwind;
- Express;
- dotenv;
- tests;
- CI/CD;
- Docker;
- auth;
- database;
- новые API;
- новые страницы;
- новые города;
- новые AI-функции;
- redesign;
- streaming;
- localStorage;
- analytics.

GitHub и Vercel будут демонстрироваться отдельно после миграции.

---

## 35. Порядок выполнения

Работать строго в таком порядке:

1. Изучить текущее приложение.
2. Зафиксировать API contracts.
3. Зафиксировать тексты/UI.
4. Обновить `package.json`.
5. Выполнить `pnpm install`.
6. Создать `app/layout.js`.
7. Перенести CSS.
8. Перенести frontend в `app/page.js`.
9. Создать Gemini Route Handler.
10. Создать Weather Route Handler.
11. Перенести env на `.env.local`.
12. Обновить `.env.example`.
13. Обновить `.gitignore`.
14. Создать README.
15. Проверить dev mode.
16. Проверить оба API.
17. Выполнить `pnpm build`.
18. Выполнить `pnpm start`.
19. Только после успешных проверок удалить старую Express-реализацию.
20. Убедиться, что Git не инициализирован.
21. Остановиться.

---

## 36. Обязательные проверки

### 36.1. Dependencies

```bash
pnpm install
```

Без installation errors.

### 36.2. Development

```bash
pnpm dev
```

Открыть:

```text
http://localhost:3000
```

Главная страница должна открываться.

### 36.3. UI

Проверить:

- два блока;
- две основные кнопки;
- исходные подписи;
- loading;
- disabled;
- success;
- error;
- responsive CSS;
- labels;
- `aria-live`;
- `role="alert"`.

### 36.4. Gemini valid flow

Ввести:

```text
Основы JavaScript
5
```

Проверить:

- POST `/api/study-plan`;
- HTTP 200;
- `{ plan: ... }`;
- план в UI;
- кнопку можно повторно нажать после завершения.

Если реального Gemini key нет, не выдумывать успешный результат.

### 36.5. Gemini validation

Проверить backend независимо от frontend:

- empty topic;
- whitespace-only topic;
- days = 0;
- days = 15;
- fractional days;
- missing fields.

Ожидается HTTP 400.

### 36.6. Gemini error

Проверить absent/invalid key.

Ожидается HTTP 500 и UI:

```text
Не удалось получить ответ Gemini. Повторите попытку
```

Без stack trace/API key.

### 36.7. Weather

Проверить:

```text
Aktau
Atyrau
Almaty
```

Для каждого:

- HTTP 200;
- дата завтра;
- min/max;
- condition;
- precipitationProbability или `null`.

### 36.8. Weather validation

Проверить:

```text
/api/weather
/api/weather?city=Unknown
```

Ожидается HTTP 400.

### 36.9. Production build

```bash
pnpm build
```

Должно пройти без ошибок.

### 36.10. Production start

```bash
pnpm start
```

Проверить страницу и оба Route Handler.

### 36.11. Security

Проверить:

- `GEMINI_API_KEY` не используется в `app/page.js`;
- отсутствует `NEXT_PUBLIC_GEMINI_API_KEY`;
- `.env.local` игнорируется;
- `.env.example` безопасен;
- key отсутствует в README;
- key не возвращается API;
- key отсутствует в client bundle.

### 36.12. Git

Проверить отсутствие:

```text
.git/
```

Если `.git` уже существовал до работы, не удалять его молча — указать это в финальном результате.

Если `.git` не существовал, не создавать.

---

## 37. Критерии завершения

Миграция завершена только если:

- проект работает на Next.js App Router;
- используется JavaScript;
- `src/` не создан;
- Express больше не используется;
- dotenv удалён;
- frontend перенесён в React;
- CSS перенесён без redesign;
- `/api/study-plan` работает;
- `/api/weather` работает;
- JSON contracts не изменены;
- Gemini вызывается только server-side;
- Open-Meteo вызывается server-side;
- `.env.local` используется локально;
- `.env.example` безопасен;
- README создан;
- `pnpm build` проходит;
- `pnpm start` работает;
- проект готов к последующему уроку GitHub/Vercel;
- Git не был инициализирован в рамках работы.

---

## 38. Финальный ответ AI-агента

После завершения кратко указать:

1. созданные файлы;
2. удалённые файлы;
3. добавленные dependencies;
4. удалённые dependencies;
5. реально выполненные команды;
6. результат `pnpm install`;
7. результат `pnpm build`;
8. результат `pnpm start`;
9. какие API реально проверены;
10. был ли доступен реальный Gemini key;
11. состояние `.git`;
12. незавершённые пункты или блокеры.

Не заявлять успешные проверки, которые фактически не запускались.

После завершения остановиться. Git/GitHub/Vercel не выполнять.
