import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { MealCard } from "@/components/MealCard";
import { useClientLogs } from "@/lib/data";
import { groupLogsByDate } from "@/lib/rotina";

export const Route = createFileRoute("/_authenticated/pro/client/$clientId")({
  head: () => ({ meta: [{ title: "Diário do Paciente — Rotina" }] }),
  component: ClientDiary,
});

function ClientDiary() {
  const { clientId } = Route.useParams();
  const { data: logs = [], isLoading } = useClientLogs(clientId);

  const grouped = groupLogsByDate(logs);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <AppShell>
      <PageHeader
        title="Diário do Paciente"
        subtitle="Analise os registros recentes."
        action={
          <a
            href="/pro"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" /> Voltar
          </a>
        }
      />

      <div className="mx-5 mb-8 lg:mx-8">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-2xl bg-muted" />
            <div className="h-32 rounded-2xl bg-muted" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">Este paciente ainda não possui registros no diário.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => {
              const dayLogs = grouped[date];
              const parsedDate = parseISO(date);
              return (
                <section key={date} className="space-y-4">
                  <h3 className="sticky top-16 z-10 bg-background/95 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                    {format(parsedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <div className="space-y-3">
                    {(dayLogs ?? []).map((log) => (
                      <MealCard key={log.id} log={log} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
