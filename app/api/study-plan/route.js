import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const { topic, days } = body ?? {};

  if (
    typeof topic !== "string" ||
    !topic.trim() ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 14
  ) {
    return Response.json({ error: "Некорректные данные" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) {
    return Response.json(
      { error: "Не удалось получить ответ Gemini" },
      { status: 500 },
    );
  }

  const prompt = `Составь практический план изучения темы «${topic.trim()}» на ${days} дней.

Для каждого дня укажи:
День N — короткая тема
Что изучить: краткое описание
Практика: одно небольшое практическое задание

Сделай ровно ${days} разделов, от Дня 1 до Дня ${days}.
Пиши кратко, понятно и без лишней теории.
Не добавляй вступление и заключение.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    if (typeof response.text !== "string" || !response.text.trim()) {
      throw new Error("Gemini returned an empty plan");
    }

    return Response.json({ plan: response.text });
  } catch (error) {
    console.error("Gemini request failed:", error instanceof Error ? error.message : error);
    return Response.json(
      { error: "Не удалось получить ответ Gemini" },
      { status: 500 },
    );
  }
}
