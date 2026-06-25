"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === "User already registered" ? "Этот email уже зарегистрирован" : error.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setDone(true);
    } else {
      router.push("/onboarding");
      router.refresh();
    }

    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold">Проверьте почту</h1>
          <p className="text-muted-foreground text-sm">
            Мы отправили письмо на <strong>{email}</strong>. Перейдите по ссылке в письме для подтверждения.
          </p>
          <Button asChild><Link href="/login">Войти</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TalentPath</span>
          </Link>
          <h1 className="text-2xl font-bold">Создать аккаунт</h1>
          <p className="text-muted-foreground mt-1">Бесплатно, без карты</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Ваше имя</label>
                <Input
                  placeholder="Айгерим"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Пароль</label>
                <Input
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Создаём...</> : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
