"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useChildren, ageFromBirthDate } from "@/components/dashboard/children-provider";
import {
  Brain,
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Дашборд" },
  { href: "/profile", icon: Brain, label: "Профиль ребёнка" },
  { href: "/talent", icon: Sparkles, label: "Карта талантов", badge: "AI" },
  { href: "/schedule", icon: Calendar, label: "Расписание" },
  { href: "/marketplace", icon: Users, label: "Специалисты" },
  { href: "/achievements", icon: Trophy, label: "Достижения" },
  { href: "/budget", icon: Wallet, label: "Бюджет" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function childMeta(grade: number | null, city: string | null): string {
  const bits = [];
  if (grade) bits.push(`${grade} класс`);
  if (city) bits.push(city);
  return bits.join(" · ") || "Профиль не заполнен";
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { children: kids, activeChild, activeChildId, setActiveChildId, loading } = useChildren();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 border-r bg-sidebar h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-4 border-b">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-base tracking-tight">TalentPath</span>
      </div>

      {/* Child selector */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-xs text-muted-foreground mb-2 px-1">Ребёнок</p>
        {loading ? (
          <div className="h-12 rounded-lg bg-muted/50 animate-pulse" />
        ) : !activeChild ? (
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-2 py-2 rounded-lg bg-primary/5 border border-primary/10 border-dashed hover:bg-primary/10 transition-colors"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">+</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Добавить ребёнка</p>
              <p className="text-xs text-muted-foreground">Заполните профиль</p>
            </div>
          </Link>
        ) : (
          <div className="relative flex items-center gap-2 px-2 py-2 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {initials(activeChild.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {activeChild.name}
                {ageFromBirthDate(activeChild.birth_date) !== null
                  ? `, ${ageFromBirthDate(activeChild.birth_date)} лет`
                  : ""}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {childMeta(activeChild.grade, activeChild.city)}
              </p>
            </div>
            {kids.length > 1 && (
              <select
                aria-label="Выбрать ребёнка"
                value={activeChildId ?? ""}
                onChange={(e) => setActiveChildId(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                {kids.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t pt-3 space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-4 h-4" />
          Настройки
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
