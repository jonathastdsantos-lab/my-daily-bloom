import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Settings, Target, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, DemoNotice, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMealSchedules, useProfile, useSessionUser, useUpdateProfile } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Rotina" },
      { name: "description", content: "Configurações e dados do seu perfil." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { data: profile } = useProfile();
  const { data: schedules = [] } = useMealSchedules();
  const { userId, email } = useSessionUser();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const [loggingOut, setLoggingOut] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [waterGoal, setWaterGoal] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [height, setHeight] = useState("");

  const isDemo = !userId;

  const openEdit = () => {
    if (isDemo) {
      toast.error("Crie uma conta para editar seu perfil.");
      return;
    }
    setWaterGoal((profile?.water_goal_ml ?? 2000).toString());
    setStartWeight(profile?.start_weight_kg?.toString() ?? "");
    setGoalWeight(profile?.goal_weight_kg?.toString() ?? "");
    setHeight(profile?.height_cm?.toString() ?? "");
    setEditOpen(true);
  };

  const handleSaveProfile = () => {
    if (!userId) return;
    
    updateProfile.mutate(
      {
        userId,
        data: {
          water_goal_ml: parseInt(waterGoal) || 2000,
          start_weight_kg: parseFloat(startWeight) || null,
          goal_weight_kg: parseFloat(goalWeight) || null,
          height_cm: parseFloat(height) || null,
        }
      },
      {
        onSuccess: () => {
          toast.success("Perfil atualizado!");
          setEditOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const activeSchedules = schedules.filter((s) => s.is_active);

  return (
    <AppShell>
      <PageHeader
        title="Seu Perfil"
        subtitle="Ajuste suas configurações e metas."
        action={
          <Button variant="outline" size="sm" className="gap-2" onClick={openEdit}>
            <Settings className="size-4" /> Editar
          </Button>
        }
      />

      {isDemo ? <DemoNotice>Você está visualizando a interface de demonstração. Cadastre-se para gerenciar seu perfil real.</DemoNotice> : null}

      <div className="mx-5 mb-8 space-y-8 lg:mx-8">
        <section className="surface flex items-center gap-5 p-6">
          <div className="grid size-20 place-items-center rounded-full bg-secondary text-2xl font-semibold text-secondary-foreground">
            {profile?.display_name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <h2 className="font-display text-2xl">{profile?.display_name ?? profile?.full_name ?? "Usuário"}</h2>
            <p className="text-sm text-muted-foreground">{email ?? "usuario@demo.com"}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="surface p-5">
            <div className="mb-4 flex items-center gap-2 font-medium">
              <Target className="size-4 text-primary" />
              Metas Atuais
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border/50 pb-2 text-sm">
                <span className="text-muted-foreground">Água diária</span>
                <span className="font-medium">{(profile?.water_goal_ml ?? 2000) / 1000} L</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2 text-sm">
                <span className="text-muted-foreground">Peso inicial</span>
                <span className="font-medium">{profile?.start_weight_kg ?? "—"} kg</span>
              </div>
              <div className="flex justify-between pb-2 text-sm">
                <span className="text-muted-foreground">Peso meta</span>
                <span className="font-medium">{profile?.goal_weight_kg ?? "—"} kg</span>
              </div>
            </div>
          </div>

          <div className="surface p-5">
            <div className="mb-4 flex items-center gap-2 font-medium">
              <User className="size-4 text-accent-foreground" />
              Dados Biométricos
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border/50 pb-2 text-sm">
                <span className="text-muted-foreground">Altura</span>
                <span className="font-medium">{profile?.height_cm ? `${profile.height_cm} cm` : "—"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-5">
           <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Horários de Refeição</h2>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">Adicionar</Button>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Ajuste as refeições que você costuma fazer para facilitar o registro no dia a dia.
            </p>

            <div className="space-y-2">
              {(isDemo ? [
                { id: "1", name: "Café da manhã", scheduled_time: "07:30:00" },
                { id: "2", name: "Lanche da manhã", scheduled_time: "10:30:00" },
                { id: "3", name: "Almoço", scheduled_time: "12:30:00" },
                { id: "4", name: "Lanche da tarde", scheduled_time: "16:00:00" },
                { id: "5", name: "Jantar", scheduled_time: "20:00:00" },
              ] : activeSchedules).map((schedule) => (
                 <div key={schedule.id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                    <span className="text-sm font-medium">{schedule.name}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {schedule.scheduled_time.slice(0, 5)}
                    </span>
                 </div>
              ))}
            </div>
        </section>

        <section className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full gap-2 sm:w-auto"
            onClick={handleLogout}
            disabled={loggingOut || isDemo}
          >
            <LogOut className="size-4" />
            {loggingOut ? "Saindo..." : "Sair da conta"}
          </Button>
        </section>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Ajuste suas metas e dados biométricos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="water-goal">Meta de Água Diária (ml)</Label>
              <Input
                id="water-goal"
                type="number"
                placeholder="Ex.: 2000"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-weight">Peso Inicial (kg)</Label>
                <Input
                  id="start-weight"
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-weight">Peso Meta (kg)</Label>
                <Input
                  id="goal-weight"
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex.: 165"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-12 mt-2"
              disabled={updateProfile.isPending}
              onClick={handleSaveProfile}
            >
              {updateProfile.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
