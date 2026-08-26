const cities = {
  Aktau: { name: "Актау", latitude: 43.65, longitude: 51.17 },
  Atyrau: { name: "Атырау", latitude: 47.12, longitude: 51.92 },
  Almaty: { name: "Алматы", latitude: 43.24, longitude: 76.95 },
};

function getWeatherDescription(code) {
  if (code === 0) return "Ясно";
  if (code === 1) return "Преимущественно ясно";
  if (code === 2) return "Переменная облачность";
  if (code === 3) return "Пасмурно";
  if ([45, 48].includes(code)) return "Туман";
  if (code >= 51 && code <= 57) return "Морось";
  if (code >= 61 && code <= 67) return "Дождь";
  if (code >= 71 && code <= 77) return "Снег";
  if (code >= 80 && code <= 82) return "Ливневый дождь";
  if (code >= 85 && code <= 86) return "Снегопад";
  if (code === 95) return "Гроза";
  if ([96, 99].includes(code)) return "Гроза с градом";
  return "Нет описания";
}

export async function GET(request) {
  const cityCode = new URL(request.url).searchParams.get("city");
  const city = cities[cityCode];

  if (!city) {
    return Response.json({ error: "Неизвестный город" }, { status: 400 });
  }

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "2",
  }).toString();

  try {
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned ${response.status}`);
    }

    const data = await response.json();
    const daily = data.daily;

    if (
      !daily ||
      !Array.isArray(daily.time) ||
      !Array.isArray(daily.weather_code) ||
      !Array.isArray(daily.temperature_2m_min) ||
      !Array.isArray(daily.temperature_2m_max) ||
      daily.time[1] === undefined ||
      daily.weather_code[1] === undefined ||
      daily.temperature_2m_min[1] === undefined ||
      daily.temperature_2m_max[1] === undefined
    ) {
      throw new Error("Open-Meteo response has no tomorrow forecast");
    }

    return Response.json({
      city: city.name,
      date: daily.time[1],
      temperatureMin: daily.temperature_2m_min[1],
      temperatureMax: daily.temperature_2m_max[1],
      condition: getWeatherDescription(daily.weather_code[1]),
      precipitationProbability: Array.isArray(daily.precipitation_probability_max)
        ? (daily.precipitation_probability_max[1] ?? null)
        : null,
    });
  } catch (error) {
    console.error(
      "Open-Meteo request failed:",
      error instanceof Error ? error.message : error,
    );
    return Response.json({ error: "Не удалось загрузить погоду" }, { status: 500 });
  }
}
