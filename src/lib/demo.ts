import { shiftDays, todayISO } from "./rotina";

export type DemoMeal = {
  id: string;
  log_date: string;
  logged_time: string;
  meal_name: string;
  description: string;
  portion: string | null;
  hunger_before: number;
  fullness_after: number;
  comment: string | null;
  difficulties: string[];
  photo_hue: number;
};

const t = todayISO();

export const demoMeals: DemoMeal[] = [
  {
    id: "d1",
    log_date: t,
    logged_time: "07:35",
    meal_name: "Café da manhã",
    description: "Iogurte natural com granola, mamão e café sem açúcar",
    portion: "1 pote",
    hunger_before: 4,
    fullness_after: 4,
    comment: "Comi com calma antes de sair, me senti bem.",
    difficulties: ["Sem dificuldade"],
    photo_hue: 60,
  },
  {
    id: "d2",
    log_date: t,
    logged_time: "10:28",
    meal_name: "Lanche da manhã",
    description: "Banana com pasta de amendoim",
    portion: "1 unidade",
    hunger_before: 3,
    fullness_after: 3,
    comment: null,
    difficulties: ["Vontade de doce"],
    photo_hue: 95,
  },
  {
    id: "d3",
    log_date: t,
    logged_time: "12:40",
    meal_name: "Almoço",
    description: "Arroz, feijão, frango grelhado e salada de folhas com tomate",
    portion: "1 prato",
    hunger_before: 5,
    fullness_after: 4,
    comment: "Almocei no trabalho, um pouco corrido.",
    difficulties: ["Falta de tempo"],
    photo_hue: 130,
  },
  {
    id: "d4",
    log_date: shiftDays(t, -1),
    logged_time: "16:10",
    meal_name: "Lanche da tarde",
    description: "Café com leite e dois biscoitos",
    portion: null,
    hunger_before: 4,
    fullness_after: 3,
    comment: "Bateu vontade de doce no fim da tarde.",
    difficulties: ["Vontade de doce", "Ansiedade/estresse"],
    photo_hue: 30,
  },
  {
    id: "d5",
    log_date: shiftDays(t, -1),
    logged_time: "20:15",
    meal_name: "Jantar",
    description: "Omelete com queijo e salada de pepino",
    portion: "2 ovos",
    hunger_before: 3,
    fullness_after: 4,
    comment: "Jantei tranquila, sem exagero.",
    difficulties: ["Sem dificuldade"],
    photo_hue: 75,
  },
];

export const demoWeights = Array.from({ length: 12 }).map((_, index) => {
  const day = shiftDays(t, -(11 - index) * 7);
  return { log_date: day, weight_kg: Number((78.4 - index * 0.42).toFixed(1)) };
});

export const demoWater = [1750, 2000, 1500, 2250, 2500, 1800, 2000];

export const demoMood = Array.from({ length: 7 }).map((_, index) => ({
  log_date: shiftDays(t, -(6 - index)),
  mood: [3, 4, 4, 3, 5, 4, 4][index]!,
  energy: [3, 3, 4, 2, 4, 4, 5][index]!,
}));

export const demoDifficulties = [
  { label: "Vontade de doce", count: 4, window: "entre 16h e 18h", meal: "Lanche da tarde" },
  { label: "Falta de tempo", count: 3, window: "no horário do almoço", meal: "Almoço" },
  { label: "Ansiedade/estresse", count: 2, window: "no fim da noite", meal: "Jantar" },
];
