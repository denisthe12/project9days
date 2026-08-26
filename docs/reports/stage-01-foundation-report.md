# Stage 01 — Foundation Report

## Дата

`2026-08-21`

## Статус

`PASS`

## Краткий итог

С нуля подготовлен один минимальный full-stack проект Next.js 16 с App Router, React, TypeScript и Tailwind CSS. Добавлены Zod-схемы и выведенные из них TypeScript-типы `PlanDay` и `Plan`, настроен Vitest и написаны базовые unit-тесты. После замечаний этапа 1 обязательные строковые поля переведены на trim-валидацию, typecheck стал автономным для Next.js 16, а generated `tsconfig.tsbuildinfo` удалён. Чистая frozen-установка, финальные unit-тесты, typecheck и production build прошли.

## Что сделано

- Создан минимальный Next.js App Router проект без отдельного backend-приложения.
- Подключены TypeScript и Tailwind CSS через PostCSS.
- Добавлена статическая техническая placeholder-страница без формы и интерактивности.
- Добавлена runtime-зависимость Zod.
- Реализованы `planDaySchema` и `planSchema`; `PlanDay.topic`, `Plan.id` и `Plan.topic` используют `trim().min(1)`, поэтому whitespace-only значения невалидны.
- Типы `PlanDay`, `Plan` и `DurationUnit` выведены из Zod-схем без `any` и ручного дублирования структуры.
- Добавлена node-конфигурация Vitest и 17 проверок базовой Zod-валидации, включая whitespace-only строки.
- Добавлены scripts для разработки, unit-тестов, однократного прогона тестов, автономного typecheck (`next typegen --webpack && tsc --noEmit`), production build и production start.
- Созданы `.env.example` и `.gitignore` с правилами для локальных env-файлов.
- Зафиксировано дерево зависимостей в `pnpm-lock.yaml`.
- Команды `dev` и `build` настроены на штатный webpack-режим Next.js, поскольку Turbopack в текущем окружении не смог создать служебный процесс PostCSS из-за запрета привязки порта.
- После финального typecheck удалён generated artifact `tsconfig.tsbuildinfo`; правило `*.tsbuildinfo` сохранено в `.gitignore`, а `incremental` остался включённым.

## Что не сделано

- Не реализована никакая функциональность этапов 2+: форма, request validation, API, OpenAI-интеграция, генерация плана, UI состояний и результата, редактирование, сохранение или deployment.
- Не добавлены библиотеки, нужные только следующим этапам.

## Созданные и изменённые файлы

- `package.json` — scripts, тип модулей, runtime- и dev-зависимости, выбранный package manager; `typecheck` выполняет `next typegen --webpack` перед `tsc --noEmit`.
- `pnpm-lock.yaml` — lock-файл установленных зависимостей.
- `tsconfig.json` — строгая TypeScript-конфигурация для Next.js; Next.js добавил include для `.next/dev/types/**/*.ts` во время build.
- `next-env.d.ts` — декларации типов Next.js.
- `next.config.ts` — минимальная конфигурация Next.js.
- `postcss.config.mjs` — PostCSS-плагин Tailwind CSS.
- `vitest.config.ts` — Vitest с тестовой средой `node`.
- `.gitignore` — build output, зависимости, локальные env-файлы и служебные файлы.
- `.env.example` — пустые `OPENAI_API_KEY` и `OPENAI_MODEL`.
- `src/app/layout.tsx` — корневой App Router layout и статические metadata.
- `src/app/page.tsx` — минимальный технический placeholder.
- `src/app/globals.css` — подключение Tailwind CSS и базовые светлые/тёмные color tokens.
- `src/domain/plan/plan.schema.ts` — Zod-схемы `PlanDay` и `Plan`, включая trim-валидацию текстовых обязательных полей.
- `src/domain/plan/plan.types.ts` — типы, выведенные из Zod-схем.
- `src/domain/plan/plan.schema.test.ts` — unit-тесты схем, включая whitespace-only `PlanDay.topic`, `Plan.topic` и `Plan.id`.
- `tsconfig.tsbuildinfo` — удалён как generated artifact; не должен находиться среди исходных файлов.
- `docs/reports/stage-01-foundation-report.md` — настоящий отчёт.

## Добавленные зависимости

### Runtime

- `next` `16.3.2`
- `react` `19.2.8`
- `react-dom` `19.2.8`
- `zod` `4.4.3`

