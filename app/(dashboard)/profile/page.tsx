import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Brain, CheckCircle2, Edit2, Sparkles } from "lucide-react";

const profileSections = [
  { name: "Базовые данные", filled: true, fields: ["Имя", "Возраст", "Пол", "Город", "Класс"] },
  { name: "Физические данные", filled: true, fields: ["Рост", "Вес", "Активность", "Доминирующая рука"] },
  { name: "Психологические тесты", filled: true, fields: ["Тип интеллекта", "Хронотип", "Стиль обучения", "Социальный тип"] },
  { name: "Интересы", filled: true, fields: ["Любимые предметы", "Хобби", "Нелюбимые активности"] },
  { name: "Академическая успеваемость", filled: false, fields: ["Оценки", "Языки", "Олимпиады"] },
  { name: "Генетические данные", filled: false, fields: ["ДНК-тест (опционально)"] },
];

const completed = profileSections.filter(s => s.filled).length;
const total = profileSections.length;
const completionPct = Math.round((completed / total) * 100);

const interests = ["Роботы", "Шахматы", "Математика", "Рисование", "Плавание", "Конструкторы"];
const disliked = ["Публичные выступления", "Пение"];

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Профиль ребёнка</h1>
          <p className="text-muted-foreground mt-1">Чем полнее профиль — тем точнее AI-рекомендации</p>
        </div>
        <Button asChild>
          <Link href="/talent">
            <Sparkles className="w-4 h-4 mr-2" />
            Обновить анализ
          </Link>
        </Button>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">АС</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Алибек Сейтов</h2>
                <Badge variant="secondary">10 лет</Badge>
              </div>
              <p className="text-muted-foreground text-sm">4 класс · Алматы, Бостандыкский р-н</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Хронотип</p>
                  <p className="text-sm font-medium">🌅 Жаворонок</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Тип</p>
                  <p className="text-sm font-medium">👤 Интроверт</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Стиль</p>
                  <p className="text-sm font-medium">👁️ Визуал</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Редактировать
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Полнота профиля</p>
            <span className="text-sm font-bold text-primary">{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="h-2 mb-3" />
          <p className="text-xs text-muted-foreground">
            Заполнено {completed} из {total} разделов. Добавьте оценки и ДНК-данные для более точного анализа.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sections */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Разделы профиля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileSections.map(s => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${s.filled ? "text-green-500" : "text-muted"}`} />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.fields.join(", ")}</p>
                  </div>
                </div>
                {!s.filled && (
                  <Button variant="ghost" size="sm" className="text-primary h-7 text-xs">
                    Заполнить
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interests and intel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Интересы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Любит</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {interests.map(i => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-2">Не любит</p>
              <div className="flex flex-wrap gap-1.5">
                {disliked.map(d => (
                  <Badge key={d} variant="outline" className="text-xs text-muted-foreground">{d}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Текущие занятия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "Шахматы", days: "Пн, Ср", load: "mental" },
                { name: "Плавание", days: "Вт, Пт", load: "physical" },
                { name: "Робототехника", days: "Ср", load: "mental" },
                { name: "Рисование", days: "Чт", load: "creative" },
                { name: "Английский", days: "Чт", load: "mental" },
              ].map(a => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{a.days}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/2">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">Топ-интеллект</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Логико-математический (88/100) — ключевая сильная сторона Алибека.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/talent">
                  Открыть карту талантов
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
