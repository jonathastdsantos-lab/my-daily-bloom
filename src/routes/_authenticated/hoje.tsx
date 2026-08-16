import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Check, Droplets, Scale, Smile } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, DemoNotice } from "@/components/AppShell";
import { MealDialog, type MealDialogTarget } from "@/components/MealDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useAddWater,
  useMealLogs,
  useMealSchedules,
  useMoodLogs,
  useProfile,
  useSessionUser,
  useWaterToday,
  useWeightLogs,
} from "@/lib/data";
import { demoMeals, demoWater } from "@/lib/demo";
import { formatLongDate, greeting, hhmm, nowTime, todayISO } from "@/lib/rotina";

export const Route = createFileRoute("/_authenticated/hoje")({
  head: () => ({
    meta: [
      { title: "Meu Dia — Rotina alimentar" },
      {
        name: "description",
        content:
          "Veja a rotina de hoje: refeições registradas, próxima refeição, água, peso, humor e atividade.",
      },
      { property: "og:title", content: "Meu Dia — Rotina alimentar" },
      { property: "og:description", content: "Sua rotina de hoje em uma tela só." },
    ],
  }),
  component: TodayPage,
});

function QuickCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Droplets;
  tone: "water" | "primary" | "warm" | "accent";
  children?: React.ReactNode;
}) {
  const toneClass = {
    water: "bg-water/12 text-water",
    primary: "bg-primary/12 text-primary",
    warm: "bg-warm/15 text-warm",
    accent: "bg-accent text-accent-foreground",
  }[tone];

  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`grid size-8 place-items-center rounded-full ${toneClass}`}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-display text-xl">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}

function TodayPage() {
  const today = todayISO();
  const { userId } = useSessionUser();
  const { data: profile } = useProfile();
  const { data: schedules = [] } = useMealSchedules();
  const { data: logs = [] } = useMealLogs(today);
  const { data: water = 0 } = useWaterToday(today);
  const { data: weights = [] } = useWeightLogs();
  const { data: moods = [] } = useMoodLogs(1);
  const addWater = useAddWater(today);

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<MealDialogTarget | null>(null);

  const isDemo = logs.length === 0;
  const demoToday = useMemo(() => demoMeals.filter((meal) => meal.log_date === today), [today]);
  const registeredCount = isDemo ? demoToday.length : logs.length;
  const total = Math.max(schedules.length, registeredCount, 5);
  const waterGoal = profile?.water_goal_ml ?? 2000;
  const waterValue = isDemo ? (demoWater.at(-1) ?? 0) : water;

  const timeline = schedules.length
    ? schedules.map((schedule) => {
        let log: (typeof demoToday)[number] | MealLog | undefined;
        if (isDemo) {
          log = demoToday.find((item) => item.meal_name === schedule.name);
        } else {
          log = logs.find((item) => item.schedule_id === schedule.id);
        }
        return {
          id: schedule.id,
          name: schedule.name,
          time: hhmm(schedule.scheduled_time),
          done: Boolean(log),
          description: log?.description ?? null,
        };
      })
    : demoToday.map((meal) => ({
        id: meal.id,
        name: meal.meal_name,
        time: meal.logged_time,
        done: true,
        description: meal.description,
      }));

  const next = timeline.find((item) => !item.done);
  const lastWeight = isDemo ? 73.2 : weights.at(-1)?.weight_kg;
  const mood = isDemo ? 4 : moods[0]?.mood;

  const openDialog = (item?: { id: string; name: string; time: string }) => {
    setTarget(
      item
        ? { scheduleId: schedules.some((s) => s.id === item.id) ? item.id : null, name: item.name, time: item.time }
        : { name: next?.name ?? "Refeição", time: nowTime() },
    );
    setOpen(true);
  };

  return (
    <AppShell onRegisterMeal={() => openDialog()}>
      <section className="hero-gradient px-5 pt-10 pb-8 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {formatLongDate(today)}
        </p>
        <h1 className="mt-2 text-3xl lg:text-4xl">
          {greeting(profile?.display_name ?? profile?.full_name)} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sua rotina de hoje</p>

        <div className="mt-6 max-w-md">
          <div className="flex items-end justify-between">
            <p className="font-display text-2xl">
              {registeredCount} de {total} refeições
            </p>
            <span className="text-xs text-muted-foreground">registradas</span>
          </div>
          <Progress value={(registeredCount / total) * 100} className="mt-3 h-2" />
          <p className="mt-3 text-sm text-muted-foreground">
            {next
              ? `Próxima refeição: ${next.time} — ${next.name}`
              : "Todas as refeições planejadas de hoje já foram registradas."}
          </p>
          <Button className="mt-5 h-12 w-full text-base sm:w-auto sm:px-8" onClick={() => openDialog(next)}>
            Registrar refeição
          </Button>
        </div>
      </section>

      {isDemo ? <DemoNotice /> : null}

      <section className="grid grid-cols-2 gap-3 px-5 lg:grid-cols-4 lg:px-8">
        <QuickCard
          label="Água"
          value={`${(waterValue / 1000).toFixed(2).replace(".", ",")} L`}
          hint={`Meta ${(waterGoal / 1000).toFixed(1).replace(".", ",")} L`}
          icon={Droplets}
          tone="water"
        >
          <div className="mt-3 flex gap-2">
            {[250, 500].map((amount) => (
              <button
                key={amount}
                type="button"
                disabled={!userId || addWater.isPending}
                onClick={() => userId && addWater.mutate({ userId, amount })}
                className="flex-1 rounded-lg bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
              >
                +{amount}
              </button>
            ))}
          </div>
        </QuickCard>

        <QuickCard
          label="Peso"
          value={lastWeight ? `${lastWeight.toString().replace(".", ",")} kg` : "—"}
          hint={profile?.goal_weight_kg ? `Meta ${profile.goal_weight_kg} kg` : "Registre na Evolução"}
          icon={Scale}
          tone="primary"
        />

        <QuickCard
          label="Humor"
          value={mood ? ["😞", "😕", "😐", "🙂", "😄"][mood - 1]! : "—"}
          hint="Como você está hoje?"
          icon={Smile}
          tone="accent"
        />

        <QuickCard label="Atividade" value="—" hint="Registre no Perfil" icon={Activity} tone="warm" />
      </section>

      <section className="px-5 pt-8 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Linha do tempo</h2>
          <Link to="/perfil" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Ajustar horários
          </Link>
        </div>

        <ol className="mt-4 space-y-3">
          {timeline.map((item) => (
            <li key={item.id} className="surface flex items-center gap-4 p-4 animate-rise">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  item.done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                {item.done ? <Check className="size-4" aria-hidden /> : item.time.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2 text-sm font-medium">
                  <span className="tabular-nums text-muted-foreground">{item.time}</span>
                  {item.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.done ? (item.description ?? "Registrado") : "Pendente"}
                </p>
              </div>
              {item.done ? (
                <span className="rounded-full bg-success/12 px-3 py-1 text-[11px] font-medium text-success">
                  Registrado
                </span>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => openDialog(item)}>
                  Registrar
                </Button>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-2xl bg-secondary px-4 py-4 text-sm text-secondary-foreground">
          Hoje não saiu como planejado? Registre o que aconteceu para entender melhor sua rotina.
        </p>
      </section>

      {userId ? (
        <MealDialog open={open} onOpenChange={setOpen} target={target} userId={userId} date={today} />
      ) : null}
    </AppShell>
  );
}
