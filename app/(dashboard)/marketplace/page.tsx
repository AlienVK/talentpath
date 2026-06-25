"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  MessageCircle,
  Search,
  Star,
  Verified,
  Zap,
} from "lucide-react";

const categories = ["Все", "Репетиторы", "Спорт", "Творчество", "IT", "Языки"];

const specialists = [
  {
    id: 1,
    name: "Арман Сейткали",
    category: "Репетиторы",
    specialization: "Математика, Физика",
    rating: 4.9,
    reviews: 47,
    price: "5 000 ₸/час",
    format: ["Онлайн", "Очно"],
    district: "Бостандыкский р-н",
    verified: true,
    match: 88,
    reason: "Олимпиадная подготовка — сильный профиль по математике",
    initials: "АС",
    color: "bg-purple-100 text-purple-700",
    available: true,
  },
  {
    id: 2,
    name: "IT-школа CodeKids",
    category: "IT",
    specialization: "Python, Scratch, Arduino",
    rating: 4.8,
    reviews: 124,
    price: "15 000 ₸/мес",
    format: ["Очно"],
    district: "Медеуский р-н · 1.2 км",
    verified: true,
    match: 94,
    reason: "Логический интеллект 88% + интерес к роботам = идеальное совпадение",
    initials: "CK",
    color: "bg-blue-100 text-blue-700",
    available: true,
  },
  {
    id: 3,
    name: "Динара Нурланова",
    category: "Творчество",
    specialization: "Рисование, Акварель",
    rating: 4.7,
    reviews: 31,
    price: "4 000 ₸/занятие",
    format: ["Очно", "Выезд"],
    district: "Алатауский р-н · 3.5 км",
    verified: true,
    match: 72,
    reason: "Творческий интеллект активен, рисование уже в расписании",
    initials: "ДН",
    color: "bg-pink-100 text-pink-700",
    available: false,
  },
  {
    id: 4,
    name: "Акылбек Жанузаков",
    category: "Спорт",
    specialization: "Плавание",
    rating: 5.0,
    reviews: 89,
    price: "12 000 ₸/мес",
    format: ["Очно"],
    district: "Бассейн «Динамо» · 0.8 км",
    verified: true,
    match: 65,
    reason: "Уже посещает — повышение индивидуальных занятий ускорит прогресс",
    initials: "АЖ",
    color: "bg-cyan-100 text-cyan-700",
    available: true,
  },
  {
    id: 5,
    name: "Skyeng Казахстан",
    category: "Языки",
    specialization: "Английский язык",
    rating: 4.6,
    reviews: 312,
    price: "6 500 ₸/занятие",
    format: ["Онлайн"],
    district: "Онлайн",
    verified: true,
    match: 70,
    reason: "Уровень A2 → B1 через игровую методику, интроверту комфортно онлайн",
    initials: "SK",
    color: "bg-green-100 text-green-700",
    available: true,
  },
  {
    id: 6,
    name: "Шахматный клуб «Гроссмейстер»",
    category: "Спорт",
    specialization: "Шахматы, Турнирная подготовка",
    rating: 4.9,
    reviews: 67,
    price: "10 000 ₸/мес",
    format: ["Очно"],
    district: "Центр · 2.1 км",
    verified: true,
    match: 82,
    reason: "Уже занимается, есть 3-й разряд — турнирная секция следующий шаг",
    initials: "ГМ",
    color: "bg-amber-100 text-amber-700",
    available: true,
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = specialists.filter(s => {
    const matchCat = activeCategory === "Все" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.specialization.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Маркетплейс специалистов</h1>
        <p className="text-muted-foreground mt-1">Репетиторы, тренеры и педагоги Алматы — с AI-подбором под профиль Алибека</p>
      </div>

      {/* Search and filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или специализации..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">Фильтры</Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <Button
            key={c}
            size="sm"
            variant={activeCategory === c ? "default" : "outline"}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* AI hint */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm">
        <Zap className="w-4 h-4 text-primary shrink-0" />
        <span className="text-muted-foreground">
          Показываю специалистов, подходящих профилю <strong>Алибека</strong>. Сортировка по совпадению AI.
        </span>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered
          .sort((a, b) => b.match - a.match)
          .map(s => (
            <Card key={s.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`text-sm font-bold ${s.color}`}>{s.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-sm">{s.name}</p>
                      {s.verified && <Verified className="w-3.5 h-3.5 text-primary" />}
                      <Badge
                        className={`ml-auto text-xs ${s.match >= 85 ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}`}
                      >
                        {s.match}% AI
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{s.rating}</span>
                      <span className="text-xs text-muted-foreground">({s.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* AI reason */}
                <div className="flex items-start gap-1.5 mb-3">
                  <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                </div>

                <Separator className="mb-3" />

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {s.district}
                  </div>
                  <div className="flex gap-1">
                    {s.format.map(f => (
                      <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{s.price}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      Написать
                    </Button>
                    <Button size="sm" disabled={!s.available}>
                      {s.available ? "Записаться" : "Занято"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
