import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Ты — детский психолог и эксперт по развитию talentов. Проанализируй профиль ребёнка и дай краткий анализ на русском языке.

Профиль ребёнка:
${JSON.stringify(profile, null, 2)}

Ответь строго в формате JSON:
{
  "summary": "2-3 предложения об общем портрете ребёнка и его главных сильных сторонах",
  "longterm": "1-2 предложения о вероятных сферах интереса через 5-10 лет (не прогноз, а зона вероятного интереса)",
  "advice": "1-2 конкретных совета родителям по развитию именно этого ребёнка прямо сейчас"
}

Только JSON, без markdown блоков.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("AI analyze error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
