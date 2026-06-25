"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Trophy, Zap } from "lucide-react";

const badges = [
  { id: 1, emoji: "🔥", title: "Стрик 14 дней", desc: "Не пропускал занятия 2 недели подряд", level: "gold", earned: true, date: "24 июня 2026" },
  { id: 2, emoji: "♟️", title: "Шахматный разряд", desc: "Выполнил 3-й юношеский разряд", level: "silver", earned: true, date: "20 июня 2026" },
  { id: 3, emoji: "🏊", title: "100 метров", desc: "Проплыл 100м без остановки", level: "bronze", earned: true, date: "15 июня 2026" },
  { id: 4, emoji: "🤖", title: "Первый робот", desc: "Собрал работающего робота на Arduino", level: "gold", earned: true, date: "10 июня 2026" },
  { id: 5, emoji: "📚", title: "50 занятий", desc: "Посетил 50 занятий на платформе", level: "silver", earned: true, date: "5 мая 2026" },
  { id: 6, emoji: "🎨", title: "Художник", desc: "Завершил первый курс рисования", level: "bronze", earned: true, date: "1 мая 2026" },
  { id: 7, emoji: "⭐", title: "Стрик 30 дней", desc: "30 дней без пропусков", level: "gold", earned: false, date: null },
  { id: 8, emoji: "🏆", title: "Турнирный игрок", desc: "Выиграть первый шахматный турнир", level: "gold", earned: false, date: null },
  { id: 9, emoji: "🚀", title: "Уровень 20", desc: "Достигни уровня 20", level: "silver", earned: false, date: null },
];

const rewardTable = [
  { points: 500, reward: "Поход в кино", progress: 100 },
  { points: 1000, reward: "Новая настольная игра", progress: 100 },
  { points: 2000, reward: "Набор LEGO Technic", progress: 100 },
  { points: 3000, reward: "Поездка в Чарын на выходные", progress: 94 },
  { points: 5000, reward: "Ноутбук для программирования", progress: 57 },
];

const levelData = { current: 12, xp: 840, nextLevelXp: 1000, totalXp: 6840 };

const levelColors: Record<string, string> = {
  gold: "bg-amber-100 border-amber-300",
  silver: "bg-gray-100 border-gray-300",
  bronze: "bg-orange-100 border-orange-300",
};

const levelLabels: Record<string, string> = {
  gold: "Золото",
  silver: "Серебро",
  bronze: "Бронза",
};

export default function AchievementsPage() {
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Достижения
        </h1>
        <p className="text-muted-foreground mt-1">Алибек · {earnedCount} из {badges.length} бейджей</p>
      </div>

      {/* Level card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-primary font-medium">Ур.</div>
                <div className="text-2xl font-bold text-primary">{levelData.current}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Уровень {levelData.current}</span>
                <span className="text-muted-foreground">{levelData.xp} / {levelData.nextLevelXp} XP</span>
              </div>
              <Progress value={(levelData.xp / levelData.nextLevelXp) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                Ещё {levelData.nextLevelXp - levelData.xp} XP до уровня {levelData.current + 1} · Всего {levelData.totalXp.toLocaleString()} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="badges">
        <TabsList>
          <TabsTrigger value="badges">Бейджи</TabsTrigger>
          <TabsTrigger value="rewards">Вознаграждения</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(b => (
              <div
                key={b.id}
                className={`border rounded-xl p-4 text-center transition-all ${
                  b.earned
                    ? `${levelColors[b.level]} hover:shadow-sm`
                    : "bg-muted/30 border-dashed opacity-50"
                }`}
              >
                <div className={`text-3xl mb-2 ${!b.earned ? "grayscale" : ""}`}>{b.emoji}</div>
                <p className="font-semibold text-sm mb-1">{b.title}</p>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{b.desc}</p>
                <div className="flex items-center justify-center gap-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${b.earned ? "" : "opacity-50"}`}
                  >
                    {levelLabels[b.level]}
                  </Badge>
                  {b.earned && (
                    <Badge className="text-[10px] bg-green-50 text-green-700 border-green-200">
                      Получено
                    </Badge>
                  )}
                </div>
                {b.date && <p className="text-[10px] text-muted-foreground mt-1">{b.date}</p>}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Текущий баланс: <strong>2 840 очков</strong>
          </p>
          {rewardTable.map(r => (
            <Card key={r.reward}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{r.reward}</p>
                    <p className="text-xs text-muted-foreground">{r.points} очков</p>
                  </div>
                  {r.progress === 100 ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200">Достигнуто</Badge>
                  ) : (
                    <span className="text-sm font-medium text-primary">{r.progress}%</span>
                  )}
                </div>
                <Progress value={r.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-2">
            {[
              { date: "25 июн", event: "Посещение: Шахматы", xp: "+15 XP", icon: "♟️" },
              { date: "25 июн", event: "Стрик 14 дней", xp: "+150 XP", icon: "🔥" },
              { date: "24 июн", event: "Посещение: Плавание", xp: "+15 XP", icon: "🏊" },
              { date: "24 июн", event: "Посещение: Английский", xp: "+15 XP", icon: "📚" },
              { date: "23 июн", event: "Посещение: Робототехника", xp: "+15 XP", icon: "🤖" },
              { date: "20 июн", event: "Достижение: Шахматный разряд", xp: "+200 XP", icon: "♟️" },
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-8 text-lg text-center">{h.icon}</div>
                <div className="flex-1">
                  <p className="text-sm">{h.event}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <span className="text-sm font-medium text-green-600">{h.xp}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
