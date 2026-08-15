import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Droplets, Heart, Moon, Salad, Target } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { useTips } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dicas")({
  head: () => ({
    meta: [
      { title: "Dicas e Conteúdos — Rotina" },
      { name: "description", content: "Conteúdos para ajudar na sua reeducação alimentar." },
    ],
  }),
  component: DicasPage,
});

const DEMO_TIPS = [
  { id: "1", category: "Alimentação", title: "Como montar um prato equilibrado", summary: "Aprenda a distribuir os macronutrientes na sua principal refeição.", icon: Salad },
  { id: "2", category: "Água", title: "Sinais de que você está bebendo pouca água", summary: "Dor de cabeça, fome fora de hora e cansaço podem ser sede.", icon: Droplets },
  { id: "3", category: "Hábitos", title: "A regra dos 2 minutos", summary: "Como vencer a procrastinação e criar o hábito de registrar as refeições.", icon: Target },
  { id: "4", category: "Sono", title: "O impacto do sono na fome", summary: "Dormir mal aumenta o cortisol e a vontade de comer doces.", icon: Moon },
  { id: "5", category: "Organização", title: "Marmitas para a semana", summary: "Como se organizar no domingo para não furar a dieta na semana.", icon: BookOpen },
  { id: "6", category: "Motivação", title: "O que fazer quando sair do planejado?", summary: "Uma refeição fora da dieta não estraga seus resultados.", icon: Heart },
];

const CATEGORIES = ["Todos", "Alimentação", "Água", "Hábitos", "Sono", "Organização", "Motivação"];

function DicasPage() {
  const { data: tips = [] } = useTips();
  const [activeCategory, setActiveCategory] = useState("Todos");

  const isDemo = tips.length === 0;
  
  const displayTips = useMemo(() => {
    const list = isDemo ? DEMO_TIPS : tips;
    if (activeCategory === "Todos") return list;
    return list.filter((t) => t.category === activeCategory);
  }, [tips, isDemo, activeCategory]);

  return (
    <AppShell>
      <PageHeader
        title="Dicas e Aprendizado"
        subtitle="Pequenas mudanças diárias constroem a evolução."
      />

      {isDemo ? <DemoNotice /> : null}

      <div className="mx-5 mb-8 lg:mx-8">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTips.map((tip) => {
            const Icon = 'icon' in tip ? tip.icon : BookOpen;
            return (
              <article key={tip.id} className="surface group flex cursor-pointer flex-col p-5 transition-colors hover:border-primary/30">
                <div className="mb-4 flex items-center justify-between text-muted-foreground">
                  <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider">{tip.category}</span>
                </div>
                <h3 className="mb-2 font-display text-lg leading-tight">{tip.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2 flex-1">{tip.summary}</p>
                
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-80 transition-opacity group-hover:opacity-100">
                  Ler artigo <ChevronRight className="size-3" />
                </div>
              </article>
            );
          })}
          
          {displayTips.length === 0 && (
             <div className="col-span-full mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
             <BookOpen className="size-10 text-muted-foreground/50" />
             <p className="mt-4 text-sm text-muted-foreground">Nenhuma dica encontrada para esta categoria.</p>
           </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
