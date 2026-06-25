"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";

const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const shortDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const activities = [
  { id: 1, day: 0, time: "16:00", end: "17:00", name: "Шахматы", type: "mental", color: "bg-purple-100 border-purple-200 text-purple-800" },
  { id: 2, day: 0, time: "18:00", end: "19:00", name: "Математика (репетитор)", type: "mental", color: "bg-blue-100 border-blue-200 text-blue-800" },
  { id: 3, day: 1, time: "07:30", end: "08:00", name: "Школа начинается", type: "school", color: "bg-gray-100 border-gray-200 text-gray-700" },
  { id: 4, day: 1, time: "17:00", end: "18:30", name: "Плавание", type: "physical", color: "bg-cyan-100 border-cyan-200 text-cyan-800" },
  { id: 5, day: 2, time: "15:30", end: "17:00", name: "Робототехника", type: "mental", color: "bg-orange-100 border-orange-200 text-orange-800", overloaded: true },
  { id: 6, day: 3, time: "16:00", end: "17:00", name: "Рисование", type: "creative", color: "bg-pink-100 border-pink-200 text-pink-800" },
  { id: 7, day: 3, time: "18:30", end: "19:30", name: "Английский (репетитор)", type: "mental", color: "bg-green-100 border-green-200 text-green-800" },
  { id: 8, day: 4, time: "17:00", end: "18:30", name: "Плавание", type: "physical", color: "bg-cyan-100 border-cyan-200 text-cyan-800" },
];

const loads = [72, 45, 85, 68, 45, 0, 0];

function LoadIndicator({ load }: { load: number }) {
  const color = load <= 60 ? "text-green-600" : load <= 80 ? "text-amber-600" : "text-red-600";
  const barColor = load <= 60 ? "bg-green-500" : load <= 80 ? "bg-amber-500" : "bg-red-500";
  const label = load <= 60 ? "Норма" : load <= 80 ? "Умеренно" : "Перегруз";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={color}>{label}</span>
        <span className="text-muted-foreground">{load}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${load}%` }} />
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(2);
  const dayActivities = activities.filter(a => a.day === activeDay);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Расписание</h1>
          <p className="text-muted-foreground mt-1">Неделя 26 июня — 2 июля 2026</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить занятие
        </Button>
      </div>

      {/* Alert */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span><strong>Среда перегружена (85%).</strong> Рекомендуем перенести Робототехнику на пятницу — там нагрузка 45%.</span>
        <Button size="sm" variant="outline" className="ml-auto border-amber-300 text-amber-700 shrink-0">Перенести</Button>
      </div>

      {/* Week view */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Обзор недели</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {shortDays.map((d, i) => (
              <div
                key={d}
                onClick={() => setActiveDay(i)}
                className={`cursor-pointer rounded-lg p-2 text-center transition-colors ${
                  activeDay === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="text-xs font-medium mb-1">{d}</div>
                <div className={`text-lg font-bold ${activeDay === i ? "" : loads[i] >= 85 ? "text-red-600" : loads[i] >= 61 ? "text-amber-600" : "text-green-600"}`}>
                  {loads[i] > 0 ? `${loads[i]}%` : "—"}
                </div>
                <div className="text-[10px] mt-1 opacity-70">
                  {activities.filter(a => a.day === i).length} зан.
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Day detail */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{days[activeDay]}</h2>
            {loads[activeDay] > 0 && <LoadIndicator load={loads[activeDay]} />}
          </div>

          {dayActivities.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
              Выходной день — занятий нет
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3">
                {dayActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="w-16 text-right shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">{act.time}</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0 relative z-10" />
                    <div className={`flex-1 border rounded-lg px-3 py-2 ${act.color} ${act.overloaded ? "ring-1 ring-amber-400" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{act.name}</span>
                        {act.overloaded && (
                          <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-700">Перегруз</Badge>
                        )}
                      </div>
                      <span className="text-xs opacity-70">{act.time} — {act.end}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rules sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Правила балансировки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              {[
                { ok: true, text: "Не более 2 умственных блоков подряд" },
                { ok: false, text: "Перерыв минимум 45 минут" },
                { ok: true, text: "Минимум 1 выходной без занятий" },
                { ok: true, text: "Физическая нагрузка после умственной" },
                { ok: true, text: "Умственные до 13:00 (жаворонок)" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${r.ok ? "text-green-500" : "text-red-400"}`} />
                  <span className={r.ok ? "" : "line-through text-red-400"}>{r.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Нагрузка за неделю</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {shortDays.map((d, i) => (
                <div key={d} className="flex items-center gap-2 text-xs">
                  <span className="w-5 text-muted-foreground">{d}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        loads[i] <= 60 ? "bg-green-500" : loads[i] <= 80 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${loads[i]}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{loads[i] || "—"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
