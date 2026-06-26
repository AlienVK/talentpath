"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trophy, Trash2 } from "lucide-react";
import { useChildren } from "@/components/dashboard/children-provider";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  type: string;
  points: number;
  badge_level: string;
  earned_at: string;
}

const levelColors: Record<string, string> = {
  gold: "bg-amber-100 border-amber-300",
  silver: "bg-gray-100 border-gray-300",
  bronze: "bg-orange-100 border-orange-300",
};
const levelLabels: Record<string, string> = { gold: "Золото", silver: "Серебро", bronze: "Бронза" };
const levelEmoji: Record<string, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };

const XP_PER_LEVEL = 500;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function AchievementsPage() {
  const { activeChild, loading: childLoading } = useChildren();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", badgeLevel: "bronze", points: "50" });

  const load = useCallback(async () => {
    if (!activeChild) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/achievements?childId=${activeChild.id}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [activeChild]);

  useEffect(() => {
    load();
  }, [load]);

  const totalXp = items.reduce((s, a) => s + (a.points || 0), 0);
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpInLevel = totalXp % XP_PER_LEVEL;

  async function addAchievement() {
    if (!activeChild || !form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: activeChild.id,
          title: form.title.trim(),
          description: form.description.trim() || null,
          badgeLevel: form.badgeLevel,
          points: form.points,
          type: "badge",
        }),
      });
      if (res.ok) {
        setDialogOpen(false);
        setForm({ title: "", description: "", badgeLevel: "bronze", points: "50" });
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeAchievement(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/achievements/${id}`, { method: "DELETE" });
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
          <Trophy className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground">Сначала добавьте ребёнка, чтобы отмечать достижения.</p>
          <Button asChild><a href="/onboarding">Заполнить профиль</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Достижения
          </h1>
          <p className="text-muted-foreground mt-1">{activeChild.name} · {items.length} бейджей</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Отметить достижение
        </Button>
      </div>

      {/* Level card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-primary font-medium">Ур.</div>
                <div className="text-2xl font-bold text-primary">{level}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Уровень {level}</span>
                <span className="text-muted-foreground">{xpInLevel} / {XP_PER_LEVEL} XP</span>
              </div>
              <Progress value={(xpInLevel / XP_PER_LEVEL) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                Ещё {XP_PER_LEVEL - xpInLevel} XP до уровня {level + 1} · Всего {totalXp.toLocaleString("ru-RU")} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl text-center gap-2">
          <p className="text-muted-foreground text-sm">Пока нет достижений.</p>
          <p className="text-xs text-muted-foreground">Отмечайте успехи ребёнка — они копят XP и повышают уровень.</p>
        </div>
      ) : (
        <Tabs defaultValue="badges">
          <TabsList>
            <TabsTrigger value="badges">Бейджи</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((b) => (
                <div
                  key={b.id}
                  className={`group relative border rounded-xl p-4 text-center transition-all hover:shadow-sm ${levelColors[b.badge_level] ?? levelColors.bronze}`}
                >
                  <button
                    onClick={() => removeAchievement(b.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600"
                    aria-label="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-3xl mb-2">{levelEmoji[b.badge_level] ?? "🏅"}</div>
                  <p className="font-semibold text-sm mb-1">{b.title}</p>
                  {b.description && <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{b.description}</p>}
                  <div className="flex items-center justify-center gap-1">
                    <Badge variant="outline" className="text-[10px]">{levelLabels[b.badge_level] ?? "Бронза"}</Badge>
                    <Badge className="text-[10px] bg-green-50 text-green-700 border-green-200">+{b.points} XP</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDate(b.earned_at)}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-2">
              {items.map((h) => (
                <div key={h.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="w-8 text-lg text-center">{levelEmoji[h.badge_level] ?? "🏅"}</div>
                  <div className="flex-1">
                    <p className="text-sm">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(h.earned_at)}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">+{h.points} XP</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Add achievement dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое достижение</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Название</label>
              <Input
                placeholder="Например: Шахматный разряд"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Описание (необязательно)</label>
              <Input
                placeholder="Выполнил 3-й юношеский разряд"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Уровень</label>
                <select
                  value={form.badgeLevel}
                  onChange={(e) => setForm({ ...form, badgeLevel: e.target.value })}
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="bronze">🥉 Бронза</option>
                  <option value="silver">🥈 Серебро</option>
                  <option value="gold">🥇 Золото</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Очки (XP)</label>
                <Input
                  type="number"
                  min="0"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addAchievement} disabled={saving || !form.title.trim()}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Сохраняю…</> : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
