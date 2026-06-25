import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const today = 2; // Wednesday

const schedule = [
  { day: 0, time: "16:00", name: "Шахматы", load: "mental", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { day: 0, time: "18:00", name: "Математика", load: "mental", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { day: 1, time: "17:00", name: "Плавание", load: "physical", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { day: 2, time: "15:30", name: "Робототехника", load: "mental", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { day: 3, time: "16:00", name: "Рисование", load: "creative", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { day: 3, time: "18:30", name: "Английский", load: "mental", color: "bg-green-100 text-green-700 border-green-200" },
  { day: 4, time: "17:00", name: "Плавание", load: "physical", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
];

const dayLoads = [72, 45, 85, 68, 45, 0, 0];

const achievements = [
  { icon: "🔥", title: "Стрик 14 дней", desc: "Не пропускал занятия 2 недели", new: true },
  { icon: "♟️", title: "Шахматный разряд", desc: "Выполнил 3-й юношеский разряд", new: true },
  { icon: "🏊", title: "100 метров", desc: "Проплыл первые 100м без остановки", new: false },
];

const recommendations = [
  {
    name: "Секция программирования",
    org: "IT-школа CodeKids",
    reason: "Высокий логический интеллект + интерес к роботам",
    price: "15 000 ₸/мес",
    distance: "1.2 км",
    match: 94,
  },
  {
    name: "Репетитор по физике",
    org: "Арман Сейткали",
    reason: "Олимпиадная подготовка — следующий шаг после математики",
    price: "5 000 ₸/час",
    distance: "онлайн",
    match: 88,
  },
];

function LoadBadge({ load }: { load: number }) {
  if (load === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const color = load <= 60 ? "text-green-600 bg-green-50" : load <= 80 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${color}`}>{load}%</span>;
}

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Привет, Айгерим 👋</h1>
          <p className="text-muted-foreground mt-1">25 июня · среда · неделя в самом разгаре</p>
        </div>
        <Button asChild>
          <Link href="/talent">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-анализ
          </Link>
        </Button>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>
          <strong>Среда перегружена (85%).</strong> Рекомендуем перенести Робототехнику на пятницу — там нагрузка 45%.
        </span>
        <Button size="sm" variant="outline" className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0">
          Перенести
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Занятий на неделе", value: "7", sub: "+2 от прошлой" },
          { icon: TrendingUp, label: "Нагрузка", value: "63%", sub: "норма" },
          { icon: Trophy, label: "Очков за месяц", value: "2 840", sub: "уровень 12" },
          { icon: Star, label: "Посещаемость", value: "95%", sub: "за 30 дней" },
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
                  <div className={`text-xs mb-1 font-medium ${i === today ? "text-primary" : "text-muted-foreground"}`}>{d}</div>
                  <LoadBadge load={dayLoads[i]} />
                </div>
              ))}
            </div>
            <div className="space-y-1.5 mt-3">
              {schedule.filter(s => s.day === today).map((s, i) => (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded border text-sm ${s.color}`}>
                  <span className="text-xs font-mono">{s.time}</span>
                  <span className="font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Новые достижения</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/achievements">Все <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((a) => (
              <div key={a.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.new && <Badge className="text-[10px] h-4 px-1 bg-primary/10 text-primary">Новое</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              </div>
            ))}

            {/* XP Progress */}
            <div className="pt-2 border-t">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Уровень 12</span>
                <span className="text-muted-foreground">840 / 1000 XP</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">AI-рекомендации</CardTitle>
              <Badge className="bg-primary/10 text-primary text-xs">Claude</Badge>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace">Маркетплейс <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((r) => (
              <div key={r.name} className="border rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.org}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{r.match}%</div>
                    <div className="text-[10px] text-muted-foreground">совпадение</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 mb-3">
                  <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.price}</span>
                  <span>{r.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Coach */}
      <Card className="border-primary/20 bg-primary/2">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">AI-коуч</p>
                <Badge className="bg-primary/10 text-primary text-[10px] h-4">Claude</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Алибек, как прошла тренировка по плаванию вчера? Тренер говорил, что ты хорошо поработал над техникой поворота. Что было сложнее всего?
              </p>
              <Button size="sm" variant="outline" className="mt-2">Ответить коучу</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
