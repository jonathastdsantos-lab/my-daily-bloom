import { createFileRoute } from "@tanstack/react-router";
import { Activity, Droplets, Flame, Smile, Target, Trophy } from "lucide-react";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/semana")({
  head: () => ({
    meta: [
      { title: "Minha Semana — Rotina" },
      { name: "description", content: "Resumo da sua semana de hábitos e rotina." },
    ],
  }),
  component: SemanaPage,
});

function SemanaPage() {
  // Using static demo data for the weekly report for demonstration purposes
  return (
    <AppShell>
      <PageHeader
        title="Minha Semana"
        subtitle="Um resumo dos seus últimos 7 dias."
      />

      <DemoNotice>Este é um relatório gerado a partir dos dados de demonstração.</DemoNotice>

      <div className="mx-5 mb-8 space-y-8 lg:mx-8">
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="surface p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Target className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Consistência</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="font-display text-3xl">87%</p>
              <p className="pb-1 text-sm text-success">+5% em relação à semana passada</p>
            </div>
            <Progress value={87} className="mt-4 h-2" />
            <p className="mt-3 text-xs text-muted-foreground">Você registrou 30 das 35 refeições planejadas.</p>
          </div>

          <div className="surface p-5">
             <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-water/10 text-water">
                <Droplets className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Média de Água</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="font-display text-3xl">1,9 L</p>
              <p className="pb-1 text-sm text-muted-foreground">Meta: 2,0 L</p>
            </div>
             <Progress value={95} className="mt-4 h-2" />
             <p className="mt-3 text-xs text-muted-foreground">Quase lá! Seu consumo aumentou na maioria dos dias.</p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="surface flex flex-col p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-accent/15 text-accent-foreground">
                <Smile className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Humor Médio</span>
            </div>
            <p className="mt-4 font-display text-3xl">Bom 🙂</p>
            <p className="mt-3 text-sm text-muted-foreground">Seu humor esteve predominantemente positivo, principalmente pela manhã.</p>
          </div>

          <div className="surface flex flex-col p-5">
             <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-warm/15 text-warm-foreground">
                <Activity className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Energia Média</span>
            </div>
            <p className="mt-4 font-display text-3xl">Média ⚡</p>
            <p className="mt-3 text-sm text-muted-foreground">Sua energia teve quedas no período da tarde (entre 15h e 17h).</p>
          </div>
        </section>

        <section className="surface p-5">
          <div className="mb-4 flex items-center gap-3 text-muted-foreground">
            <span className="grid size-8 place-items-center rounded-full bg-success/15 text-success">
              <Trophy className="size-4" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider">Conquistas da Semana</span>
          </div>
          
          <ul className="mt-4 space-y-4">
             <li className="flex gap-3">
               <Flame className="mt-0.5 size-5 shrink-0 text-warm-foreground" />
               <div>
                 <p className="font-medium">Maior sequência de jantares no horário</p>
                 <p className="text-sm text-muted-foreground">Você jantou no horário planejado por 5 dias seguidos.</p>
               </div>
             </li>
             <li className="flex gap-3">
               <Droplets className="mt-0.5 size-5 shrink-0 text-water" />
               <div>
                 <p className="font-medium">Meta de água batida no final de semana</p>
                 <p className="text-sm text-muted-foreground">Sábado e domingo foram os dias de melhor hidratação.</p>
               </div>
             </li>
          </ul>
        </section>

        <div className="flex items-center justify-center pt-4">
           <p className="text-xs italic text-muted-foreground">Relatório fechado aos domingos.</p>
        </div>
      </div>
    </AppShell>
  );
}
