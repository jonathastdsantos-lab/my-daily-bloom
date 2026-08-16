import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useProfessionalClients } from "@/lib/data";
import { initials } from "@/lib/rotina";

export const Route = createFileRoute("/_authenticated/pro/")({
  head: () => ({ meta: [{ title: "Painel do Nutricionista — Rotina" }] }),
  component: ProfessionalDashboard,
});

function ProfessionalDashboard() {
  const { data: clients = [], isLoading } = useProfessionalClients();

  return (
    <AppShell>
      <PageHeader
        title="Meus Pacientes"
        subtitle="Acompanhe a rotina e evolução dos seus pacientes."
        action={
          <Button variant="outline" className="gap-2">
            <UserPlus className="size-4" /> Novo Convite
          </Button>
        }
      />

      <div className="mx-5 mb-8 lg:mx-8">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-20 rounded-2xl bg-muted" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center">
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Users className="size-6" />
            </div>
            <h3 className="font-medium text-lg">Nenhum paciente vinculado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Convide seus pacientes para começarem a usar a Rotina.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {clients.map((pc) => {
              const profile = pc.profiles;
              if (!profile) return null;
              
              return (
                <Link
                  key={pc.client_id}
                  to="/pro/client/$clientId"
                  params={{ clientId: pc.client_id }}
                  className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground font-medium">
                    {initials(profile.full_name)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-medium truncate">{profile.full_name || "Paciente Anônimo"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pc.status === 'active' ? (
                        <span className="text-emerald-500 font-medium">Ativo</span>
                      ) : (
                        <span className="text-amber-500 font-medium">Pendente</span>
                      )}
                      {" • "} Meta: {profile.goal_weight_kg ? `${profile.goal_weight_kg}kg` : "Não definida"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
