import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, ArrowRight, Camera, Loader2, Plus, Scale, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddWeightLog, useProfile, useSessionUser, useWeightLogs } from "@/lib/data";
import { demoWeights } from "@/lib/demo";
import { todayISO } from "@/lib/rotina";

export const Route = createFileRoute("/_authenticated/evolucao")({
  head: () => ({
    meta: [
      { title: "Evolução — Rotina" },
      { name: "description", content: "Acompanhe seu peso e medidas de forma saudável." },
    ],
  }),
  component: EvolucaoPage,
});

function EvolucaoPage() {
  const [period, setPeriod] = useState<"1m" | "3m" | "6m" | "1y" | "all">("3m");
  const [weightOpen, setWeightOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [logDate, setLogDate] = useState(todayISO());

  const { data: profile } = useProfile();
  const { data: weightLogs = [] } = useWeightLogs();
  const { userId } = useSessionUser();
  const addWeight = useAddWeightLog();

  const isDemo = !userId || weightLogs.length === 0;
  
  const chartData = useMemo(() => {
    const data = isDemo ? demoWeights : weightLogs;
    return data.map((log) => ({
      date: log.log_date,
      formattedDate: format(parseISO(log.log_date), "d MMM", { locale: ptBR }),
      weight: log.weight_kg,
    }));
  }, [weightLogs, isDemo]);

  const currentWeight = chartData.at(-1)?.weight;
  const startWeight = chartData[0]?.weight ?? profile?.start_weight_kg;
  const diff = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : null;
  const diffNumber = Number(diff);

  const handleSaveWeight = () => {
    if (!userId) {
      toast.error("Você precisa estar logado para salvar.");
      return;
    }
    const weightVal = parseFloat(newWeight.replace(",", "."));
    if (isNaN(weightVal) || weightVal <= 0) {
      toast.error("Por favor, insira um peso válido.");
      return;
    }
    
    addWeight.mutate(
      { userId, weight_kg: weightVal, log_date: logDate },
      {
        onSuccess: () => {
          toast.success("Peso registrado com sucesso!");
          setWeightOpen(false);
          setNewWeight("");
        },
        onError: (err) => {
          toast.error("Erro ao registrar: " + err.message);
        }
      }
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Sua Evolução"
        subtitle="O progresso não é linear, e está tudo bem."
        action={
          <Button className="gap-2" onClick={() => setWeightOpen(true)}>
            <Plus className="size-4" aria-hidden /> Atualizar
          </Button>
        }
      />

      {isDemo ? <DemoNotice /> : null}

      <div className="mx-5 mb-8 space-y-8 lg:mx-8">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="surface p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Scale className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Peso Atual</span>
            </div>
            <p className="mt-4 font-display text-3xl">
              {currentWeight ? `${currentWeight.toString().replace(".", ",")} kg` : "—"}
            </p>
          </div>

          <div className="surface p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-accent/15 text-accent-foreground">
                <Target className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Meta</span>
            </div>
            <p className="mt-4 font-display text-3xl">
              {profile?.goal_weight_kg ? `${profile.goal_weight_kg} kg` : "—"}
            </p>
          </div>

          <div className="surface p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-8 place-items-center rounded-full bg-success/15 text-success">
                <Activity className="size-4" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">Diferença</span>
            </div>
            <p className="mt-4 font-display text-3xl">
              {diff ? (
                <span className={diffNumber > 0 ? "text-warm-foreground" : "text-success"}>
                  {diffNumber > 0 ? "+" : ""}{diff.replace(".", ",")} kg
                </span>
              ) : "—"}
            </p>
          </div>
        </section>

        <section className="surface p-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Histórico de Peso</h2>
            <div className="flex gap-1 rounded-xl bg-secondary p-1">
              {(["1m", "3m", "6m", "1y", "all"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium uppercase transition-colors ${
                    period === p
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 500 }}
                  labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                  formatter={(value: number) => [`${value} kg`, 'Peso']}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Fotos de Evolução</h2>
              <p className="mt-1 text-sm text-muted-foreground">Suas fotos são privadas.</p>
            </div>
            <Button variant="secondary" size="sm" className="gap-2">
              <Camera className="size-4" /> Adicionar
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            {["Frente", "Lado", "Costas"].map((view) => (
              <div key={view} className="flex flex-col gap-2">
                <div className="flex h-40 w-28 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground/50 transition-colors hover:bg-muted/50">
                  <Camera className="size-8" />
                </div>
                <span className="text-center text-xs font-medium text-muted-foreground">{view}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h2 className="text-lg font-medium">Medidas Corporais</h2>
              <p className="mt-1 text-sm text-muted-foreground">Acompanhe circunferências de forma simples.</p>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              Ver histórico <ArrowRight className="size-4" />
            </Button>
        </section>
      </div>

      <Dialog open={weightOpen} onOpenChange={setWeightOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>Registrar Peso</DialogTitle>
            <DialogDescription>Acompanhe seu progresso sem cobranças.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="weight-date">Data do Registro</Label>
              <Input
                id="weight-date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-value">Peso (kg)</Label>
              <Input
                id="weight-value"
                type="number"
                step="0.1"
                placeholder="Ex.: 75.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-12"
              disabled={addWeight.isPending || !newWeight}
              onClick={handleSaveWeight}
            >
              {addWeight.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Salvar Registro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
