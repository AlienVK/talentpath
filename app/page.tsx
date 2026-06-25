import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Calendar,
  BarChart3,
  CheckCircle,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-анализ талантов",
    description:
      "Claude строит карту из 8 направлений интеллекта по тесту Гарднера и объясняет, почему именно эти секции подходят вашему ребёнку.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Calendar,
    title: "Умное расписание",
    description:
      "Балансирует нагрузку с учётом хронотипа, школы и времени в пути. Предупреждает о перегрузе до того, как он случится.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Wallet,
    title: "Финансовый трекер",
    description:
      "Прозрачная смета всех занятий. Ползунок бюджета — AI сразу перестраивает рекомендации под ваши возможности.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Trophy,
    title: "Мотивация и достижения",
    description:
      "Бейджи, очки, стрики и таблица наград от родителей. Дети видят прогресс — хотят идти на занятия сами.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Маркетплейс специалистов",
    description:
      "Репетиторы, тренеры, педагоги — с верификацией, рейтингом и расписанием. Запись и оплата прямо в приложении.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: MessageCircle,
    title: "AI-коуч",
    description:
      "Еженедельные check-in для ребёнка, разбор неудач без критики. Советы родителям по мотивации именно их ребёнка.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const plans = [
  {
    name: "Free",
    price: "0 ₸",
    period: "навсегда",
    description: "Попробуйте без обязательств",
    features: [
      "1 ребёнок",
      "Базовый профиль",
      "3 AI-рекомендации в месяц",
      "Просмотр расписания",
    ],
    cta: "Начать бесплатно",
    highlight: false,
  },
  {
    name: "Базовый",
    price: "1 990 ₸",
    period: "в месяц",
    description: "Для одной-двух семей",
    features: [
      "2 ребёнка",
      "Полный AI-анализ",
      "Умное расписание",
      "Финансовый трекер",
    ],
    cta: "Выбрать",
    highlight: false,
  },
  {
    name: "Семейный",
    price: "3 490 ₸",
    period: "в месяц",
    description: "Всё для большой семьи",
    features: [
      "До 4 детей",
      "Все функции",
      "Еженедельные AI-отчёты",
      "AI-коуч без ограничений",
    ],
    cta: "Попробовать 7 дней",
    highlight: true,
  },
];

const testimonials = [
  {
    name: "Айгерим Б.",
    role: "мама двоих детей, Алматы",
    text: "Никогда не думала, что приложение поможет мне понять своего ребёнка лучше, чем я сама. Карта талантов просто открыла глаза.",
  },
  {
    name: "Данияр С.",
    role: "папа, Астана",
    text: "Наконец-то могу видеть всё расписание семьи в одном месте и понять, перегружен ли сын. Индикатор нагрузки — находка.",
  },
  {
    name: "Гульнара М.",
    role: "мама, Шымкент",
    text: "Дочка сама следит за своими достижениями и просит не пропускать занятия. Мотивационная система работает.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">TalentPath</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Отзывы</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/onboarding">Начать бесплатно</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 px-4">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Zap className="w-3 h-3 mr-1" />
              На базе Claude AI
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Раскройте таланты{" "}
              <span className="text-primary">вашего ребёнка</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AI строит персональный план развития: подбирает секции под характер и интересы,
              балансирует нагрузку, считает бюджет и мотивирует ребёнка идти вперёд.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="min-w-48" asChild>
                <Link href="/onboarding">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Создать профиль ребёнка
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Посмотреть демо</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Бесплатно · Без карты · Алматы, Астана, Шымкент
            </p>
          </div>

          {/* Stats */}
          <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6">
            {[
              { value: "3.5M+", label: "детей в Казахстане" },
              { value: "8", label: "направлений таланта" },
              { value: "AI", label: "Claude анализирует профиль" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-4">Всё, что нужно для осознанного развития</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Не просто каталог кружков — персональный AI-план, который учитывает характер,
                нагрузку, географию и бюджет вашей семьи.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} className="border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-2`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: Target,
                  title: "Создайте профиль",
                  desc: "Заполните данные ребёнка: возраст, интересы, хронотип, расписание школы. Пройдите мини-тест множественного интеллекта.",
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "Claude анализирует",
                  desc: "AI строит карту талантов из 8 направлений и подбирает секции с учётом геолокации, нагрузки и бюджета.",
                },
                {
                  step: "03",
                  icon: BarChart3,
                  title: "Растёте вместе",
                  desc: "Следите за прогрессом, мотивируйте достижениями, корректируйте план в реальном времени.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs font-mono text-primary mb-2">{item.step}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-4">Простые и честные тарифы</h2>
              <p className="text-muted-foreground">Годовая оплата — скидка 20%</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${plan.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}`}
                >
                  {plan.highlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Популярный
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/onboarding">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-4">Родители уже видят результат</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} className="border">
                  <CardContent className="pt-6">
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div>
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Алматы · Астана · Шымкент</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Начните раскрывать таланты прямо сейчас
            </h2>
            <p className="text-muted-foreground mb-8">
              Создайте профиль ребёнка за 5 минут. Бесплатно, без карты.
            </p>
            <Button size="lg" className="min-w-56" asChild>
              <Link href="/onboarding">
                <Sparkles className="w-4 h-4 mr-2" />
                Создать профиль
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">TalentPath</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 TalentPath · Казахстан · Все права защищены
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            Данные защищены по законодательству РК
          </div>
        </div>
      </footer>
    </div>
  );
}
