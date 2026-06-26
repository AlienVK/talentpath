"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useChildren } from "@/components/dashboard/children-provider";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const typeColors: Record<string, string> = {
  mental: "bg-purple-100 text-purple-700 border-purple-200",
  physical: "bg-cyan-100 text-cyan-700 border-cyan-200",
  creative: "bg-pink-100 text-pink-700 border-pink-200",
  school: "bg-gray-100 text-gray-700 border-gray-200",
  other: "bg-blue-100 text-blue-700 border-blue-200",
};
const levelEmoji: Record<string, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };

interface Activity { id: string; name: string; type: string; days: string[]; time_start: string | null; time_end: string | null; }
interface Achievement { id: string; title: string; description: string | null; points: number; badge_level: string; }

function mins(t: string | null) { if (!t) return 0; const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); }
function dayLoad(acts: Activity[]) {
  const total = acts.reduce((s, a) => { const d = mins(a.time_end) - mins(a.time_start); return s + (d > 0 ? d : 60); }, 0);
  return Math.min(100, Math.round((total / 180) * 100));
}

function LoadBadge({ load }: { load: number }) {
  if (load === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const color = load <= 60 ? "text-green-600 bg-green-50" : load <= 80 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${color}`}>{load}%</span>;
}

export default function DashboardPage() {
  const { activeChild, loading: childLoading } = useChildren();
  const [parentName, setParentName] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => {
    fetch("/api/profile").then(r => r.ok ? r.json() : null).then(p => { if (p?.name) setParentName(p.name); }).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    if (!activeChild) { setActivities([]); setAchievements([]); setLoading(false); return; }
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        fetch(`/api/activities?childId=${activeChild.id}`).then(r => r.json()),
        fetch(`/api/achievements?childId=${activeChild.id}`).then(r => r.json()),
      ]);
      setActivities(Array.isArray(a) ? a : []);
      setAchievements(Array.isArray(b) ? b : []);
    } finally {
      setLoading(false);
    }
  }, [activeChild]);

  useEffect(() => { load(); }, [load]);

  function onDay(d: number) {
    return activities.filter(a => a.days.map(Number).includes(d)).sort((x, y) => mins(x.time_start) - mins(y.time_start));
  }
  const dayLoads = weekDays.map((_, i) => dayLoad(onDay(i)));
  const weeklyCount = activities.reduce((s, a) => s + a.days.length, 0);
  const activeLoads = dayLoads.filter(l => l > 0);
  const avgLoad = activeLoads.length ? Math.round(activeLoads.reduce((s, l) => s + l, 0) / activeLoads.length) : 0;
  const totalXp = achievements.reduce((s, a) => s + (a.points || 0), 0);
  const level = Math.floor(totalXp / 500) + 1;
  const xpInLevel = totalXp % 500;

  if (childLoading) {
    return <div className="p-6 flex items-center justify-center h-64 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Загрузка…</div>;
  }

  const greeting = parentName ? `Привет, ${parentName} 👋` : "Привет 👋";

  if (!activeChild) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{greeting}</h1>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl text-center gap-3">
          <Sparkles className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground">Добавьте профиль ребёнка, чтобы начать.</p>
          <Button asChild><Link href="/onboarding">Заполнить профиль</Link></Button>
        </div>
      </div>
    );
  }

  const todayActs = onDay(todayIdx);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting}</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" })} · профиль {activeChild.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/talent"><Sparkles className="w-4 h-4 mr-2" />AI-анализ</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Занятий на неделе", value: String(weeklyCount), sub: `${activities.length} секций` },
          { icon: TrendingUp, label: "Средняя нагрузка", value: avgLoad ? `${avgLoad}%` : "—", sub: avgLoad <= 60 ? "норма" : avgLoad <= 80 ? "умеренно" : "высокая" },
          { icon: Trophy, label: "Очков всего", value: totalXp.toLocaleString("ru-RU"), sub: `уровень ${level}` },
          { icon: Star, label: "Достижений", value: String(achievements.length), sub: "получено" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly schedule mini */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Расписание недели</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/schedule">Открыть <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekDays.map((d, i) => (
                <div key={d} className="text-center">
                  <div className={`text-xs mb-1 font-medium ${i === todayIdx ? "text-primary" : "text-muted-foreground"}`}>{d}</div>
                  <LoadBadge load={dayLoads[i]} />
                </div>
              ))}
            </div>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            ) : todayActs.length > 0 ? (
              <div className="space-y-1.5 mt-3">
                {todayActs.map((s) => (
                  <div key={s.id} className={`flex items-center gap-2 px-2 py-1.5 rounded border text-sm ${typeColors[s.type] ?? typeColors.other}`}>
                    <span className="text-xs font-mono">{s.time_start ?? "—"}</span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-3">Сегодня занятий нет</p>
            )}
          </CardContent>
        </Card>

        {/* Achievements mini */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Достижения</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/achievements">Все <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            ) : achievements.length > 0 ? (
              <>
                {achievements.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                      {levelEmoji[a.badge_level] ?? "🏅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.title}</p>
                      {a.description && <p className="text-xs text-muted-foreground truncate">{a.description}</p>}
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Уровень {level}</span>
                    <span className="text-muted-foreground">{xpInLevel} / 500 XP</span>
                  </div>
                  <Progress value={(xpInLevel / 500) * 100} className="h-2" />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-3">
                Пока нет достижений. <Link href="/achievements" className="text-primary hover:underline">Отметить первое</Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI summary / CTA */}
      <Card className="border-primary/20 bg-primary/2">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">Карта талантов</p>
                <Badge className="bg-primary/10 text-primary text-[10px] h-4">Claude</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activeChild.last_ai_analysis?.summary
                  ?? `Запустите AI-анализ, чтобы Claude построил персональную карту талантов для ${activeChild.name}.`}
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link href="/talent">Открыть карту талантов</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
