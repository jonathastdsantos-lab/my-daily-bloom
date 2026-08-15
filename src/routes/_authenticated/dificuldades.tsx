import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, Search, Utensils } from "lucide-react";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { demoDifficulties } from "@/lib/demo";

export const Route = createFileRoute("/_authenticated/dificuldades")({
  head: () => ({
    meta: [
      { title: "Dificuldades — Rotina" },
      { name: "description", content: "Entenda seus padrões de dificuldade e gatilhos." },
    ],
  }),
  component: DificuldadesPage,
});

function DificuldadesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dificuldades & Padrões"
        subtitle="Identifique o que te tira do foco para poder agir."
      />

      <DemoNotice>Padrões detectados a partir dos dados de demonstração.</DemoNotice>

      <div className="mx-5 mb-8 space-y-8 lg:mx-8">
        <section className="surface p-5">
          <div className="mb-4 flex items-center gap-3 text-muted-foreground">
            <span className="grid size-8 place-items-center rounded-full bg-warm/15 text-warm-foreground">
              <Search className="size-4" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider">Principais Padrões Observados</span>
          </div>

          <div className="mt-6 space-y-4">
            {demoDifficulties.map((diff, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-muted/20 p-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm/15 text-xs font-bold text-warm-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="font-medium">{diff.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Apareceu <strong>{diff.count} vezes</strong> nesta semana.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-xs border border-border/50">
                      <Clock className="size-3.5 text-muted-foreground" />
                      Principalmente {diff.window}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-xs border border-border/50">
                      <Utensils className="size-3.5 text-muted-foreground" />
                      Refeição: {diff.meal}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5">
           <div className="flex items-start gap-4">
             <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
               <AlertTriangle className="size-5" />
             </span>
             <div>
                <h3 className="font-medium text-lg">O que fazer com essas informações?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Padrões não são diagnósticos, mas pistas. Se a "Vontade de doce" aparece sempre entre 16h e 18h, 
                  talvez seu almoço esteja muito pobre em carboidratos ou seu lanche da tarde precise ser antecipado.
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Leve essas informações para o seu nutricionista, elas são valiosas para ajustar sua estratégia.
                </p>
             </div>
           </div>
        </section>
      </div>
    </AppShell>
  );
}
