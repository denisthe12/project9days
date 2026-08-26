"use client";

import { useState } from "react";


export default function Home() {
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState("5");
  const [plan, setPlan] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const [city, setCity] = useState("Aktau");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  async function handleStudyPlanSubmit(event) {
    event.preventDefault();
    setPlan("");
    setPlanError("");

    const trimmedTopic = topic.trim();
    const dayCount = Number(days);

    if (!trimmedTopic || !Number.isInteger(dayCount) || dayCount < 1 || dayCount > 14) {
      setPlanError("Введите тему и срок от 1 до 14 целых дней.");
      return;
    }

    setPlanLoading(true);

    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmedTopic, days: dayCount }),
      });

      if (!response.ok) {
        throw new Error("Study plan request failed");
      }

      const data = await response.json();

      if (typeof data.plan !== "string" || !data.plan.trim()) {
        throw new Error("Study plan is empty");
      }

      setPlan(data.plan);
    } catch {
      setPlanError("Не удалось получить ответ Gemini. Повторите попытку");
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleWeatherSubmit(event) {
    event.preventDefault();
    setWeather(null);
    setWeatherError("");
    setWeatherLoading(true);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      setWeather(await response.json());
    } catch {
      setWeatherError("Не удалось загрузить погоду");
    } finally {
      setWeatherLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Демонстрация API</h1>
      <p className="intro">ЗАНЯТИЕ 5, ИЗМЕНЕНИЯ ГИТХАБ.</p>

      <section className="card" aria-labelledby="study-plan-title">
        <h2 id="study-plan-title">Учебный план</h2>
        <form onSubmit={handleStudyPlanSubmit} noValidate>
          <label htmlFor="topic">Тема обучения</label>
          <input
            id="topic"
            name="topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Например, Основы JavaScript"
            required
            autoComplete="off"
            aria-invalid={planError ? "true" : undefined}
            aria-describedby={planError ? "study-plan-error" : undefined}
          />

          <label htmlFor="days">Срок в днях</label>
          <input
            id="days"
            name="days"
            type="number"
            min="1"
            max="14"
            step="1"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            required
            aria-invalid={planError ? "true" : undefined}
            aria-describedby={planError ? "study-plan-error" : undefined}
          />

          <button type="submit" disabled={planLoading} aria-busy={planLoading}>
            Сформировать план
          </button>
        </form>
        {planLoading && <p className="status" aria-live="polite">Формируем учебный план…</p>}
        {planError && <p id="study-plan-error" className="error" role="alert">{planError}</p>}
        {plan && <pre className="result" aria-live="polite">{plan}</pre>}
      </section>

      <section className="card" aria-labelledby="weather-title">
        <h2 id="weather-title">Погода на завтра</h2>
        <form onSubmit={handleWeatherSubmit}>
          <label htmlFor="city">Город</label>
          <select id="city" name="city" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="Aktau">Актау</option>
            <option value="Atyrau">Атырау</option>
            <option value="Almaty">Алматы</option>
          </select>

          <button type="submit" disabled={weatherLoading} aria-busy={weatherLoading}>
            Показать погоду
          </button>
        </form>
        {weatherLoading && <p className="status" aria-live="polite">Загружаем прогноз…</p>}
        {weatherError && <p className="error" role="alert">{weatherError}</p>}
        {weather && (
          <div className="result" aria-live="polite">
            <div>Город: {weather.city}</div>
            <div>Дата: {weather.date}</div>
            <div>Минимальная температура: {weather.temperatureMin} °C</div>
            <div>Максимальная температура: {weather.temperatureMax} °C</div>
            <div>Условия: {weather.condition}</div>
            <div>
              Вероятность осадков: {weather.precipitationProbability ?? "Нет данных"}
              {weather.precipitationProbability !== null && weather.precipitationProbability !== undefined ? "%" : ""}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
