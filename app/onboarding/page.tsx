"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  { id: 1, title: "Основная информация", desc: "Расскажите о ребёнке" },
  { id: 2, title: "Интересы и хобби", desc: "Что нравится?" },
  { id: 3, title: "Школа и нагрузка", desc: "Текущее расписание" },
  { id: 4, title: "Тест интеллекта", desc: "Мини-тест Гарднера" },
  { id: 5, title: "Готово!", desc: "Запускаем AI-анализ" },
];

const intelligenceQuestions = [
  {
    question: "Как ребёнок предпочитает решать новую задачу?",
    options: [
      { text: "Думает логически, ищет закономерности", type: "logical" },
      { text: "Рисует схему или представляет в голове", type: "spatial" },
      { text: "Обсуждает с кем-то, думает вслух", type: "interpersonal" },
      { text: "Пробует физически, делает руками", type: "bodily" },
    ],
  },
  {
    question: "Любимое занятие в свободное время?",
    options: [
      { text: "Читает, пишет, придумывает истории", type: "linguistic" },
      { text: "Собирает конструкторы или технику", type: "spatial" },
      { text: "Слушает музыку или поёт", type: "musical" },
      { text: "Занимается спортом или танцует", type: "bodily" },
    ],
  },
  {
    question: "Как ребёнок лучше всего запоминает?",
    options: [
      { text: "Через объяснения и рассуждения", type: "logical" },
      { text: "Через картинки и схемы", type: "spatial" },
      { text: "Через ритм, мелодию, стихи", type: "musical" },
      { text: "Через практику и движение", type: "bodily" },
    ],
  },
];

const chronotypes = [
  { id: "morning", emoji: "🌅", label: "Жаворонок", desc: "Активен утром, устаёт к вечеру" },
  { id: "neutral", emoji: "☀️", label: "Голубь", desc: "Одинаково активен весь день" },
  { id: "evening", emoji: "🌙", label: "Сова", desc: "Оживляется к вечеру" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("Алматы");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [chronotype, setChronotype] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const allInterests = [
    "Математика", "Программирование", "Роботы", "Шахматы",
    "Рисование", "Музыка", "Танцы", "Театр",
    "Плавание", "Футбол", "Единоборства", "Гимнастика",
    "Чтение", "Иностранные языки", "Природа", "Готовка",
  ];

  const toggleInterest = (i: string) => {
    setSelectedInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md h-14 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">TalentPath</span>
        </Link>
        <div className="flex-1 mx-8">
          <Progress value={progress} className="h-1.5" />
        </div>
        <span className="text-sm text-muted-foreground">Шаг {step} из {steps.length}</span>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Step header */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3">Шаг {step} — {steps[step - 1].title}</Badge>
            <h1 className="text-2xl font-bold">{steps[step - 1].desc}</h1>
          </div>

          {/* Step 1: Basic info */}
          {step === 1 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Имя ребёнка</label>
                  <Input
                    placeholder="Например: Алибек"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Возраст</label>
                  <Input
                    placeholder="Например: 10"
                    type="number"
                    min="5"
                    max="16"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Город</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Алматы", "Астана", "Шымкент", "Другой"].map(c => (
                      <Button
                        key={c}
                        size="sm"
                        variant={city === c ? "default" : "outline"}
                        onClick={() => setCity(c)}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Хронотип</label>
                  <div className="grid grid-cols-3 gap-2">
                    {chronotypes.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setChronotype(c.id)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          chronotype === c.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                        }`}
                      >
                        <div className="text-2xl mb-1">{c.emoji}</div>
                        <div className="text-xs font-medium">{c.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">Выберите всё, что нравится (можно несколько)</p>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map(i => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        selectedInterests.includes(i)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted border-border"
                      }`}
                    >
                      {selectedInterests.includes(i) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {i}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Выбрано: {selectedInterests.length}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 3: School */}
          {step === 3 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Класс</label>
                  <div className="flex gap-2 flex-wrap">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map(g => (
                      <Button key={g} size="sm" variant="outline" className="w-10">{g}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Текущие секции/кружки</label>
                  <Input placeholder="Например: Шахматы, Плавание, Рисование" />
                  <p className="text-xs text-muted-foreground mt-1">Через запятую</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ежемесячный бюджет на занятия</label>
                  <div className="flex gap-2 flex-wrap">
                    {["до 30 000 ₸", "30–60 000 ₸", "60–100 000 ₸", "100 000+ ₸"].map(b => (
                      <Button key={b} size="sm" variant="outline">{b}</Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Intelligence test */}
          {step === 4 && (
            <div className="space-y-4">
              {intelligenceQuestions.map((q, qi) => (
                <Card key={qi}>
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-3">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((o, oi) => (
                        <button
                          key={oi}
                          onClick={() => setAnswers(prev => ({ ...prev, [qi]: o.type }))}
                          className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                            answers[qi] === o.type
                              ? "border-primary bg-primary/5 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {o.text}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Профиль создан!</h2>
                  <p className="text-muted-foreground text-sm">
                    Claude AI анализирует данные {name || "ребёнка"} и строит персональную карту талантов.
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-left space-y-1">
                  <p>✅ Базовый профиль</p>
                  <p>✅ Интересы: {selectedInterests.length} выбрано</p>
                  <p>✅ Тест интеллекта пройден</p>
                  <p>⏳ AI-анализ запускается...</p>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/talent">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Открыть карту талантов
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Nav */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button
              onClick={() => setStep(s => Math.min(steps.length, s + 1))}
              disabled={step === steps.length}
            >
              {step === steps.length - 1 ? "Завершить" : "Далее"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
