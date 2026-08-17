import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Droplets, HeartHandshake, LineChart, Salad, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rotina — acompanhamento alimentar e evolução pessoal" },
      {
        name: "description",
        content:
          "Registre refeições em segundos, acompanhe água, peso, humor e energia, e entenda seus padrões com um diário alimentar visual e acolhedor.",
      },
      { property: "og:title", content: "Rotina — acompanhamento alimentar e evolução pessoal" },
      {
        property: "og:description",
        content:
          "Um diário alimentar simples e premium: refeições, água, peso, humor e relatórios semanais.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Salad,
    title: "Registro em segundos",
    text: "Foto, horário, o que você comeu, fome e saciedade. Simples assim, direto do celular.",
  },
  {
    icon: BookOpen,
    title: "Diário visual",
    text: "Hoje, ontem, semana ou calendário: seus registros organizados em cards fáceis de ler.",
  },
  {
    icon: LineChart,
    title: "Evolução com contexto",
    text: "Peso, medidas e fotos opcionais, sempre com linguagem respeitosa e sem pressão.",
  },
  {
    icon: Droplets,
    title: "Água e bem-estar",
    text: "Meta diária de água, humor e energia registrados com um toque.",
  },
  {
    icon: Sparkles,
    title: "Padrões observados",
    text: "Veja quando as dificuldades aparecem — como a vontade de doce no fim da tarde.",
  },
  {
    icon: HeartHandshake,
    title: "Pronto para o acompanhamento",
    text: "Estrutura preparada para compartilhar sua rotina com um profissional autorizado.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <span className="flex items-center gap-2">
          <img src="/logo.png" alt="Rotina Logo" className="h-12 w-auto object-contain" />
        </span>
        <Link
          to="/auth"
          className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
        >
          Entrar
        </Link>
      </header>

      <section className="hero-gradient">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Rotina alimentar · Evolução pessoal
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight lg:text-6xl">
            Sua rotina alimentar registrada com leveza, do jeito que ela realmente é.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Um diário alimentar acolhedor para quem está em processo de reeducação alimentar.
            Consistência vale mais que perfeição — cada registro ajuda você a entender seus hábitos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-lift transition-transform active:scale-95"
            >
              Começar agora
            </Link>
            <Link
              to="/auth"
              className="rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <h2 className="text-2xl lg:text-3xl">Tudo o que sua rotina precisa</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="surface p-6">
              <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <feature.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted-foreground lg:px-8">
          Os padrões apresentados no app são observações dos seus próprios registros e não substituem
          orientação profissional.
        </div>
      </footer>
    </div>
  );
}
