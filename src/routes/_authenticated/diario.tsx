import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, Camera, Clock, MessageSquare, Utensils } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { useMealLogs, useSessionUser } from "@/lib/data";
import { demoMeals } from "@/lib/demo";
import { shiftDays, todayISO } from "@/lib/rotina";

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

  const grouped = displayLogs.reduce((acc, log) => {
    if (!acc[log.log_date]) acc[log.log_date] = [];
    acc[log.log_date].push(log);
    return acc;
  }, {} as Record<string, typeof displayLogs>);

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
                  {grouped[date].map((log) => (
                    <article key={log.id} className="surface flex flex-col overflow-hidden animate-rise">
                      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                            <Utensils className="size-4" />
                          </span>
                          <div>
                            <h4 className="font-display text-base leading-tight">{log.meal_name}</h4>
                            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="size-3" />
                              {log.logged_time}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 p-4 sm:flex-row">
                        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl sm:w-28 sm:rounded-2xl"
                             style={{ backgroundColor: `hsl(${'photo_hue' in log ? log.photo_hue : 40}, 80%, 95%)` }}>
                          <div className="flex h-full w-full items-center justify-center text-black/10">
                            <Camera className="size-8" />
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-1 space-y-3">
                          {log.description ? (
                            <p className="text-sm leading-relaxed">{log.description}</p>
                          ) : (
                            <p className="text-sm italic text-muted-foreground">Sem descrição</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {log.difficulties?.filter(d => d !== 'Sem dificuldade').map((diff) => (
                              <span key={diff} className="rounded-md bg-warm/10 px-2 py-1 text-[10px] font-medium text-warm-foreground">
                                {diff}
                              </span>
                            ))}
                          </div>
                          
                          {(log.hunger_before || log.fullness_after) && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {log.hunger_before && (
                                <span>Fome: {log.hunger_before}/5</span>
                              )}
                              {log.fullness_after && (
                                <span>Saciedade: {log.fullness_after}/5</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {log.comment && (
                        <div className="mt-auto border-t border-border/50 bg-muted/10 px-4 py-3">
                          <p className="flex items-start gap-2 text-xs italic text-muted-foreground">
                            <MessageSquare className="mt-0.5 size-3 shrink-0" />
                            {log.comment}
                          </p>
                        </div>
                      )}
                    </article>
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
