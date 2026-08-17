import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarHeart, Home, Lightbulb, LineChart, Plus, User, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useProfile, useUserRole } from "@/lib/data";
import { initials } from "@/lib/rotina";

const CLIENT_NAV = [
  { to: "/hoje", label: "Hoje", icon: Home },
  { to: "/diario", label: "Diário", icon: BookOpen },
  { to: "/evolucao", label: "Evolução", icon: LineChart },
  { to: "/dicas", label: "Dicas", icon: Lightbulb },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

const CLIENT_DESKTOP_EXTRA = [
  { to: "/semana", label: "Minha semana", icon: CalendarHeart },
  { to: "/dificuldades", label: "Dificuldades", icon: Lightbulb },
] as const;

const PRO_NAV = [
  { to: "/pro", label: "Pacientes", icon: Users },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

const DESKTOP_EXTRA = [
  { to: "/semana", label: "Minha semana", icon: CalendarHeart },
  { to: "/dificuldades", label: "Dificuldades", icon: Lightbulb },
] as const;

export function AppShell({
  children,
  onRegisterMeal,
}: {
  children: ReactNode;
  onRegisterMeal?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: profile } = useProfile();
  const { data: role } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isPro = role === "professional";
  const nav = isPro ? PRO_NAV : CLIENT_NAV;
  const desktopExtra = isPro ? [] : CLIENT_DESKTOP_EXTRA;

  const goRegister = () => {
    if (onRegisterMeal) onRegisterMeal();
    else navigate({ to: "/hoje" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 border-r border-border px-4 py-8 lg:flex">
          <Link to="/hoje" className="mb-6 flex items-center px-2">
            <img src="/logo.png" alt="Rotina" className="h-16 w-auto object-contain" />
          </Link>
          {[...nav, ...desktopExtra].map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-medium text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          {!isPro && (
            <div className="mt-6">
              <Button className="w-full gap-2" onClick={goRegister}>
                <Plus className="size-4" aria-hidden /> Registrar refeição
              </Button>
            </div>
          )}
          <div className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {initials(profile?.display_name ?? profile?.full_name)}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {profile?.display_name ?? profile?.full_name ?? "Minha conta"}
            </span>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-28 lg:pb-10">{children}</main>
      </div>

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden"
      >
        <div className={`mx-auto grid max-w-md items-end px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 ${isPro ? "grid-cols-2" : "grid-cols-6"}`}>
          {nav.map((item, index) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const link = (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-lg py-1 text-[11px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="size-5" aria-hidden />
                <span className="font-medium">{item.label}</span>
              </Link>
            );

            if (!isPro && index === 2) {
              return (
                <div key="fab" className="col-span-2 flex justify-center px-2">
                  <button
                    type="button"
                    onClick={goRegister}
                    className="relative -top-4 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
                    aria-label="Registrar refeição"
                  >
                    <Plus className="size-6" aria-hidden />
                  </button>
                </div>
              );
            }
            return <div key={item.to} className={!isPro && index > 2 ? "col-span-1" : ""}>{link}</div>;
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 px-5 pt-8 pb-4 lg:px-8">
      <div>
        <h1 className="text-2xl lg:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="mx-5 mb-4 rounded-xl bg-secondary px-4 py-3 text-xs text-secondary-foreground lg:mx-8">
      {children ??
        "Estes são dados de demonstração para você conhecer a experiência. Ao fazer seu primeiro registro, tudo passa a refletir a sua rotina."}
    </p>
  );
}
