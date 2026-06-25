"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const talentData = [
  { subject: "Логика", value: 88, fullMark: 100 },
  { subject: "Творчество", value: 72, fullMark: 100 },
  { subject: "Физика", value: 65, fullMark: 100 },
  { subject: "Общение", value: 58, fullMark: 100 },
  { subject: "Музыка", value: 45, fullMark: 100 },
  { subject: "Природа", value: 70, fullMark: 100 },
  { subject: "Рефлексия", value: 80, fullMark: 100 },
  { subject: "Пространство", value: 76, fullMark: 100 },
];

const intelligences = [
  { name: "Логико-математический", score: 88, color: "bg-purple-500", icon: "🧮", desc: "Сильная аналитика, любит задачи с правилами" },
  { name: "Внутриличностный", score: 80, color: "bg-indigo-500", icon: "🪞", desc: "Хорошо понимает свои эмоции и мотивацию" },
  { name: "Творческий", score: 72, color: "bg-pink-500", icon: "🎨", desc: "Выражает идеи через образы и конструкции" },
  { name: "Натуралистический", score: 70, color: "bg-green-500", icon: "🌿", desc: "Замечает паттерны в природе, интерес к науке" },
  { name: "Пространственный", score: 76, color: "bg-blue-500", icon: "🗺️", desc: "Думает образами, хорошо с роботами и 3D" },
  { name: "Телесно-кинестетический", score: 65, color: "bg-cyan-500", icon: "🏃", desc: "Учится через движение и практику" },
  { name: "Межличностный", score: 58, color: "bg-amber-500", icon: "👥", desc: "Предпочитает индивидуальную работу" },
  { name: "Музыкальный", score: 45, color: "bg-red-400", icon: "🎵", desc: "Минимальный интерес к ритму и звукам" },
];

const topDirections = [
  {
    title: "Программирование и робототехника",
    match: 94,
    reason: "Логический интеллект (88%) + пространственное мышление (76%) + интерес к конструированию. Алибек уже посещает робототехнику — углубление даст быстрый результат.",
    sections: ["Олимпиадное программирование", "Arduino-мастерская", "Scratch/Python клубы"],
    emoji: "🤖",
  },
  {
    title: "Математика и физика",
    match: 87,
    reason: "Высокий логический интеллект и рефлексия указывают на способность к абстрактному мышлению. Рекомендуется олимпиадный трек.",
    sections: ["Кенгуру / Олимпиады", "Физический кружок", "Репетитор по ЕНТ-математике"],
    emoji: "🔬",
  },
  {
    title: "Шахматы (углубление)",
    match: 82,
    reason: "Уже занимается, есть 3-й разряд. Логика и рефлексия — идеальное сочетание для турнирного шахматиста.",
    sections: ["Турнирная подготовка", "Онлайн-разборы с тренером"],
    emoji: "♟️",
  },
];

const warnings = [
  { type: "warning", text: "Социальный интеллект ниже нормы — рекомендуем групповые форматы хотя бы раз в неделю" },
  { type: "info", text: "Хронотип — «жаворонок». Умственные задачи лучше планировать до 13:00" },
  { type: "warning", text: "Среда перегружена (85%) — физическое занятие лучше перенести" },
];

interface AiAnalysis {
  summary: string;
  longterm: string;
  advice: string;
}

export default function TalentPage() {
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAiAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const profile = {
        name: "Алибек",
        age: 10,
        grade: 4,
        city: "Алматы",
        chronotype: "жаворонок",
        learningStyle: "визуал",
        socialType: "интроверт",
        interests: ["роботы", "шахматы", "математика", "рисование", "плавание"],
        dislikedActivities: ["пение", "публичные выступления"],
        currentActivities: ["шахматы", "плавание", "робототехника", "рисование"],
        intelligences: {
          logical: 88,
          intrapersonal: 80,
          spatial: 76,
          naturalistic: 70,
          creative: 72,
          bodily: 65,
          interpersonal: 58,
          musical: 45,
        },
        academicStrengths: ["математика", "физика", "информатика"],
        budget: 50000,
      };

      const res = await fetch("/api/ai/analyze-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      setError("Не удалось получить анализ. Проверьте ANTHROPIC_API_KEY в .env.local");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Карта талантов
          </h1>
          <p className="text-muted-foreground mt-1">Алибек · 10 лет · обновлено сегодня</p>
        </div>
        <Button onClick={runAiAnalysis} disabled={loading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Анализирую...</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" />Запустить Claude</>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* AI Analysis result */}
      {aiAnalysis && (
        <Card className="border-primary/30 bg-primary/2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <CardTitle className="text-base">Анализ Claude AI</CardTitle>
              <Badge className="bg-primary/10 text-primary text-xs">claude-sonnet-4-6</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <div>
              <p className="font-medium text-foreground mb-1">Общий вывод</p>
              <p>{aiAnalysis.summary}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-foreground mb-1">Долгосрочный горизонт</p>
              <p>{aiAnalysis.longterm}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-foreground mb-1">Рекомендация родителям</p>
              <p>{aiAnalysis.advice}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Радар интеллектов</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={talentData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar
                  name="Алибек"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(value) => [`${value}/100`, "Балл"]}
                  contentStyle={{ fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Intelligence bars */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Типы интеллекта (Гарднер)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {intelligences
              .sort((a, b) => b.score - a.score)
              .map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.name.split(" ")[0]}</span>
                    </div>
                    <span className="text-sm font-bold">{item.score}</span>
                  </div>
                  <Progress value={item.score} className="h-1.5" />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Top directions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Топ-3 направления для развития</h2>
        <div className="space-y-4">
          {topDirections.map((dir, i) => (
            <Card key={dir.title} className="border hover:border-primary/30 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                    {dir.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{i + 1}</span>
                      <h3 className="font-semibold text-sm">{dir.title}</h3>
                      <Badge className="ml-auto bg-green-50 text-green-700 border-green-200 text-xs">
                        {dir.match}% совпадение
                      </Badge>
                    </div>
                    <div className="flex items-start gap-1.5 mb-2">
                      <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{dir.reason}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dir.sections.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Warnings */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Предупреждения AI</h2>
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${
                w.type === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
              }`}
            >
              <span className="shrink-0">{w.type === "warning" ? "⚠️" : "ℹ️"}</span>
              {w.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
