import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, Camera, Clock, MessageSquare, Utensils } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { MealCard } from "@/components/MealCard";
import { useMealLogs, useSessionUser } from "@/lib/data";
import { demoMeals } from "@/lib/demo";
import { groupLogsByDate, shiftDays, todayISO } from "@/lib/rotina";

export const Route = createFileRoute("/_authenticated/diario")({
  head: () => ({
    meta: [
      { title: "Diário Alimentar — Rotina" },
      { name: "description", content: "Acompanhe seus registros de refeições e padrões diários." },
    ],
  }),
  component: DiarioPage,
});

function DiarioPage() {
  const [filter, setFilter] = useState<"hoje" | "ontem" | "semana">("hoje");
  const today = todayISO();
  const yesterday = shiftDays(today, -1);
  const weekAgo = shiftDays(today, -7);

  const from = filter === "hoje" ? today : filter === "ontem" ? yesterday : weekAgo;
  const to = filter === "ontem" ? yesterday : today;

  const { data: logs = [] } = useMealLogs(from, to);
  const { userId } = useSessionUser();

  const isDemo = !userId || logs.length === 0;
  
  const displayLogs = useMemo(() => {
    if (!isDemo) return logs;
    return demoMeals.filter(
      (m) => m.log_date >= from && m.log_date <= to
    ).sort((a, b) => b.log_date.localeCompare(a.log_date) || b.logged_time.localeCompare(a.logged_time));
  }, [logs, isDemo, from, to]);

  const grouped = useMemo(() => groupLogsByDate(displayLogs), [displayLogs]);

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatHeaderDate = (dateStr: string) => {
    if (dateStr === today) return "Hoje";
    if (dateStr === yesterday) return "Ontem";
    return format(parseISO(dateStr), "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <AppShell>
      <PageHeader
        title="Diário Alimentar"
        subtitle="Acompanhe seus registros com leveza"
        action={
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            {(["hoje", "ontem", "semana"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      {isDemo ? <DemoNotice /> : null}

      <div className="mx-5 mb-8 lg:mx-8">
        {dates.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
            <BookOpen className="size-10 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">Nenhum registro encontrado para este período.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {dates.map((date) => (
              <section key={date}>
                <h3 className="sticky top-[72px] z-10 mb-4 inline-block rounded-full bg-secondary/90 px-4 py-1.5 text-xs font-medium capitalize text-secondary-foreground backdrop-blur">
                  {formatHeaderDate(date)}
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {(grouped[date] ?? []).map((log) => (
                    <MealCard key={log.id} log={log} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
