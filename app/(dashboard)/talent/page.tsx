"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, Loader2, RefreshCw, Sparkles } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useChildren, ageFromBirthDate } from "@/components/dashboard/children-provider";

const GARDNER = [
  { key: "logical", label: "Логико-математический", short: "Логика", icon: "🧮" },
  { key: "spatial", label: "Пространственный", short: "Простр.", icon: "🗺️" },
  { key: "linguistic", label: "Лингвистический", short: "Речь", icon: "📖" },
  { key: "musical", label: "Музыкальный", short: "Музыка", icon: "🎵" },
  { key: "bodily", label: "Телесно-кинестетический", short: "Тело", icon: "🏃" },
  { key: "interpersonal", label: "Межличностный", short: "Общение", icon: "👥" },
  { key: "intrapersonal", label: "Внутриличностный", short: "Рефлексия", icon: "🪞" },
  { key: "naturalistic", label: "Натуралистический", short: "Природа", icon: "🌿" },
];

interface AiAnalysis {
  summary: string;
  longterm: string;
  advice: string;
}

export default function TalentPage() {
  const { activeChild, loading: childLoading, refresh } = useChildren();
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Show the saved analysis when the active child changes.
  useEffect(() => {
    setAiAnalysis(activeChild?.last_ai_analysis ?? null);
    setError(null);
  }, [activeChild]);

  const scores = activeChild?.intelligence_scores ?? {};
  const hasScores = Object.keys(scores).length > 0;
  const radarData = GARDNER.map((g) => ({ subject: g.short, value: scores[g.key] ?? 40 }));
  const bars = GARDNER.map((g) => ({ ...g, score: scores[g.key] ?? 40 })).sort((a, b) => b.score - a.score);

  async function runAiAnalysis() {
    if (!activeChild) return;
    setLoading(true);
    setError(null);
    try {
      const profile = {
        name: activeChild.name,
        age: ageFromBirthDate(activeChild.birth_date),
        grade: activeChild.grade,
        city: activeChild.city,
        chronotype: activeChild.chronotype,
        learningStyle: activeChild.learning_style,
        socialType: activeChild.social_type,
        interests: activeChild.interests,
        currentActivities: activeChild.current_activities,
        intelligences: scores,
      };

      const res = await fetch("/api/ai/analyze-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, childId: activeChild.id }),
      });

      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setAiAnalysis(data);
      refresh(); // pull the saved analysis into the shared child state
    } catch {
      setError("Не удалось получить анализ. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  if (childLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Загрузка…
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl text-center gap-3">
          <Sparkles className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground">Заполните профиль ребёнка, чтобы построить карту талантов.</p>
          <Button asChild><a href="/onboarding">Заполнить профиль</a></Button>
        </div>
      </div>
    );
  }

  const age = ageFromBirthDate(activeChild.birth_date);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Карта талантов
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeChild.name}{age !== null ? ` · ${age} лет` : ""}
          </p>
        </div>
        <Button onClick={runAiAnalysis} disabled={loading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Анализирую…</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" />Запустить Claude</>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {/* AI analysis */}
      {aiAnalysis ? (
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
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Нажмите «Запустить Claude», чтобы получить персональный анализ талантов {activeChild.name}.
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Радар интеллектов</CardTitle>
          </CardHeader>
          <CardContent>
            {hasScores ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar
                    name={activeChild.name}
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(value) => [`${value}/100`, "Балл"]} contentStyle={{ fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-center text-sm text-muted-foreground">
                Пройдите мини-тест Гарднера в онбординге, чтобы увидеть радар интеллектов.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intelligence bars */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Типы интеллекта (Гарднер)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bars.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.short}</span>
                  </div>
                  <span className="text-sm font-bold">{item.score}</span>
                </div>
                <Progress value={item.score} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Interests & current activities from DB */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Интересы</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChild.interests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeChild.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Не указаны</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Текущие занятия</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChild.current_activities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeChild.current_activities.map((a) => (
                  <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Не указаны</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
