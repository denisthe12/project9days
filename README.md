# 🎓 AI Study Planner

> **Учебный планировщик** — веб-приложение, превращающее любую сложную тему обучения в пошаговый ежедневный план с помощью AI.

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4%2B-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI_API-Structured_Outputs-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://project9days.vercel.app/)

---

## 🌟 Ценность и Проблема

При попытке самостоятельно освоить новую дисциплину (программирование, иностранный язык, подготовка к экзаменам) люди сталкиваются с **информационным хаосом** и параличом выбора. Непонятно, с чего начать, как разбить материал по дням и сколько времени уделять теме ежедневно.

**AI Study Planner** решает эту проблему за несколько секунд:
1. Вы указываете **тему**, **доступный срок** и **время в день**.
2. AI генерирует логичный, пошаговый **план по дням**.
3. Вы свободно **редактируете** полученный маршрут и **сохраняете** его в локальном хранилище.

---

## ✨ Основные Возможности (MVP)

* 🤖 **AI-генерация плана:** Использование OpenAI Structured Outputs для построения предсказуемого и точного графического представления.
* ⏱ **Персонализация по времени:** Учет доступных минут в день и общей длительности (в днях или неделях).
* ✍️ **Интерактивное редактирование:** Возможность скорректировать формулировку любой темы напрямую в интерфейсе.
* 💾 **Локальное сохранение:** Автоматическое сохранение плана в `localStorage` — доступ к вашему треку без регистрации и аккаунтов.
* 🚀 **Мгновенный старт:** Ноль лишних шагов: открыл, ввел параметры, получил результат.

---

## 🛠 Технологический Стек

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Route Handlers)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Validation:** [Zod](https://zod.dev/) (валидация формы, серверных запросов и ответов AI)
* **AI Provider:** [OpenAI API](https://platform.openai.com/) (с поддержкой Structured Outputs)
* **Storage:** Browser `localStorage`
* **Testing:** [Vitest](https://vitest.dev/) (Unit-тесты) & [Playwright](https://playwright.dev/) (E2E)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Быстрый запуск

### Требования
* Node.js version >= 18.x
* npm / pnpm / yarn

### Инструкция по установке

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/denisthe12/project9days.git
   cd project9days
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   Создайте файл `.env.local` в корневой директории проекта и добавьте ваш API-ключ OpenAI:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Запустите сервер для разработки:**
   ```bash
   npm run dev
   ```

5. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 🏗 Архитектура

Приложение создано как монолит на **Next.js App Router**:

```text
Browser (Frontend)
   │
   ├─► Форма ввода (тема, время, дни)
   ├─► Отображение и редактирование плана
   └─► Хранение в localStorage
   │
   ▼ HTTPS
Next.js Server (Route Handler: /api/plans/generate)
   │
   ├─► Валидация входных данных (Zod)
   ├─► Формирование системного промпта
   └─► Запрос к OpenAI API (Structured Output)
```

---

## 🧪 Тестирование

Запуск модульных тестов (Vitest):
```bash
npm run test
```

Запуск сквозных E2E тестов (Playwright):
```bash
npm run test:e2e
```

---

## 🔗 Ссылки

* **Demo App:** [project9days.vercel.app](https://project9days.vercel.app/)
* **GitHub Repository:** [github.com/denisthe12/project9days](https://github.com/denisthe12/project9days)