### Dev

- `@tailwindcss/postcss` `4.3.3`
- `@types/node` `26.2.0`
- `@types/react` `19.2.18`
- `@types/react-dom` `19.2.4`
- `tailwindcss` `4.3.3`
- `typescript` `7.0.2`
- `vitest` `4.1.11`

## Реализированные модели и схемы

### `PlanDay`

- `day` — положительное целое число.
- `topic` — строка, непустая после `trim()`.

### `Plan`

- `id` — строка, непустая после `trim()`.
- `topic` — строка, непустая после `trim()`.
- `durationValue` — положительное число.
- `durationUnit` — enum `"days" | "weeks"`.
- `durationDays` — положительное целое число.
- `dailyStudyMinutes` — положительное целое число.
- `days` — массив элементов `planDaySchema`.
- `createdAt` и `updatedAt` — строки формата date-time, допускающие timezone offset.

Типы `PlanDay` и `Plan` созданы через `z.infer`; `DurationUnit` выведен из `Plan["durationUnit"]`.

## Environment variables

- `OPENAI_API_KEY` — присутствует в `.env.example` только как пустая server environment variable; секрет не добавлен.
- `OPENAI_MODEL` — присутствует в `.env.example` без значения; конкретная модель не захардкожена.
- `.env.example` содержит ровно две строки с именами этих переменных и пустыми значениями.
- `.gitignore` содержит `.env*` и исключение `!.env.example`.
- Других `.env*`-файлов в корне на момент проверки нет.

## Выполненные проверки

Записаны только команды, которые действительно выполнялись.

| Проверка | Команда | Результат |
|---|---|---|
| Frozen install | `CI=true pnpm install --frozen-lockfile --store-dir /tmp/study-planner-stage-01-pnpm-store` | `PASS` — `node_modules` пересоздан из актуального lock-файла; pnpm вывел `Lockfile is up to date, resolution step is skipped`; установлен `next 16.3.2`, lock-файл не менялся. |
| Unit tests | `pnpm test:run` | `PASS` — 1 test file passed, 17 tests passed, 0 failed; финальный последовательный прогон занял 3.80 s. |
| Typecheck | `pnpm typecheck` | `PASS` — `next typegen --webpack && tsc --noEmit`, route types успешно сгенерированы, ошибок typecheck нет. |
| Production build | `pnpm build` | `PASS` — `next build --webpack`, compilation, встроенный TypeScript, page-data collection, generation of 3 static pages и build traces завершены; `/` и `/_not-found` статически пререндерены. |
| Local run | `pnpm start --hostname 127.0.0.1 --port 3100` | `PASS` — Next.js 16.3.2 сообщил `Ready in 4.0s`; HTTP-проверка `curl http://127.0.0.1:3100/` вернула `200` и ожидаемый текст placeholder. После проверки сервер намеренно остановлен через Ctrl+C (exit code 130). |

### Дополнительная история production build

- Первый `pnpm build` с дефолтным Turbopack фактически выполнялся и завершился `FAIL`: Turbopack panic при обработке `src/app/globals.css`, причина — `creating new process` / `binding to a port` / `Operation not permitted (os error 1)`.
- Повторный `pnpm build` вне sandbox также фактически выполнялся и завершился тем же `FAIL`, поэтому проблема не была ошибочно объявлена устранённой снятием sandbox.
- После перевода стандартного script `build` на поддерживаемый Next.js webpack-режим финальный `pnpm build` завершился `PASS`.

### Дополнительная история frozen install после замечаний

- `pnpm install --frozen-lockfile` в sandbox фактически завершился `FAIL` с `EROFS` при записи служебного симлинка pnpm-store.
- Повтор вне sandbox без `CI=true` завершился `FAIL`: pnpm безопасно отказался удалять `node_modules` без TTY.
- Первая CI-попытка через общий mounted-store завершилась `FAIL` с `ENOENT` при copyfile из `/mnt/d/.pnpm-store`.
- Первая CI-попытка с отдельным `/tmp` store также завершилась `FAIL` с `ENOENT` во время copyfile в mounted workspace, хотя все 130 пакетов были скачаны.
- Повтор той же команды с уже заполненным `/tmp/study-planner-stage-01-pnpm-store` завершился `PASS`; pnpm использовал 86 cached packages, скачиваний не потребовалось. Это и есть финальная воспроизводимая frozen-установка, после которой обязательные проверки выполнялись строго последовательно.

