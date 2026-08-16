export const DIFFICULTY_OPTIONS = [
  "Muita fome",
  "Vontade de doce",
  "Ansiedade/estresse",
  "Falta de tempo",
  "Comi fora",
  "Não consegui seguir o planejado",
  "Sem dificuldade",
  "Outro",
] as const;

export const TIP_CATEGORIES = [
  "Alimentação",
  "Organização",
  "Água",
  "Hábitos",
  "Sono",
  "Motivação",
  "Receitas",
] as const;

export const MOOD_FACES = ["😞", "😕", "😐", "🙂", "😄"];
export const ENERGY_LABELS = ["Muito baixa", "Baixa", "Média", "Boa", "Ótima"];
export const HUNGER_LABELS = ["Sem fome", "Pouca fome", "Fome moderada", "Muita fome", "Fome extrema"];
export const FULLNESS_LABELS = ["Ainda com fome", "Pouco satisfeito", "Satisfeito", "Bem satisfeito", "Muito cheio"];

export function todayISO() {
  const now = new Date();
  return toISODate(now);
}

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatLongDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatShortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date);
}

export function hhmm(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

export function nowTime() {
  const now = new Date();
  return `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`;
}

export function greeting(name?: string | null) {
  const hour = new Date().getHours();
  const base = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return name ? `${base}, ${name}` : base;
}

export function initials(name?: string | null) {
  if (!name) return "•";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function groupLogsByDate<T extends { log_date: string }>(logs: T[]): Record<string, T[]> {
  return logs.reduce((acc, log) => {
    const date = log.log_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, T[]>);
}
