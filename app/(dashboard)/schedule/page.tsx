"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, CalendarDays } from "lucide-react";
import { useChildren } from "@/components/dashboard/children-provider";

const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const shortDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const activityTypes = [
  { value: "mental", label: "Умственное", color: "bg-purple-100 border-purple-200 text-purple-800" },
  { value: "physical", label: "Физическое", color: "bg-cyan-100 border-cyan-200 text-cyan-800" },
  { value: "creative", label: "Творческое", color: "bg-pink-100 border-pink-200 text-pink-800" },
  { value: "school", label: "Школа", color: "bg-gray-100 border-gray-200 text-gray-700" },
  { value: "other", label: "Другое", color: "bg-blue-100 border-blue-200 text-blue-800" },
];

function typeColor(type: string): string {
  return activityTypes.find((t) => t.value === type)?.color ?? activityTypes[4].color;
}

interface Activity {
  id: string;
  name: string;
  type: string;
  days: string[];
  time_start: string | null;
  time_end: string | null;
  address: string | null;
  price: number | null;
}

function minutes(t: string | null): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Daily load %: 3h of activities ≈ 100%.
function dayLoad(acts: Activity[]): number {
  const total = acts.reduce((sum, a) => {
    const dur = minutes(a.time_end) - minutes(a.time_start);
    return sum + (dur > 0 ? dur : 60); // assume 60 min if no times
  }, 0);
  return Math.min(100, Math.round((total / 180) * 100));
}

export default function SchedulePage() {
  const { activeChild, loading: childLoading } = useChildren();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add-activity form state
  const [form, setForm] = useState({
    name: "",
    type: "mental",
    days: [] as number[],
    timeStart: "16:00",
    timeEnd: "17:00",
  });

  const load = useCallback(async () => {
    if (!activeChild) {
      setActivities([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/activities?childId=${activeChild.id}`);
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [activeChild]);

  useEffect(() => {
    load();
  }, [load]);

  // Activities occurring on a given weekday index (0=Mon..6=Sun)
  function onDay(d: number): Activity[] {
    return activities
      .filter((a) => a.days.map(Number).includes(d))
      .sort((x, y) => minutes(x.time_start) - minutes(y.time_start));
  }

  const loads = shortDays.map((_, i) => dayLoad(onDay(i)));

  async function addActivity() {
    if (!activeChild || !form.name.trim() || form.days.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: activeChild.id,
          name: form.name.trim(),
          type: form.type,
          days: form.days,
          timeStart: form.timeStart,
          timeEnd: form.timeEnd,
        }),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ name: "", type: "mental", days: [], timeStart: "16:00", timeEnd: "17:00" });
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeActivity(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id)); // optimistic
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
  }

  function toggleDay(d: number) {
    setForm((f) => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d],
    }));
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
          <CalendarDays className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground">Сначала добавьте ребёнка, чтобы планировать расписание.</p>
          <Button asChild><a href="/onboarding">Заполнить профиль</a></Button>
        </div>
      </div>
    );
  }

  const dayActivities = onDay(activeDay);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Расписание</h1>
          <p className="text-muted-foreground mt-1">{activeChild.name} · недельный план занятий</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить занятие
        </Button>
      </div>

      {/* Week overview */}
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
                <div className={`text-lg font-bold ${activeDay === i ? "" : loads[i] >= 85 ? "text-red-600" : loads[i] >= 61 ? "text-amber-600" : loads[i] > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                  {loads[i] > 0 ? `${loads[i]}%` : "—"}
                </div>
                <div className="text-[10px] mt-1 opacity-70">{onDay(i).length} зан.</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day detail */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{days[activeDay]}</h2>
          {loads[activeDay] >= 85 && (
            <Badge variant="outline" className="border-red-300 text-red-600">Перегруз {loads[activeDay]}%</Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : dayActivities.length === 0 ? (
          <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
            Занятий нет — нажмите «Добавить занятие»
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-3">
              {dayActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 group">
                  <div className="w-16 text-right shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">{act.time_start ?? "—"}</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0 relative z-10" />
                  <div className={`flex-1 border rounded-lg px-3 py-2 ${typeColor(act.type)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{act.name}</span>
                      <button
                        onClick={() => removeActivity(act.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {(act.time_start || act.time_end) && (
                      <span className="text-xs opacity-70">{act.time_start} — {act.time_end}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add activity dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое занятие</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Название</label>
              <Input
                placeholder="Например: Шахматы"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Тип</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              >
                {activityTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Дни недели</label>
              <div className="flex gap-1">
                {shortDays.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`flex-1 h-9 rounded-md text-xs font-medium border transition-colors ${
                      form.days.includes(i)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Начало</label>
                <Input type="time" value={form.timeStart} onChange={(e) => setForm({ ...form, timeStart: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Конец</label>
                <Input type="time" value={form.timeEnd} onChange={(e) => setForm({ ...form, timeEnd: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={addActivity}
              disabled={saving || !form.name.trim() || form.days.length === 0}
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Сохраняю…</> : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