## Результаты unit-тестов

- Корректный `PlanDay` принимается.
- Значения `day` 0 и -1 отклоняются.
- Пустой `PlanDay.topic` отклоняется.
- `PlanDay.topic` из пробелов и табов отклоняется.
- Корректный `Plan` принимается.
- `Plan.topic` и `Plan.id` из пробелов и табов отклоняются.
- Неизвестный `durationUnit` отклоняется.
- Нулевые и отрицательные значения `durationValue`, `durationDays` и `dailyStudyMinutes` отклоняются.
- Некорректные `createdAt` и `updatedAt` отклоняются.
- Итого: 17 passed, 0 failed.

## Security checks

- [x] Реальный `OPENAI_API_KEY` отсутствует в исходном коде — поиск по implementation/config files нашёл только пустую строку `OPENAI_API_KEY=` в `.env.example`.
- [x] `NEXT_PUBLIC_OPENAI_API_KEY` не создан — поиск по implementation/config files не нашёл совпадений.
- [x] Локальные env-файлы с секретами покрыты правилом `.env*` в `.gitignore`; `.env.example` явно исключён из игнорирования.
- [x] `.env.example` не содержит секретов — обе переменные имеют пустые значения.

Каталог не является рабочим Git-репозиторием (`git status` завершился сообщением `not a git repository`), поэтому проверка именно набора отслеживаемых Git-файлов технически недоступна. Вместо этого проверено фактическое дерево implementation/config files с исключением зависимостей, build output и исходной документации.

## Scope check

На этапе 1 не реализованы:

- форма;
- `/api/plans/generate` или другой Route Handler;
- OpenAI SDK, клиент или вызов;
- Structured Outputs;
- loading/error/result UI;
- редактирование;
- `localStorage`;
- Playwright;
- rate limiting;
- deployment.

Поиск по `src`, `package.json` и `.env.example` не обнаружил характерных реализаций перечисленной функциональности. До начала этапа такой функциональности в пустом проекте также не было.

## Технические допущения

- Исходный каталог содержал документацию, но не содержал приложения, `package.json` или lock-файл; поэтому проект создан с нуля.
- В окружении доступны Node.js `v20.20.2`, pnpm `10.32.1` и npm `10.8.2`. При отсутствии существующего package manager выбран pnpm `10.32.1`; выбор зафиксирован в `packageManager` и `pnpm-lock.yaml`.
- Установлены актуальные версии пакетов, разрешённые npm-тегом `latest` на дату выполнения; фактические разрешённые версии перечислены выше и закреплены lock-файлом.
- Для `dev` и `build` выбран поддерживаемый webpack-режим Next.js из-за воспроизводимого инфраструктурного сбоя Turbopack/PostCSS в текущем окружении.
- `next@16.3.2` фактически установлен, доступен через `pnpm exec next --version` и согласован с `pnpm-lock.yaml`; менять версию или регенерировать lock-файл не потребовалось.
- Чистая установка в этом mounted workspace потребовала отдельного `/tmp` pnpm-store из-за подтверждённых `ENOENT` в общем mounted-store. Финальная установка выполнена с `--frozen-lockfile` и не меняла lock-файл.
- Git-метаданные отсутствуют или недоступны как валидный repository metadata set, поэтому `git status` и аудит tracked files невозможны.

## Проблемы / блокеры

Блокирующих или незавершённых пунктов этапа 1 нет. Сбой Turbopack обойдён штатным webpack-режимом; для clean-state install использован отдельный временный pnpm-store из-за проблем mounted-store. Финальные frozen install, unit-тесты, typecheck и production build проходят.

## Итог

Статус этапа — `PASS`, потому что существует один рабочий Next.js App Router + TypeScript проект, Tailwind CSS, Zod и Vitest подключены, схемы и согласованные типы реализованы, whitespace-only обязательные строки отклоняются, 17 unit-тестов проходят, автономный `next typegen --webpack && tsc --noEmit` проходит, финальные frozen install и production build завершаются успешно, `tsconfig.tsbuildinfo` отсутствует среди исходных файлов, env-пример безопасен, а функциональность этапов 2+ отсутствует.

**Этап 2 в рамках этой работы не начат.**
