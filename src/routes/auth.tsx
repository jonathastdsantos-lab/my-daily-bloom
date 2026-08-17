import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar na Rotina — acompanhamento alimentar" },
      {
        name: "description",
        content:
          "Acesse sua conta para registrar refeições, água, peso e humor e acompanhar sua evolução com leveza.",
      },
      { property: "og:title", content: "Entrar na Rotina" },
      {
        property: "og:description",
        content: "Entre para acompanhar sua rotina alimentar com registros rápidos e visuais.",
      },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Informe um e-mail válido").max(255);
const passwordSchema = z.string().min(8, "A senha precisa ter pelo menos 8 caracteres").max(72);

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/hoje", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const parsedEmail = emailSchema.parse(email);

      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Enviamos um link de recuperação para o seu e-mail.");
        setMode("signin");
        return;
      }

      const parsedPassword = passwordSchema.parse(password);

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsedEmail,
          password: parsedPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/hoje`,
            data: { 
              full_name: name.trim().slice(0, 120),
              requested_role: isProfessional ? 'professional' : 'client'
            },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Se pedirmos confirmação, verifique seu e-mail.");
        navigate({ to: isProfessional ? "/pro" : "/hoje" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: parsedEmail,
        password: parsedPassword,
      });
      if (error) throw error;
      navigate({ to: "/hoje" });
    } catch (error) {
      const message =
        error instanceof z.ZodError
          ? (error.issues[0]?.message ?? "Verifique os dados")
          : error instanceof Error
            ? error.message
            : "Não foi possível continuar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google agora.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/hoje" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hero-gradient hidden flex-col justify-between p-12 lg:flex">
        <img src="/logo.png" alt="Rotina Logo" className="h-24 w-auto object-contain self-start" />
        <div className="max-w-sm">
          <h1 className="text-4xl leading-tight">Sua rotina alimentar, registrada com leveza.</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Refeições, água, peso, humor e energia em um só lugar. Consistência vale mais que
            perfeição.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Seus registros são privados. Só você — e um profissional que você autorizar — pode vê-los.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm animate-rise">
          <h2 className="text-2xl">
            {mode === "signup"
              ? "Criar minha conta"
              : mode === "reset"
                ? "Recuperar senha"
                : "Bem-vinda de volta"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "reset"
              ? "Enviaremos um link para você definir uma nova senha."
              : "Registre sua rotina em poucos segundos por dia."}
          </p>

          {mode !== "reset" ? (
            <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Como podemos te chamar?</Label>
                  <Input
                    id="name"
                    value={name}
                    maxLength={120}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3">
                  <Checkbox 
                    id="isProfessional" 
                    checked={isProfessional} 
                    onCheckedChange={(checked) => setIsProfessional(checked === true)} 
                  />
                  <Label htmlFor="isProfessional" className="text-sm font-normal cursor-pointer">
                    Sou Nutricionista / Profissional de Saúde
                  </Label>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {mode !== "reset" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            ) : null}

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {mode === "signup" ? "Criar conta" : mode === "reset" ? "Enviar link" : "Entrar"}
            </Button>
          </form>

          {mode !== "reset" ? (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
              </div>
              <Button variant="outline" className="h-11 w-full" onClick={google}>
                Continuar com Google
              </Button>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setMode(mode === "reset" ? "signin" : "reset")}
            className="mt-6 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "reset" ? "Voltar para o login" : "Esqueci minha senha"}
          </button>
        </div>
      </div>
    </div>
  );
}
